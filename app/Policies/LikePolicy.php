<?php

namespace App\Policies;

use App\Models\Item;
use App\Models\User;

class LikePolicy
{
    /**
     * Liker/unliker un item
     * Un utilisateur peut liker n'importe quel item sauf le sien
     */
    public function toggle(User $user, string $likeableType, int $likeableId): bool
    {
        // Si c'est un Item
        if ($likeableType === 'App\Models\Item' || $likeableType === 'Item') {
            $item = Item::find($likeableId);

            if (!$item) {
                return false;
            }

            // L'utilisateur ne peut pas liker son propre item
            return $item->user_id !== $user->id;
        }

        // Pour d'autres types de likeable (futurs)
        return true;
    }

    /**
     * Voir les likes (publics)
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }
}
