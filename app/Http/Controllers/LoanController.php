<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Http\Requests\StoreLoanRequest;
use App\Http\Requests\UpdateLoanRequest;
use App\Models\Item;
use Illuminate\Support\Facades\Auth;

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
            'start_time'=>$request->start_time,
            'end_date' => $request->end_date,
            'end_time'=>$request->end_time,
            'status' => 'pending',
            'notes' => $request->notes,
        ]);

        return redirect()->route('loans.index')
            ->with('success', 'Demande prêt envoyée !');
    }

        public function update(UpdateLoanRequest $request, Loan $loan)
    {
        // Sécurité supplémentaire (en plus de UpdateLoanRequest)
        if (!($request->user()->id === $loan->borrower_id || $request->user()->id === $loan->owner_id)) {
            abort(403, 'Action non autorisée');
        }

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
        if ($loan->owner_id !== Auth::id() && $loan->borrower_id !== Auth::id()) {
            abort(403, 'Action non autorisée');
        }
        $loan->load(['item', 'owner', 'borrower']);

        return Inertia::render('Loans/Show', [
            'loan' => $loan,

        ]);
    }

    public function cancel(Loan $loan)
    {
        // Vérifier que c'est l'emprunteur OU le propriétaire
        if ($loan->borrower_id !== Auth::id() && $loan->owner_id !== Auth::id()) {
            abort(403);
        }

        // On peut annuler seulement si pending ou approved
        if (!in_array($loan->status, ['pending', 'approved'])) {
            return back()->with('error', 'Ce prêt ne peut plus être annulé (déjà en cours ou terminé)');
        }

        $loan->update(['status' => 'cancelled']);

        return back()->with('success', 'Prêt annulé avec succès');
    }

    public function approve(Loan $loan)
    {
        if ($loan->owner_id !== Auth::id()) {
            abort(403);
        }
        if ($loan->status !== 'pending') {
            return back()->with('error', 'Ce prêt ne peut pas être approuvé');
        }
        $loan->update(['status' => 'approved']);
        return back()->with('success', 'Prêt approuvé !');
    }

    public function reject(Loan $loan)
    {
        if ($loan->owner_id !== Auth::id()) {
            abort(403);
        }
        if ($loan->status !== 'pending') {
            return back()->with('error', 'Seules les demandes en attente peuvent être refusées');
        }
        $loan->update(['status' => 'cancelled']);
        return back()->with('success', 'Prêt refusé avec succès !');
    }

    public function complete(Loan $loan)
    {
        if ($loan->owner_id !== Auth::id()) {
            abort(403);
        }
        if ($loan->status !== 'in_progress') {
            return back()->with('error', 'Seuls les prêts en cours peuvent être marqués comme retournés');
        }
        $loan->update(['status' => 'completed', 'returned_at' => now()]);
        return back()->with('success', 'Pret a été restituer avec succès !');
    }

    
}
