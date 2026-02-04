<?php

namespace App\Notifications;

use App\Models\Loan;
use App\Models\Message;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class NewMessage extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Message $message
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouveau message de ' . $this->message->sender->name)
            ->greeting('Bonjour,')
            ->line("Vous avez reçu un nouveau message de {$this->message->sender->name} concernant le prêt de \"{$this->message->loan->item->name}\".")
            ->line("**Message :** {$this->message->content}")
            ->action('Répondre', route('loans.show', $this->message->loan))
            ->line('Merci d\'utiliser notre plateforme !');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message_id' => $this->message->id,
            'loan_id' => $this->message->loan_id,
            'sender_name' => $this->message->sender->name,
            'item_name' => $this->message->loan->item->name,
            'content' => $this->message->content,
            'message' => "Nouveau message de {$this->message->sender->name}",
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message_id' => $this->message->id,
            'loan_id' => $this->message->loan_id,
            'sender_name' => $this->message->sender->name,
            'content' => $this->message->content,
            'message' => "Nouveau message de {$this->message->sender->name}",
        ]);
    }
}
