// resources/js/components/Comments/ReplyForm.tsx
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { useState } from 'react';

declare function route(name: string, params?: any): string;

interface ReplyFormProps {
    itemId: number; // ID de l'item
    parentId: number; // ID du commentaire parent
    onCancel: () => void; // Fonction pour fermer le formulaire
}

export default function ReplyForm({
    itemId,
    parentId,
    onCancel,
}: ReplyFormProps) {
    // State LOCAL - Le contenu de la réponse
    const [content, setContent] = useState('');

    // Fonction de soumission
    const handleSubmit = () => {
        if (!content.trim()) return;

        router.post(
            route('comments.store'),
            {
                item_id: itemId,
                content: content,
                parent_id: parentId, // ⭐ Différence avec CommentForm : on a un parent
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setContent(''); // Vider le champ
                    onCancel(); // ⭐ Fermer le formulaire (appelle setReplyTo(null) dans le parent)
                },
            },
        );
    };

    return (
        <div className="mt-3">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Votre réponse..."
                className="mb-2"
                rows={2}
            />
            <div className="flex gap-2">
                <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                >
                    Répondre
                </Button>
                <Button size="sm" variant="outline" onClick={onCancel}>
                    Annuler
                </Button>
            </div>
        </div>
    );
}
