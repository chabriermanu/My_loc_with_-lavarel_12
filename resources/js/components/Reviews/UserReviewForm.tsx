// resources/js/components/Reviews/UserReviewForm.tsx
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import StarRating from './StarRating';

declare function route(name: string, params?: any): string;

interface UserReviewFormProps {
    reviewedUserId: number;
    loanId: number;
    onCancel?: () => void;
}

export default function UserReviewForm({
    reviewedUserId,
    loanId,
    onCancel,
}: UserReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (rating === 0) {
            alert('Veuillez sélectionner une note');
            return;
        }

        setIsSubmitting(true);

        router.post(
            route('users.reviews.store', reviewedUserId),
            {
                loan_id: loanId,
                rating: rating,
                comment: comment.trim() || null,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRating(0);
                    setComment('');
                    onCancel?.();
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sélection de la note */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Note <span className="text-red-500">*</span>
                </label>
                <StarRating
                    rating={rating}
                    interactive
                    onRatingChange={setRating}
                    size="lg"
                    showLabel
                />
            </div>

            {/* Commentaire optionnel */}
            <div>
                <label
                    htmlFor="comment"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Votre avis sur l'utilisateur (optionnel)
                </label>
                <Textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Comment s'est passé l'échange avec cette personne ?"
                    rows={4}
                    className="resize-none"
                />
            </div>

            {/* Boutons */}
            <div className="flex gap-2">
                <Button type="submit" disabled={rating === 0 || isSubmitting}>
                    {isSubmitting ? 'Envoi...' : 'Publier mon avis'}
                </Button>
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Annuler
                    </Button>
                )}
            </div>
        </form>
    );
}
