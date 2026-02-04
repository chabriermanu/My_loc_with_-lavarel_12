<?php

namespace App\Notifications;

use App\Models\Loan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class LoanApproved extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Loan $loan
    ) {}

    /**
     * Canaux de notification : email + database + broadcast (temps réel)
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    /**
     * Email de notification
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Votre demande de prêt a été approuvée !')
            ->greeting('Bonne nouvelle ! 🎉')
            ->line("Votre demande pour emprunter \"{$this->loan->item->name}\" a été approuvée par {$this->loan->owner->name}.")
            ->line("**Période :** Du {$this->loan->start_date->format('d/m/Y')} au {$this->loan->end_date->format('d/m/Y')}")
            ->action('Voir les détails du prêt', route('loans.show', $this->loan))
            ->line('Vous pouvez maintenant contacter le propriétaire pour organiser la récupération.');
    }

    /**
     * Données stockées en base de données
     */
    public function toArray(object $notifiable): array
    {
        return [
            'loan_id' => $this->loan->id,
            'item_name' => $this->loan->item->name,
            'owner_name' => $this->loan->owner->name,
            'start_date' => $this->loan->start_date->format('d/m/Y'),
            'end_date' => $this->loan->end_date->format('d/m/Y'),
            'message' => "Votre demande pour emprunter \"{$this->loan->item->name}\" a été approuvée !",
        ];
    }

    /**
     * Message broadcast (temps réel via Pusher)
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'loan_id' => $this->loan->id,
            'item_name' => $this->loan->item->name,
            'owner_name' => $this->loan->owner->name,
            'message' => "Votre demande pour emprunter \"{$this->loan->item->name}\" a été approuvée !",
        ]);
    }
}
