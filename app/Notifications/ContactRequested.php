<?php

namespace App\Notifications;

use App\Models\Loan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class ContactRequested extends Notification implements ShouldQueue
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
            ->subject('Demande de coordonnées pour un prêt 📞')
            ->greeting('Bonjour,')
            ->line("{$this->loan->borrower->name} souhaite obtenir vos coordonnées pour le prêt de \"{$this->loan->item->name}\".")
            ->line('Vous pouvez choisir quelles informations partager (email, téléphone, adresse).')
            ->action('Partager mes coordonnées', route('loans.show', $this->loan))
            ->line('Merci de votre confiance !');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'loan_id' => $this->loan->id,
            'item_name' => $this->loan->item->name,
            'borrower_name' => $this->loan->borrower->name,
            'message' => "{$this->loan->borrower->name} souhaite obtenir vos coordonnées.",
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'loan_id' => $this->loan->id,
            'item_name' => $this->loan->item->name,
            'message' => "{$this->loan->borrower->name} souhaite obtenir vos coordonnées.",
        ]);
    }
}
