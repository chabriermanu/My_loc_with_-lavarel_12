<?php

namespace App\Policies;

use App\Models\Item;
use App\Models\ItemMedia;
use App\Models\User;

class ItemMediaPolicy
{
    /**
     * Ajouter des médias à un item
     * Seul le propriétaire peut ajouter des médias
     */
    public function create(User $user, Item $item): bool
    {
        return $item->user_id === $user->id;
    }

    /**
     * Uploader un média
     */
    public function store(User $user, Item $item): bool
    {
        return $item->user_id === $user->id;
    }

    /**
     * Voir les médias (publics)
     */
    public function view(?User $user, ItemMedia $media): bool
    {
        return true;
    }

    /**
     * Voir tous les médias (publics)
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Supprimer un média
     * Seul le propriétaire de l'item peut supprimer
     */
    public function delete(User $user, ItemMedia $media): bool
    {
        return $media->item->user_id === $user->id;
    }

    /**
     * Modifier un média (ordre, type)
     */
    public function update(User $user, ItemMedia $media): bool
    {
        return $media->item->user_id === $user->id;
    }
}
