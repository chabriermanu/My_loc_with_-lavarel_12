<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreItemReviewRequest;
use App\Http\Requests\UpdateItemReviewRequest;
use App\Models\Item;
use App\Models\ItemReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ItemReviewController extends Controller
{


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemReviewRequest $request, $item)  // ⭐ Pas de type Item
    {
        // Récupérer l'item manuellement
        $item = Item::findOrFail($item);

        // Vérifier que l'utilisateur a bien complété un prêt
        $loan = $item->loans()
            ->where('id', $request->loan_id)
            ->where('borrower_id', Auth::id())
            ->where('status', 'completed')
            ->first();

        if (!$loan) {
            return back()->withErrors(['error' => 'Vous ne pouvez pas laisser d\'avis pour cet item.']);
        }

        // Vérifier qu'il n'a pas déjà laissé un avis
        if ($item->reviews()->where('user_id', Auth::id())->exists()) {
            return back()->withErrors(['error' => 'Vous avez déjà laissé un avis pour cet item.']);
        }

        ItemReview::create([
            'item_id' => $item->id,
            'user_id' => Auth::id(),
            'loan_id' => $request->loan_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Recalculer la moyenne
        $avgRating = $item->reviews()->avg('rating');
        $totalRatings = $item->reviews()->count();

        $item->update([
            'rating' => round($avgRating, 2),
            'total_ratings' => $totalRatings,
        ]);

        return back()->with('success', 'Avis ajouté avec succès !');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemReviewRequest $request, ItemReview $itemReview)
    {
        if ($itemReview->user_id !== Auth::id()) {
            abort(403);
        }
        $itemReview->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $item = $itemReview->item;  // Via la relation
        $avgRating = $item->reviews()->avg('rating');
        $totalRatings = $item->reviews()->count();

        $item->update([
            'rating' => round($avgRating, 2),
            'total_ratings' => $totalRatings,
        ]);

        return redirect()->route('items.show', $itemReview->item_id)
            ->with('success', 'Avis modifié avec succès !');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ItemReview $itemReview)
    {
        if ($itemReview->user_id !== Auth::id()) {
            abort(403);
        }

        // Récupérer AVANT de supprimer
        $item = $itemReview->item;
        $itemId = $itemReview->item_id;

        $itemReview->delete();


        $avgRating = $item->reviews()->avg('rating');
        $totalRatings = $item->reviews()->count();

        $item->update([
            'rating' => round($avgRating, 2),
            'total_ratings' => $totalRatings,
        ]);

        return redirect()->route('items.show', $itemId)
            ->with('success', 'Avis supprimé avec succès !');
    }
}
