// resources/js/components/Comments/CommentItem.tsx
import { Button } from '@/components/ui/button';
import type { ItemComment, User } from '@/types';
import { router } from '@inertiajs/react';
import { Heart, Reply, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ReplyForm from './ReplyForm';

declare function route(name: string, params?: any): string;

interface CommentItemProps {
    comment: ItemComment;
    itemId: number;
    currentUserId?: number;
    isReply?: boolean; // Pour différencier style commentaire/réponse
    commentLikes: Record<number, { isLiked: boolean; count: number }>;
    onLikeToggle: (commentId: number) => void;
}

export default function CommentItem({
    comment,
    itemId,
    currentUserId,
    isReply = false,
    commentLikes,
    onLikeToggle,
}: CommentItemProps) {
    // State LOCAL - Affichage du formulaire de réponse
    const [showReplyForm, setShowReplyForm] = useState(false);

    // Récupérer l'état du like pour ce commentaire
    const likeState = commentLikes[comment.id] || {
        isLiked: comment.is_liked ?? false,
        count: comment.likes_count ?? 0,
    };

    // Vérifications
    const isOwnComment = currentUserId === comment.user_id;
    const canLike = currentUserId && !isOwnComment;

    // Fonction de suppression
    const handleDelete = () => {
        if (confirm('Supprimer ce commentaire ?')) {
            router.delete(route('comments.destroy', comment.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className={isReply ? '' : 'mb-4'}>
            <div
                className={`rounded-lg p-4 ${
                    isReply ? 'bg-gray-100' : 'bg-gray-50'
                }`}
            >
                {/* Header - Auteur et date */}
                <div className="mb-2 flex items-start justify-between">
                    <div>
                        <span
                            className={
                                isReply
                                    ? 'text-sm font-semibold'
                                    : 'font-semibold'
                            }
                        >
                            {(comment.user as User).pseudo ||
                                (comment.user as User).name ||
                                'Utilisateur'}
                        </span>
                        <span
                            className={`ml-2 text-gray-500 ${
                                isReply ? 'text-xs' : 'text-sm'
                            }`}
                        >
                            {new Date(comment.created_at).toLocaleDateString(
                                'fr-FR',
                            )}
                        </span>
                    </div>

                    {/* Actions - Like, Reply, Delete */}
                    <div className="flex gap-2">
                        {/* Like button - Seulement si ce n'est pas son commentaire */}
                        {canLike && (
                            <div className="flex items-center space-x-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onLikeToggle(comment.id)}
                                    className={`transition-colors ${
                                        likeState.isLiked
                                            ? 'text-red-600 hover:text-red-700'
                                            : 'text-gray-600 hover:text-gray-700'
                                    }`}
                                >
                                    <Heart
                                        className={
                                            isReply ? 'h-3 w-3' : 'h-4 w-4'
                                        }
                                        fill={
                                            likeState.isLiked
                                                ? 'currentColor'
                                                : 'none'
                                        }
                                    />
                                </Button>
                                <span
                                    className={
                                        isReply
                                            ? 'text-xs text-gray-600'
                                            : 'text-sm text-gray-600'
                                    }
                                >
                                    {likeState.count}
                                </span>
                            </div>
                        )}

                        {/* Like count (pour l'auteur du commentaire) */}
                        {isOwnComment && likeState.count > 0 && (
                            <div className="flex items-center space-x-1">
                                <Heart
                                    className={
                                        isReply
                                            ? 'h-3 w-3 text-gray-400'
                                            : 'h-4 w-4 text-gray-400'
                                    }
                                />
                                <span
                                    className={
                                        isReply
                                            ? 'text-xs text-gray-600'
                                            : 'text-sm text-gray-600'
                                    }
                                >
                                    {likeState.count}
                                </span>
                            </div>
                        )}

                        {/* Reply button - Seulement sur les commentaires principaux */}
                        {currentUserId && !isReply && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="text-gray-600 hover:text-gray-700"
                            >
                                <Reply className="h-4 w-4" />
                            </Button>
                        )}

                        {/* Delete button - Seulement pour l'auteur */}
                        {isOwnComment && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Contenu du commentaire */}
                <p
                    className={
                        isReply ? 'text-sm text-gray-700' : 'text-gray-700'
                    }
                >
                    {comment.content}
                </p>

                {/* Formulaire de réponse */}
                {showReplyForm && (
                    <ReplyForm
                        itemId={itemId}
                        parentId={comment.id}
                        onCancel={() => setShowReplyForm(false)}
                    />
                )}
            </div>

            {/* Réponses imbriquées (récursif) */}
            {!isReply && comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 ml-8 space-y-2">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            itemId={itemId}
                            currentUserId={currentUserId}
                            isReply={true}
                            commentLikes={commentLikes}
                            onLikeToggle={onLikeToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
