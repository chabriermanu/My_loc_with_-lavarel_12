// Imports existants
import type { CommentSectionProps } from '@/types';
import { router } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import { useState } from 'react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem'; // ⭐ AJOUTÉ

declare function route(name: string, params?: any): string;

export default function CommentSection({
    itemId,
    itemOwnerId,
    comments,
    currentUser,
}: CommentSectionProps) {
    // State pour gérer les likes de chaque commentaire
    const [commentLikes, setCommentLikes] = useState<
        Record<number, { isLiked: boolean; count: number }>
    >(() => {
        const initialLikes: Record<
            number,
            { isLiked: boolean; count: number }
        > = {};
        const allComments = [...comments];

        comments.forEach((comment) => {
            if (comment.replies) {
                allComments.push(...comment.replies);
            }
        });

        allComments.forEach((comment) => {
            initialLikes[comment.id] = {
                isLiked: comment.is_liked ?? false,
                count: comment.likes_count ?? 0,
            };
        });

        return initialLikes;
    });

    // Fonction pour liker un commentaire
    const handleLikeToggle = (commentId: number) => {
        // ⭐ RENOMMÉ
        const currentState = commentLikes[commentId] || {
            isLiked: false,
            count: 0,
        };

        // Mise à jour optimiste
        setCommentLikes((prev) => ({
            ...prev,
            [commentId]: {
                isLiked: !currentState.isLiked,
                count: currentState.isLiked
                    ? currentState.count - 1
                    : currentState.count + 1,
            },
        }));

        router.post(
            '/like/toggle',
            {
                model_type: 'App\\Models\\Comment',
                model_id: commentId,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
                <MessageCircle className="h-6 w-6" />
                Commentaires ({comments.length})
            </h2>

            <CommentForm
                itemId={itemId}
                itemOwnerId={itemOwnerId}
                currentUserId={currentUser?.id}
            />

            {/* Liste des commentaires */}
            <div className="space-y-4">
                {comments
                    .filter((c) => !c.parent_id)
                    .map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            itemId={itemId}
                            currentUserId={currentUser?.id}
                            commentLikes={commentLikes}
                            onLikeToggle={handleLikeToggle}
                        />
                    ))}

                {comments.filter((c) => !c.parent_id).length === 0 && (
                    <p className="py-8 text-center text-gray-500">
                        Aucun commentaire pour le moment. Soyez le premier à
                        commenter !
                    </p>
                )}
            </div>
        </div>
    );
}
