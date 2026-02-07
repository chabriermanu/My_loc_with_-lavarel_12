<?php

namespace App\Policies;

use App\Models\Loan;
use App\Models\User;
use App\Models\UserReview;

class UserReviewPolicy
{
    /**
     * Voir les avis (publics)
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Voir un avis spécifique (public)
     */
    public function view(?User $user, UserReview $review): bool
    {
        return true;
    }

    /**
     * Créer un avis sur un utilisateur
     * 
     * Conditions :
     * 1. Ne peut pas se noter soi-même
     * 2. Doit être lié via un prêt complété
     * 3. Ne peut laisser qu'un seul avis par prêt
     * 4. Le loan_id doit être fourni et valide
     */
    public function create(User $reviewer, User $reviewed, ?Loan $loan = null): bool
    {
        // 1. Ne peut pas se noter soi-même
        if ($reviewer->id === $reviewed->id) {
            return false;
        }

        // 2. Un prêt doit être fourni
        if (!$loan) {
            return false;
        }

        // 3. Le prêt doit être complété
        if ($loan->status !== 'completed') {
            return false;
        }

        // 4. Le reviewer doit être impliqué dans le prêt
        $isReviewerInvolved = ($loan->borrower_id === $reviewer->id) ||
            ($loan->lender_id === $reviewer->id);

        if (!$isReviewerInvolved) {
            return false;
        }

        // 5. Le reviewed doit être l'autre partie du prêt
        $isReviewedOtherParty = ($loan->borrower_id === $reviewed->id && $loan->lender_id === $reviewer->id) ||
            ($loan->lender_id === $reviewed->id && $loan->borrower_id === $reviewer->id);

        if (!$isReviewedOtherParty) {
            return false;
        }

        // 6. Vérifier qu'un avis n'existe pas déjà pour ce prêt
        $hasExistingReview = UserReview::where('loan_id', $loan->id)
            ->where('reviewer_id', $reviewer->id)
            ->where('reviewed_id', $reviewed->id)
            ->exists();

        return !$hasExistingReview;
    }

    /**
     * Modifier son propre avis
     */
    public function update(User $user, UserReview $review): bool
    {
        return $review->reviewer_id === $user->id;
    }

    /**
     * Supprimer un avis
     * L'auteur OU la personne notée peuvent supprimer
     */
    public function delete(User $user, UserReview $review): bool
    {
        // L'auteur peut supprimer son avis
        if ($review->reviewer_id === $user->id) {
            return true;
        }

        // La personne notée peut demander le retrait
        if ($review->reviewed_id === $user->id) {
            return true;
        }

        // Admin peut supprimer
        if ($user->is_admin) {
            return true;
        }

        return false;
    }
}
