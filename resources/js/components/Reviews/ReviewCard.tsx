// resources/js/components/Reviews/ReviewCard.tsx
import { ItemReview, UserReview } from '@/types/model';
import StarRating from './StarRating';

interface ReviewCardProps {
    review: ItemReview | UserReview;
    type: 'item' | 'user';
}

export default function ReviewCard({ review, type }: ReviewCardProps) {
    // Récupérer l'utilisateur qui a laissé l'avis
    const reviewer =
        'user' in review
            ? review.user
            : 'reviewer' in review
              ? review.reviewer
              : null;

    if (!reviewer) return null;

    return (
        <div className="rounded-lg border bg-white p-4 shadow-sm">
            {/* Header - Auteur et date */}
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <span className="text-sm font-semibold">
                            {reviewer.pseudo?.[0]?.toUpperCase() ||
                                reviewer.name?.[0]?.toUpperCase() ||
                                'U'}
                        </span>
                    </div>

                    {/* Nom et date */}
                    <div>
                        <p className="font-semibold text-gray-900">
                            {reviewer.pseudo || reviewer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString(
                                'fr-FR',
                                {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                },
                            )}
                        </p>
                    </div>
                </div>

                {/* Note étoilée */}
                <StarRating rating={review.rating} size="sm" showLabel />
            </div>

            {/* Commentaire */}
            {review.comment && (
                <p className="text-gray-700">{review.comment}</p>
            )}
        </div>
    );
}
