import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ItemComment, CommentSectionProps, User } from '@/types';
import { router } from '@inertiajs/react';
import { Heart, MessageCircle, Reply } from 'lucide-react';
import { useState } from 'react';

declare function route(name: string, params?: any): string;

export default function CommentSection({
    itemId,
    itemOwnerId,
    comments,
    currentUser,
}: CommentSectionProps) {
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');

    // ✅ States pour gérer les likes de chaque commentaire
   const [commentLikes, setCommentLikes] = useState<
    Record<number, { isLiked: boolean; count: number }>
>(() => {
    const initialLikes: Record<number, { isLiked: boolean; count: number }> =
        {};
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

    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        router.post(
            route('comments.store'),
            {
                item_id: itemId,
                content: newComment,
                parent_id: null,
            },
            {
                preserveScroll: true,
                onSuccess: () => setNewComment(''),
            },
        );
    };

    const handleSubmitReply = (parentId: number) => {
        if (!replyContent.trim()) return;

        router.post(
            route('comments.store'),
            {
                item_id: itemId,
                content: replyContent,
                parent_id: parentId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setReplyContent('');
                    setReplyTo(null);
                },
            },
        );
    };

    const handleDeleteComment = (commentId: number) => {
        if (confirm('Supprimer ce commentaire ?')) {
            router.delete(route('comments.destroy', commentId), {
                preserveScroll: true,
            });
        }
    };

    // ✅ Fonction pour liker un commentaire
    const handleLikeComment = (commentId: number) => {
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

    const renderComment = (comment: ItemComment) => {
        const likeState = commentLikes[comment.id] || {
            isLiked: comment.is_liked ?? false,
            count: comment.likes_count ?? 0,
        };

        return (
            <div key={comment.id} className="mb-4">
                <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-start justify-between">
                        <div>
                            <span className="font-semibold">
                                {(comment.user as User).pseudo ||
                                    (comment.user as User).name ||
                                    'Utilisateur'}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                                {new Date(
                                    comment.created_at,
                                ).toLocaleDateString('fr-FR')}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {/* ✅ LIKE - Ne s'affiche QUE si ce n'est PAS son commentaire */}
                            {currentUser?.id !== comment.user_id && (
                                <div className="flex items-center space-x-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleLikeComment(comment.id)
                                        }
                                        className={`transition-colors ${
                                            likeState.isLiked
                                                ? 'text-red-600 hover:text-red-700'
                                                : 'text-gray-600 hover:text-gray-700'
                                        }`}
                                    >
                                        <Heart
                                            className="h-4 w-4"
                                            fill={
                                                likeState.isLiked
                                                    ? 'currentColor'
                                                    : 'none'
                                            }
                                        />
                                    </Button>
                                    <span className="text-sm text-gray-600">
                                        {likeState.count}
                                    </span>
                                </div>
                            )}

                            {/* ✅ Si c'est son commentaire, afficher juste le compteur */}
                            {currentUser?.id === comment.user_id &&
                                likeState.count > 0 && (
                                    <div className="flex items-center space-x-1">
                                        <Heart className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {likeState.count}
                                        </span>
                                    </div>
                                )}

                            {/* ✅ REPLY - Toujours disponible */}
                            {currentUser && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setReplyTo(comment.id)}
                                >
                                    <Reply className="h-4 w-4" />
                                </Button>
                            )}

                            {/* DELETE - Seulement pour l'auteur */}
                            {currentUser?.id === comment.user_id && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        handleDeleteComment(comment.id)
                                    }
                                    className="text-red-600"
                                >
                                    Supprimer
                                </Button>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>

                    {/* Formulaire de réponse */}
                    {replyTo === comment.id && (
                        <div className="mt-3">
                            <Textarea
                                value={replyContent}
                                onChange={(e) =>
                                    setReplyContent(e.target.value)
                                }
                                placeholder="Votre réponse..."
                                className="mb-2"
                            />
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        handleSubmitReply(comment.id)
                                    }
                                >
                                    Répondre
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        setReplyTo(null);
                                        setReplyContent('');
                                    }}
                                >
                                    Annuler
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Réponses */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-8 mt-2 space-y-2">
                        {comment.replies.map((reply) => {
                            const replyLikeState = commentLikes[reply.id] || {
                                isLiked: reply.is_liked ?? false,
                                count: reply.likes_count ?? 0,
                            };

                            return (
                                <div
                                    key={reply.id}
                                    className="rounded-lg bg-gray-100 p-3"
                                >
                                    <div className="mb-1 flex items-start justify-between">
                                        <div>
                                            <span className="text-sm font-semibold">
                                                {reply.user.pseudo ||
                                                    reply.user.name}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500">
                                                {new Date(
                                                    reply.created_at,
                                                ).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            {/* ✅ LIKE - Ne s'affiche QUE si ce n'est PAS sa réponse */}
                                            {currentUser?.id !==
                                                reply.user_id && (
                                                <div className="flex items-center space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleLikeComment(
                                                                reply.id,
                                                            )
                                                        }
                                                        className={`transition-colors ${
                                                            replyLikeState.isLiked
                                                                ? 'text-red-600 hover:text-red-700'
                                                                : 'text-gray-600 hover:text-gray-700'
                                                        }`}
                                                    >
                                                        <Heart
                                                            className="h-3 w-3"
                                                            fill={
                                                                replyLikeState.isLiked
                                                                    ? 'currentColor'
                                                                    : 'none'
                                                            }
                                                        />
                                                    </Button>
                                                    <span className="text-xs text-gray-600">
                                                        {replyLikeState.count}
                                                    </span>
                                                </div>
                                            )}

                                            {/* ✅ Si c'est sa réponse, afficher juste le compteur */}
                                            {currentUser?.id ===
                                                reply.user_id &&
                                                replyLikeState.count > 0 && (
                                                    <div className="flex items-center space-x-1">
                                                        <Heart className="h-3 w-3 text-gray-400" />
                                                        <span className="text-xs text-gray-600">
                                                            {
                                                                replyLikeState.count
                                                            }
                                                        </span>
                                                    </div>
                                                )}

                                            {currentUser?.id ===
                                                reply.user_id && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteComment(
                                                            reply.id,
                                                        )
                                                    }
                                                    className="text-red-600"
                                                >
                                                    Supprimer
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        {reply.content}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
                <MessageCircle className="h-6 w-6" />
                Commentaires ({comments.length})
            </h2>

            {/* ✅ Formulaire nouveau commentaire - Seulement si ce n'est PAS son item */}
            {currentUser && currentUser.id !== itemOwnerId ? (
                <form onSubmit={handleSubmitComment} className="mb-6">
                    <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Laisser un commentaire..."
                        className="mb-2"
                        rows={3}
                    />
                    <Button type="submit">Publier</Button>
                </form>
            ) : currentUser && currentUser.id === itemOwnerId ? (
                <div className="mb-6 rounded-lg bg-blue-50 p-4">
                    <p className="text-sm text-blue-800">
                        💡 Vous ne pouvez pas commenter votre propre item, mais vous pouvez répondre aux commentaires des autres.
                    </p>
                </div>
            ) : (
                <p className="mb-6 text-gray-500">
                    Connectez-vous pour laisser un commentaire
                </p>
            )}

            {/* Liste des commentaires */}
            <div className="space-y-4">
                {comments
                    .filter((c) => !c.parent_id)
                    .map((comment) => renderComment(comment))}
            </div>
        </div>
    );
}