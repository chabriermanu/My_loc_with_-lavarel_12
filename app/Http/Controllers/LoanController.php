<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Message;
use App\Http\Requests\StoreLoanRequest;
use App\Http\Requests\UpdateLoanRequest;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class LoanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Prêts où je suis propriétaire (j'ai prêté mes objets)
        $myLoansAsOwner = Loan::with(['item', 'borrower'])
            ->where('owner_id', Auth::id())
            ->latest()
            ->paginate(10);

        // Prêts où je suis emprunteur (j'ai emprunté)
        $myLoansAsBorrower = Loan::with(['item', 'owner'])
            ->where('borrower_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('Loans/Index', [
            'myLoansAsOwner' => $myLoansAsOwner,
            'myLoansAsBorrower' => $myLoansAsBorrower,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
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

    public function update(UpdateLoanRequest $request, Loan $loan)
    {
        Gate::authorize('update', $loan); // ✅ Utilisation de la policy

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

    /**
     * Display the specified resource.
     */
    public function show(Loan $loan)
    {
        Gate::authorize('view', $loan); // ✅ Utilisation de la policy

        $loan->load(['item', 'owner', 'borrower', 'messages.sender', 'messages.receiver']);

        // Marquer les messages non lus comme lus
        $loan->messages
            ->where('receiver_id', Auth::id())
            ->whereNull('read_at')
            ->each->markAsRead();

        return Inertia::render('Loans/Show', [
            'loan' => $loan,
            'canRequestContact' => Gate::allows('requestContact', $loan),
            'canShareContact' => Gate::allows('shareContact', $loan),
            'canViewContactInfo' => Gate::allows('viewContactInfo', $loan),
            'contactInfo' => Gate::allows('viewContactInfo', $loan)
                ? $loan->getSharedContactInfo()
                : null,
        ]);
    }

    public function cancel(Loan $loan)
    {
        Gate::authorize('cancel', $loan); // ✅ Utilisation de la policy

        if (!in_array($loan->status, ['pending', 'approved'])) {
            return back()->with('error', 'Ce prêt ne peut plus être annulé (déjà en cours ou terminé)');
        }

        $loan->update(['status' => 'cancelled']);

        return back()->with('success', 'Prêt annulé avec succès');
    }

    public function approve(Loan $loan)
    {
        Gate::authorize('approve', $loan); // ✅ Utilisation de la policy

        if ($loan->status !== 'pending') {
            return back()->with('error', 'Ce prêt ne peut pas être approuvé');
        }

        $loan->update(['status' => 'approved']);

        // TODO: Envoyer notification à l'emprunteur

        return back()->with('success', 'Prêt approuvé !');
    }

    public function reject(Loan $loan)
    {
        Gate::authorize('reject', $loan); // ✅ Utilisation de la policy

        if ($loan->status !== 'pending') {
            return back()->with('error', 'Seules les demandes en attente peuvent être refusées');
        }

        $loan->update(['status' => 'cancelled']);

        // TODO: Envoyer notification à l'emprunteur

        return back()->with('success', 'Prêt refusé avec succès !');
    }

    public function complete(Loan $loan)
    {
        Gate::authorize('complete', $loan); // ✅ Utilisation de la policy

        if ($loan->status !== 'in_progress') {
            return back()->with('error', 'Seuls les prêts en cours peuvent être marqués comme retournés');
        }

        $loan->update(['status' => 'completed', 'returned_at' => now()]);

        return back()->with('success', 'Prêt restitué avec succès !');
    }

    // ========== NOUVELLES MÉTHODES : PARTAGE DE COORDONNÉES ==========

    /**
     * Demander les coordonnées du propriétaire (emprunteur)
     */
    public function requestContact(Loan $loan)
    {
        Gate::authorize('requestContact', $loan);

        try {
            $loan->requestContact();

            // TODO: Envoyer notification au propriétaire

            return back()->with('success', 'Demande de coordonnées envoyée au propriétaire !');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Partager ses coordonnées (propriétaire)
     */
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

            // TODO: Envoyer notification à l'emprunteur

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

    // ========== NOUVELLES MÉTHODES : MESSAGERIE ==========

    /**
     * Envoyer un message
     */
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

        // TODO: Envoyer notification temps réel (Pusher/Echo)

        return back()->with('success', 'Message envoyé !');
    }

    /**
     * Nombre de messages non lus pour l'utilisateur
     */
    public function unreadMessagesCount()
    {
        $count = Message::where('receiver_id', Auth::id())
            ->whereNull('read_at')
            ->count();

        return response()->json(['unread_count' => $count]);
    }
}
