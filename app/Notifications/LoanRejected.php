<?php

namespace App\Notifications;

use App\Models\Loan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class LoanRejected extends Notification implements ShouldQueue
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
            ->subject('Votre demande de prêt a été refusée')
            ->greeting('Bonjour,')
            ->line("Malheureusement, votre demande pour emprunter \"{$this->loan->item->name}\" a été refusée par {$this->loan->owner->name}.")
            ->line("N'hésitez pas à consulter d'autres objets disponibles sur la plateforme !")
            ->action('Voir les objets disponibles', route('items.index'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'loan_id' => $this->loan->id,
            'item_name' => $this->loan->item->name,
            'owner_name' => $this->loan->owner->name,
            'message' => "Votre demande pour emprunter \"{$this->loan->item->name}\" a été refusée.",
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'loan_id' => $this->loan->id,
            'item_name' => $this->loan->item->name,
            'message' => "Votre demande pour emprunter \"{$this->loan->item->name}\" a été refusée.",
        ]);
    }
}
