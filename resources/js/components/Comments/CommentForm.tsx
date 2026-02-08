// resources/js/components/Comments/CommentForm.tsx
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { useState } from 'react';

declare function route(name: string, params?: any): string;

interface CommentFormProps {
    itemId: number;
    itemOwnerId: number;
    currentUserId?: number;
}

export default function CommentForm({
    itemId,
    itemOwnerId,
    currentUserId,
}: CommentFormProps) {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        router.post(
            route('comments.store'),
            {
                item_id: itemId,
                content: content,
                parent_id: null,
            },
            {
                preserveScroll: true,
                onSuccess: () => setContent(''),
            },
        );
    };

    // Si pas connecté
    if (!currentUserId) {
        return (
            <p className="mb-6 text-gray-500">
                Connectez-vous pour laisser un commentaire
            </p>
        );
    }

    // Si c'est son propre item
    if (currentUserId === itemOwnerId) {
        return (
            <div className="mb-6 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                    💡 Vous ne pouvez pas commenter votre propre item, mais vous
                    pouvez répondre aux commentaires des autres.
                </p>
            </div>
        );
    }

    // Formulaire normal
    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Laisser un commentaire..."
                className="mb-2"
                rows={3}
            />
            <Button type="submit" disabled={!content.trim()}>
                Publier
            </Button>
        </form>
    );
}
