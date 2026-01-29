// components/CommentSection.tsx

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import type { User } from '@/types/auth';
import type { Comment } from '@/types/model';
import { router } from '@inertiajs/react';
import { MessageCircle, Reply } from 'lucide-react';
import { useState } from 'react';
declare function route(name: string, params?: any): string;

interface CommentSectionProps {
    itemId: number;
    comments: Comment[];
    currentUser: User | null;
}

export default function CommentSection({
    itemId,
    comments,
    currentUser,
}: CommentSectionProps) {
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [replyContent, setReplyContent] = useState('');

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

    const renderComment = (comment: Comment) => (
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
                            {new Date(comment.created_at).toLocaleDateString(
                                'fr-FR',
                            )}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        {currentUser && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setReplyTo(comment.id)}
                            >
                                <Reply className="h-4 w-4" />
                            </Button>
                        )}
                        {currentUser?.id === comment.user_id && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
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
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Votre réponse..."
                            className="mb-2"
                        />
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                onClick={() => handleSubmitReply(comment.id)}
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
                <div className="mt-2 ml-8 space-y-2">
                    {comment.replies.map((reply) => (
                        <div
                            key={reply.id}
                            className="rounded-lg bg-gray-100 p-3"
                        >
                            <div className="mb-1 flex items-start justify-between">
                                <div>
                                    <span className="text-sm font-semibold">
                                        {reply.user.pseudo || reply.user.name}
                                    </span>
                                    <span className="ml-2 text-xs text-gray-500">
                                        {new Date(
                                            reply.created_at,
                                        ).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                                {currentUser?.id === reply.user_id && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteComment(reply.id)
                                        }
                                        className="text-red-600"
                                    >
                                        Supprimer
                                    </Button>
                                )}
                            </div>
                            <p className="text-sm text-gray-700">
                                {reply.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="mt-8">
            <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
                <MessageCircle className="h-6 w-6" />
                Commentaires ({comments.length})
            </h2>

            {/* Formulaire nouveau commentaire */}
            {currentUser ? (
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
