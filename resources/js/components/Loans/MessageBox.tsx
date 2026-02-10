import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types/auth';
import { router } from '@inertiajs/react';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

declare function route(name: string, params?: any): string;

interface Message {
    id: number;
    loan_id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at: string;
    sender?: User;
}

interface MessageBoxProps {
    loanId: number;
    currentUserId: number;
    initialMessages: Message[];
    otherUser: User;
}

export default function MessageBox({
    loanId,
    currentUserId,
    initialMessages,
    otherUser,
}: MessageBoxProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll vers le bas
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim()) return;

        setIsSending(true);

        router.post(
            route('loans.send-message', loanId),
            { content: newMessage },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNewMessage('');
                },
                onFinish: () => setIsSending(false),
            },
        );
    };
    // ⭐ AJOUTE CE useEffect pour le WebSocket
    useEffect(() => {
        if (!loanId) return;

        console.log('🔌 Connexion au canal privé loan.' + loanId);

        // Écouter le canal PRIVÉ (car configuré dans channels.php)
        const channel = window.Echo.private(`loan.${loanId}`).listen(
            '.message.sent',
            (e: any) => {
               

                // Ajoute le nouveau message SEULEMENT si ce n'est pas le tien
                if (e.message.sender_id !== currentUserId) {
                    setMessages((prev) => [...prev, e.message]);
                }
            },
        );

        return () => {
           
            window.Echo.leave(`loan.${loanId}`);
        };
    }, [loanId, currentUserId]);

    return (
        <div className="flex h-[500px] flex-col rounded-lg border bg-white shadow-sm">
            {/* Header */}
            <div className="border-b p-4">
                <h3 className="font-semibold">
                    Conversation avec {otherUser.pseudo || otherUser.name}
                </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500">
                        Aucun message. Commencez la conversation !
                    </p>
                ) : (
                    messages.map((message) => {
                        const isOwn = message.sender_id === currentUserId;
                        return (
                            <div
                                key={message.id}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${
                                        isOwn
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                    }`}
                                >
                                    <p className="text-sm">{message.content}</p>
                                    <p
                                        className={`mt-1 text-xs ${
                                            isOwn
                                                ? 'text-blue-100'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        {new Date(
                                            message.created_at,
                                        ).toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="border-t p-4">
                <div className="flex gap-2">
                    <Textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez votre message..."
                        className="resize-none"
                        rows={2}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="self-end"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                    Appuyez sur Entrée pour envoyer
                </p>
            </form>
        </div>
    );
}
