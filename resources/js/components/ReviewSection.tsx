// components/ReviewSection.tsx

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ItemReview } from '@/types';
import { router } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { useState } from 'react';

declare function route(name: string, params?: any): string;

interface ReviewSectionProps {
    itemId: number;
    hasCompletedLoan: boolean;
    userReview: ItemReview | null;
}

export default function ReviewSection({
    itemId,
    hasCompletedLoan,
    userReview,
}: ReviewSectionProps) {
    const [rating, setRating] = useState(userReview?.rating || 0);
    const [comment, setComment] = useState(userReview?.comment || '');
    const [hoveredStar, setHoveredStar] = useState(0);

    if (!hasCompletedLoan) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (userReview) {
            // Modifier l'avis existant
            router.patch(
                route('item-reviews.update', userReview.id),
                { rating, comment },
                { preserveScroll: true },
            );
        } else {
            // Créer un nouvel avis
            router.post(
                route('item-reviews.store'),
                { item_id: itemId, rating, comment },
                { preserveScroll: true },
            );
        }
    };

    return (
        <div className="mt-8 rounded-lg border bg-blue-50 p-6">
            <h3 className="mb-4 text-xl font-bold">
                {userReview ? 'Modifier votre avis' : 'Laisser un avis'}
            </h3>
            <p className="mb-4 text-sm text-gray-600">
                Vous avez emprunté cet item. Partagez votre expérience !
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Étoiles */}
                <div>
                    <label className="mb-2 block font-semibold">Note</label>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`h-8 w-8 ${
                                        star <= (hoveredStar || rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Commentaire */}
                <div>
                    <label className="mb-2 block font-semibold">
                        Commentaire (optionnel)
                    </label>
                    <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Partagez votre expérience..."
                        rows={4}
                    />
                </div>

                <Button type="submit" disabled={rating === 0}>
                    {userReview ? "Modifier l'avis" : "Publier l'avis"}
                </Button>
            </form>
        </div>
    );
}
