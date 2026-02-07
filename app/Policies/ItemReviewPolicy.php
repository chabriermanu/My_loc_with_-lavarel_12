<?php

namespace App\Policies;

use App\Models\Item;
use App\Models\ItemReview;
use App\Models\Loan;
use App\Models\User;

class ItemReviewPolicy
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
    public function view(?User $user, ItemReview $review): bool
    {
        return true;
    }

    /**
     * Créer un avis sur un item
     * 
     * Conditions :
     * 1. Ne peut pas noter son propre item
     * 2. Doit avoir complété un prêt avec cet item
     * 3. Ne peut laisser qu'un seul avis par item
     */
    public function create(User $user, Item $item): bool
    {
        // 1. L'utilisateur ne peut pas noter son propre item
        if ($item->user_id === $user->id) {
            return false;
        }

        // 2. Vérifier qu'un prêt complété existe
        $hasCompletedLoan = Loan::where('item_id', $item->id)
            ->where('borrower_id', $user->id)
            ->where('status', 'completed')
            ->exists();

        if (!$hasCompletedLoan) {
            return false;
        }

        // 3. Vérifier qu'un avis n'existe pas déjà
        $hasExistingReview = ItemReview::where('item_id', $item->id)
            ->where('user_id', $user->id)
            ->exists();

        return !$hasExistingReview;
    }

    /**
     * Modifier son propre avis
     */
    public function update(User $user, ItemReview $review): bool
    {
        return $review->user_id === $user->id;
    }

    /**
     * Supprimer un avis
     * L'auteur OU le propriétaire de l'item peuvent supprimer
     */
    public function delete(User $user, ItemReview $review): bool
    {
        // L'auteur peut supprimer son avis
        if ($review->user_id === $user->id) {
            return true;
        }

        // Le propriétaire de l'item peut supprimer un avis sur son item
        if ($review->item->user_id === $user->id) {
            return true;
        }

        // Admin peut supprimer (optionnel)
        if ($user->is_admin) {
            return true;
        }

        return false;
    }
}
