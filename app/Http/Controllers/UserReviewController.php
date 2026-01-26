<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserReviewRequest;
use App\Http\Requests\UpdateUserReviewRequest;
use App\Models\Loan;
use App\Models\User;
use App\Models\UserReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserReviewController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserReviewRequest $request)
    {
        // 1. Récupérer le loan
        $loan = Loan::findOrFail($request->loan_id);

        // 2. Vérifier que je suis concerné
        if ($loan->owner_id !== Auth::id() && $loan->borrower_id !== Auth::id()) {
            abort(403);
        }

        // 3. Vérifier que le loan est terminé
        if ($loan->status !== 'completed') {
            return back()->with('error', "Vous ne pouvez noter qu'un prêt terminé");
        }

        // 4. Déterminer qui je note et le type
        if ($loan->owner_id === Auth::id()) {

            // Je suis le propriétaire → je note l'emprunteur
            $revieweeId = $loan->borrower_id;
            $type = 'as_owner';
        } else {
            // Je suis l'emprunteur → je note le propriétaire
            $revieweeId = $loan->owner_id;
            $type = 'as_borrower';
        }
        UserReview::create([
            'reviewer_id' => Auth::id(),                    // Moi qui note
            'reviewee_id' => $revieweeId,                   // La personne notée (déterminé avant)
            'loan_id' => $request->loan_id,
            'type' => $type,                                 // 'as_owner' ou 'as_borrower' (déterminé avant)
            'rating' => $request->rating,
            'comment' => $request->comment,
            'punctuality_rating' => $request->punctuality_rating,
            'communication_rating' => $request->communication_rating,
            'condition_respect_rating' => $request->condition_respect_rating,
        ]);

        // Recalculer la moyenne
        $user = User::find($revieweeId);
        $avgRating = $user->receivedReviews()->avg('rating');
        $totalRatings = $user->receivedReviews()->count();

        $user->update([
            'rating' => round($avgRating, 2),
            'total_ratings' => $totalRatings,
        ]);


        return redirect()->route('loans.show', $request->loan_id)
            ->with('success', 'Avis ajouté avec succès !');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserReviewRequest $request, UserReview $userReview)
    {
        // Vérifier que c'est MON avis
        if ($userReview->reviewer_id !== Auth::id()) {
            abort(403);
        }

        // Mettre à jour l'avis
        $userReview->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
            'punctuality_rating' => $request->punctuality_rating,
            'communication_rating' => $request->communication_rating,
            'condition_respect_rating' => $request->condition_respect_rating,
        ]);

        // Recalculer la moyenne de la personne notée
        $reviewee = $userReview->reviewee; // Via la relation
        $avgRating = $reviewee->receivedReviews()->avg('rating');
        $totalRatings = $reviewee->receivedReviews()->count();

        $reviewee->update([
            'rating' => round($avgRating, 2),
            'total_ratings' => $totalRatings,
        ]);

        return redirect()->route('loans.show', $userReview->loan_id)
            ->with('success', 'Avis modifié avec succès !');
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserReview $userReview)
    {
        // Vérifier que c'est MON avis
        if ($userReview->reviewer_id !== Auth::id()) {
            abort(403);
        }
        
        $reviewee = $userReview->reviewee;
        $loanId = $userReview->loan_id;
       
        $userReview->delete();

        // Recalculer la moyenne de la personne notée
        
        $avgRating = $reviewee->receivedReviews()->avg('rating');
        $totalRatings = $reviewee->receivedReviews()->count();

        $reviewee->update([
            'rating' => round($avgRating, 2),
            'total_ratings' => $totalRatings,
        ]);

        return redirect()->route('loans.show', $userReview->loan_id)
            ->with('success', 'Avis supprimé avec succès !');
    }
}
