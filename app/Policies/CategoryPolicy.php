<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
    /**
     * Voir toutes les catégories (public)
     */
    public function viewAny(?User $user): bool
    {
        return true;
    }

    /**
     * Voir une catégorie (public)
     */
    public function view(?User $user, Category $category): bool
    {
        return true;
    }

    /**
     * Créer une catégorie (admin uniquement)
     */
    public function create(User $user): bool
    {
        return $user->is_admin === true;
    }

    /**
     * Modifier une catégorie (admin uniquement)
     */
    public function update(User $user, Category $category): bool
    {
        return $user->is_admin === true;
    }

    /**
     * Supprimer une catégorie (admin uniquement)
     * 
     * Conditions :
     * 1. Doit être admin
     * 2. Aucun item ne doit être lié
     * 3. Aucune sous-catégorie ne doit exister
     */
    public function delete(User $user, Category $category): bool
    {
        // 1. Seuls les admins
        if (!$user->is_admin) {
            return false;
        }

        // 2. Vérifier qu'aucun item n'est lié
        if ($category->items()->exists()) {
            return false;
        }

        // 3. Vérifier qu'il n'y a pas de sous-catégories
        if ($category->children()->exists()) {
            return false;
        }

        return true;
    }

    /**
     * Restaurer une catégorie (admin uniquement)
     */
    public function restore(User $user, Category $category): bool
    {
        return $user->is_admin === true;
    }

    /**
     * Supprimer définitivement (admin uniquement)
     */
    public function forceDelete(User $user, Category $category): bool
    {
        return $user->is_admin === true;
    }
}
