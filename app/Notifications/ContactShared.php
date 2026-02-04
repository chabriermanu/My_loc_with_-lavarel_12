<?php

namespace App\Notifications;

use App\Models\Loan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class ContactShared extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Loan $loan
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Coordonnées partagées ! 📞')
            ->greeting('Bonne nouvelle !')
            ->line("{$this->loan->owner->name} a partagé ses coordonnées avec vous pour le prêt de \"{$this->loan->item->name}\".")
            ->line('Vous pouvez maintenant organiser la récupération de l\'objet.')
            ->action('Voir les coordonnées', route('loans.show', $this->loan))
            ->line('Merci d\'utiliser notre plateforme !');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'loan_id' => $this->loan->id,
            'item_name' => $this->loan->item->name,
            'owner_name' => $this->loan->owner->name,
            'message' => "{$this->loan->owner->name} a partagé ses coordonnées avec vous.",
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'loan_id' => $this->loan->id,
            'item_name' => $this->loan->item->name,
            'message' => "{$this->loan->owner->name} a partagé ses coordonnées avec vous.",
        ]);
    }
}
