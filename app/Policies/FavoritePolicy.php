<?php

namespace App\Policies;

use App\Models\Favorite;
use App\Models\Item;
use App\Models\User;

class FavoritePolicy
{
    /**
     * Ajouter/retirer un favori
     * Un utilisateur peut favoriser n'importe quel item sauf le sien
     */
    public function toggle(User $user, Item $item): bool
    {
        // L'utilisateur ne peut pas favoriser son propre item
        return $item->user_id !== $user->id;
    }

    /**
     * Voir la liste de ses favoris
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Voir un favori spécifique
     */
    public function view(User $user, Favorite $favorite): bool
    {
        return $favorite->user_id === $user->id;
    }

    /**
     * Supprimer un favori
     */
    public function delete(User $user, Favorite $favorite): bool
    {
        return $favorite->user_id === $user->id;
    }
}
