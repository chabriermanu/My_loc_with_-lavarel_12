<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Message;
use App\Http\Requests\StoreLoanRequest;
use App\Http\Requests\UpdateLoanRequest;
use App\Models\Item;
use App\Notifications\LoanApproved;
use App\Notifications\LoanRejected;
use App\Notifications\ContactRequested;
use App\Notifications\ContactShared;
use App\Notifications\NewMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class LoanController extends Controller
{
    //-----------------------------------------
    // 1) ROUTES REST PRINCIPALES
    //--------------------------------------------
    public function index()
    {
        // Prêts où je suis propriétaire (j'ai prêté mes objets)
        $myLoansAsOwner = Loan::with(['item.owner', 'borrower', 'messages'])
            ->where('owner_id', Auth::id())
            ->latest()
            ->paginate(10);

        // Prêts où je suis emprunteur (j'ai emprunté)
        $myLoansAsBorrower = Loan::with(['item.owner', 'owner', 'messages'])
            ->where('borrower_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Loans/Index', [
            'myLoansAsOwner' => $myLoansAsOwner,
            'myLoansAsBorrower' => $myLoansAsBorrower,
        ]);
    }

    public function create(Request $request)
    {
        $itemId = $request->query('item');

        if (!$itemId) {
            return redirect()->route('items.index')
                ->with('error', 'Aucun item spécifié');
        }

        // ✅ Charger les relations nécessaires
        $item = Item::with(['owner', 'category'])->findOrFail($itemId);

        if ($item->user_id === Auth::id()) {
            return redirect()->route('items.show', $item)
                ->with('error', 'Vous ne pouvez pas emprunter votre propre item');
        }

        if (!$item->is_available) {
            return redirect()->route('items.show', $item)
                ->with('error', 'Cet item n\'est pas disponible');
        }

        return Inertia::render('Loans/Create', [
            'item' => $item,
        ]);
    }

    public function store(StoreLoanRequest $request)
    {
        $item = Item::findOrFail($request->item_id);

        if (!$item->is_available) {
            return redirect()->back()
                ->with('error', 'Cet item n\'est pas disponible');
        }

        Loan::create([
            'item_id' => $item->id,
            'owner_id' => $item->user_id,
            'borrower_id' => Auth::id(),
            'start_date' => $request->start_date,
            'start_time' => $request->start_time,
            'end_date' => $request->end_date,
            'end_time' => $request->end_time,
            'status' => 'pending',
            'notes' => $request->notes,
        ]);

        return redirect()->route('loans.index')
            ->with('success', 'Demande prêt envoyée !');
    }

    public function show(Loan $loan)
    {
        Gate::authorize('view', $loan);

        // Charger les relations
        $loan->load([
            'item',
            'owner',
            'borrower',
            'messages.sender',
            'messages.receiver'
        ]);

        // 🔥 Recharge les colonnes du modèle AVEC les nouveaux casts
        // (sinon end_time et end_date gardent les anciennes valeurs datetime)
        $loan->refresh();

        // Marquer les messages non lus comme lus
        $loan->messages
            ->where('receiver_id', Auth::id())
            ->whereNull('read_at')
            ->each->markAsRead();

        \Log::info('DEBUG SHOW', [
            'end_date' => $loan->end_date,
            'end_time' => $loan->end_time,
            'showContact' => $this->shouldShowBorrowerContact($loan),
        ]);



        return Inertia::render('Loans/Show', [
            'loan' => $loan,
            'userRole' => $loan->owner_id === Auth::id() ? 'owner' : 'borrower',

            'canRequestContact' => Gate::allows('requestContact', $loan),
            'canShareContact' => Gate::allows('shareContact', $loan),
            'canViewContactInfo' => Gate::allows('viewContactInfo', $loan),

            'contactInfo' => $this->shouldShowContactInfo($loan)
                ? $loan->getSharedContactInfo()
                : null,

            // 👉 Affichage automatique si retard
            'showContact' => $this->shouldShowBorrowerContact($loan),

            'borrowerContactInfo' => $this->shouldShowBorrowerContact($loan)
                ? $this->getBorrowerContactInfo($loan)
                : null,
        ]);
    }

    public function update(UpdateLoanRequest $request, Loan $loan)
    {
        Gate::authorize('update', $loan);

        // Vérifier que le prêt peut être modifié selon son statut
        if (!in_array($loan->status, ['pending', 'approved', 'in_progress'])) {
            return back()->with('error', 'Ce prêt ne peut plus être modifié.');
        }

        // Vérifier disponibilité (pas de chevauchement)
        $conflict = Loan::where('item_id', $loan->item_id)
            ->where('id', '!=', $loan->id)
            ->whereIn('status', ['approved', 'in_progress'])
            ->where(function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('start_date', '<=', $request->end_date)
                        ->where('end_date', '>=', $request->start_date);
                });
            })
            ->exists();

        if ($conflict) {
            return back()->with('error', 'L\'item n\'est pas disponible sur cette période.');
        }

        // Mise à jour
        $loan->update([
            'start_date' => $request->start_date,
            'start_time' => $request->start_time,
            'end_date'   => $request->end_date,
            'end_time'   => $request->end_time,
            'notes'      => $request->notes,
        ]);

        return back()->with('success', 'Le prêt a été mis à jour avec succès.');
    }

    // -------------------------
    // 2) PAGES PERSONNALISÉES
    // -------------------------

    // Mes emprunts (ce que j'emprunte)
    public function borrows()
    {
        $borrows = Auth::user()->borrowedLoans()
            ->with(['item.owner', 'item.category'])
            ->latest()
            ->paginate(9);

        return Inertia::render('Loans/Borrows', [
            'borrows' => $borrows
        ]);
    }

    // Mes prêts (ce que je prête)
    public function lends()
    {
        $lends = Auth::user()->ownedLoans()
            ->with(['item', 'borrower'])
            ->latest()
            ->paginate(9);


        return Inertia::render('Loans/Lends', [
            'lends' => $lends
        ]);
    }

    // ---------------------------------------------------------
    // 3) ACTIONS SUR LES PRÊTS (OWNER / BORROWER)
    // ---------------------------------------------------------

    public function cancel(Loan $loan)
    {
        Gate::authorize('cancel', $loan);

        if (!in_array($loan->status, ['pending', 'approved'])) {
            return back()->with('error', 'Ce prêt ne peut plus être annulé (déjà en cours ou terminé)');
        }

        $loan->update(['status' => 'cancelled']);

        return back()->with('success', 'Prêt annulé avec succès');
    }

    public function approve(Loan $loan)
    {
        Gate::authorize('approve', $loan);

        if ($loan->status !== 'pending') {
            return back()->with('error', 'Ce prêt ne peut pas être approuvé');
        }

        $loan->update(['status' => 'in_progress']);

        // ✅ Notification à l'emprunteur
        $loan->borrower->notify(new LoanApproved($loan));

        return back()->with('success', 'Prêt approuvé !');
    }

    public function reject(Loan $loan)
    {
        Gate::authorize('reject', $loan);

        if ($loan->status !== 'pending') {
            return back()->with('error', 'Seules les demandes en attente peuvent être refusées');
        }

        $loan->update(['status' => 'cancelled']);

        // ✅ Notification à l'emprunteur
        $loan->borrower->notify(new LoanRejected($loan));

        return back()->with('success', 'Prêt refusé avec succès !');
    }

    public function complete(Loan $loan)
    {
        Gate::authorize('complete', $loan);

        if ($loan->status !== 'in_progress') {
            return back()->with('error', 'Seuls les prêts en cours peuvent être marqués comme retournés');
        }

        $loan->update(['status' => 'completed', 'returned_at' => now()]);

        return back()->with('success', 'Prêt restitué avec succès !');
    }

    // ---------------------------------------------------------
    // 4) PARTAGE DE COORDONNÉES
    // ---------------------------------------------------------

    public function requestContact(Loan $loan)
    {
        Gate::authorize('requestContact', $loan);

        try {
            $loan->requestContact();

            // ✅ Notification au propriétaire
            $loan->owner->notify(new ContactRequested($loan));

            return back()->with('success', 'Demande de coordonnées envoyée au propriétaire !');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function shareContact(Request $request, Loan $loan)
    {
        Gate::authorize('shareContact', $loan);

        $validated = $request->validate([
            'share_email' => 'required|boolean',
            'share_phone' => 'required|boolean',
            'share_address' => 'required|boolean',
        ]);

        // Au moins une info doit être partagée
        if (!$validated['share_email'] && !$validated['share_phone'] && !$validated['share_address']) {
            return back()->with('error', 'Vous devez partager au moins une information.');
        }

        try {
            $loan->shareContact([
                'email' => $validated['share_email'],
                'phone' => $validated['share_phone'],
                'address' => $validated['share_address'],
            ]);

            // ✅ Notification à l'emprunteur
            $loan->borrower->notify(new ContactShared($loan));

            return back()->with('success', 'Coordonnées partagées avec succès !');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Voir les coordonnées partagées (emprunteur)
     */
    public function viewContactInfo(Loan $loan)
    {
        Gate::authorize('viewContactInfo', $loan);

        return response()->json([
            'contact_info' => $loan->getSharedContactInfo()
        ]);
    }

    // ---------------------------------------------------------
    // 5) MESSAGERIE
    // ---------------------------------------------------------

    public function sendMessage(Request $request, Loan $loan)
    {
        Gate::authorize('sendMessage', $loan);

        $validated = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $user = Auth::user();

        // Déterminer le destinataire
        $receiverId = $loan->borrower_id === $user->id
            ? $loan->owner_id
            : $loan->borrower_id;

        $message = Message::create([
            'loan_id' => $loan->id,
            'sender_id' => $user->id,
            'receiver_id' => $receiverId,
            'content' => $validated['content'],
        ]);

        // ✅ Notification au destinataire
        $receiver = \App\Models\User::find($receiverId);
        $receiver->notify(new NewMessage($message));

        return back()->with('success', 'Message envoyé !');
    }

    public function unreadMessagesCount()
    {
        $count = Message::where('receiver_id', Auth::id())
            ->whereNull('read_at')
            ->count();

        return response()->json(['unread_count' => $count]);
    }

    // ---------------------------------------------------------
    // 6) MÉTHODES PRIVÉES UTILITAIRES
    // ---------------------------------------------------------

    private function shouldShowContactInfo(Loan $loan): bool
    {
        // Si le prêt est cancelled ou completed, masquer
        if (in_array($loan->status, ['completed', 'cancelled'])) {
            return false;
        }

        // Vérifier les permissions normales
        return Gate::allows('viewContactInfo', $loan);
    }

    /**
     * Détermine si les coordonnées de l'emprunteur doivent être affichées au propriétaire
     * - AUTOMATIQUEMENT visible si retard de plus de 4h
     * - Seulement pour le propriétaire
     */
    private function shouldShowBorrowerContact(Loan $loan): bool
    {
        if ($loan->owner_id !== Auth::id()) {
            return false;
        }

        if ($loan->status !== 'in_progress') {
            return false;
        }

        // Récupérer les valeurs BRUTES depuis la base de données (sans casts)
        $endDate = $loan->getRawOriginal('end_date');
        $endTime = $loan->getRawOriginal('end_time');

        // Construire la datetime de fin
        if ($endTime) {
            // Si on a une heure, combiner date + heure
            $endDateTime = Carbon::parse($endDate . ' ' . $endTime);
        } else {
            // Sinon, prendre la fin de la journée
            $endDateTime = Carbon::parse($endDate)->endOfDay();
        }

        // Ajouter 4h de délai de grâce
        $gracePeriodEnd = $endDateTime->copy()->addMinutes(30);

        \Log::info('DEBUG RETARD', [
            'loan_id' => $loan->id,
            'end_date_raw' => $endDate,
            'end_time_raw' => $endTime,
            'end_datetime' => $endDateTime->toDateTimeString(),
            'grace_period_end' => $gracePeriodEnd->toDateTimeString(),
            'now' => now()->toDateTimeString(),
            'is_late' => now()->greaterThan($gracePeriodEnd),
        ]);

        return now()->greaterThan($gracePeriodEnd);
    }

    /**
     * Récupère les coordonnées de l'emprunteur
     */
    private function getBorrowerContactInfo(Loan $loan): array
    {
        $borrower = $loan->borrower;

        return [
            'email' => $borrower->email,
            'phone' => $borrower->phone ?? null,
            'address' => $borrower->full_address ?? null,
        ];
    }
}
