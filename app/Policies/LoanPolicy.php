<?php

namespace App\Policies;

use App\Models\Loan;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LoanPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Tout utilisateur connecté peut voir ses propres prêts
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Loan $loan): bool
    {
        // L'utilisateur peut voir le prêt s'il est propriétaire OU emprunteur
        return $loan->owner_id === $user->id || $loan->borrower_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Tout utilisateur connecté peut créer une demande de prêt
        // La vérification "ne pas emprunter son propre item" est dans le controller
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Loan $loan): bool
    {
        // === EMPRUNTEUR ===
        if ($user->id === $loan->borrower_id) {
            // Peut modifier si pending ou approved
            if (in_array($loan->status, ['pending', 'approved'])) {
                return true;
            }

            // Peut modifier si in_progress mais pas encore commencé
            if ($loan->status === 'in_progress') {
                $start = $loan->start_date->format('Y-m-d') . ' ' . $loan->start_time;
                return now()->lt($start);
            }

            return false;
        }

        // === PROPRIÉTAIRE ===
        if ($user->id === $loan->owner_id) {
            // Peut modifier si pending ou approved
            if (in_array($loan->status, ['pending', 'approved'])) {
                return true;
            }

            // Peut modifier si in_progress tant que pas retourné
            if ($loan->status === 'in_progress' && $loan->returned_at === null) {
                return true;
            }

            return false;
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Loan $loan): bool
    {
        // Seul le créateur (emprunteur) peut supprimer si statut pending
        return $loan->borrower_id === $user->id && $loan->status === 'pending';
    }

    /**
     * Annuler un prêt
     */
    public function cancel(User $user, Loan $loan): bool
    {
        // L'emprunteur OU le propriétaire peut annuler
        if ($loan->borrower_id !== $user->id && $loan->owner_id !== $user->id) {
            return false;
        }

        // On peut annuler seulement si pending ou approved
        return in_array($loan->status, ['pending', 'approved']);
    }

    /**
     * Approuver une demande de prêt
     */
    public function approve(User $user, Loan $loan): bool
    {
        // Seul le propriétaire peut approuver
        return $loan->owner_id === $user->id && $loan->status === 'pending';
    }

    /**
     * Refuser une demande de prêt
     */
    public function reject(User $user, Loan $loan): bool
    {
        // Seul le propriétaire peut refuser
        return $loan->owner_id === $user->id && $loan->status === 'pending';
    }

    /**
     * Marquer comme complété (retourné)
     */
    public function complete(User $user, Loan $loan): bool
    {
        // Seul le propriétaire peut marquer comme retourné
        return $loan->owner_id === $user->id && $loan->status === 'in_progress';
    }

    /**
     * Demander les coordonnées du propriétaire
     */
    public function requestContact(User $user, Loan $loan): bool
    {
        return $loan->borrower_id === $user->id
            && in_array($loan->status, ['approved', 'in_progress'])
            && !$loan->contact_requested;
    }

    /**
     * Partager les coordonnées
     */
    public function shareContact(User $user, Loan $loan): bool
    {
        return $loan->owner_id === $user->id
            && $loan->contact_requested
            && !$loan->contact_shared;
    }

    /**
     * Voir les coordonnées complètes
     */
    public function viewContactInfo(User $user, Loan $loan): bool
    {
        return $loan->borrower_id === $user->id
            && in_array($loan->status, ['approved', 'in_progress', 'completed'])
            && $loan->contact_shared;
    }

    /**
     * Envoyer un message
     */
    public function sendMessage(User $user, Loan $loan): bool
    {
        // L'emprunteur OU le propriétaire peut envoyer des messages
        return $loan->borrower_id === $user->id || $loan->owner_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Loan $loan): bool
    {
        // Généralement réservé aux admins
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Loan $loan): bool
    {
        // Généralement réservé aux admins
        return false;
    }
}
