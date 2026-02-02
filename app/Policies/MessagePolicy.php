<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;

class MessagePolicy
{
    /**
     * Voir un message
     */
    public function view(User $user, Message $message): bool
    {
        return $message->sender_id === $user->id
            || $message->receiver_id === $user->id;
    }

    /**
     * Marquer comme lu
     */
    public function markAsRead(User $user, Message $message): bool
    {
        return $message->receiver_id === $user->id;
    }

    /**
     * Supprimer un message (optionnel)
     */
    public function delete(User $user, Message $message): bool
    {
        // Seul l'expéditeur peut supprimer son propre message
        return $message->sender_id === $user->id;
    }
}
