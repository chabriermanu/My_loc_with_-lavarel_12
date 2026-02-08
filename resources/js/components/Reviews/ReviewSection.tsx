// resources/js/components/Reviews/ReviewSection.tsx
import { ItemReview, UserReview } from '@/types/model';
import { MessageSquare } from 'lucide-react';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';

interface ReviewSectionProps {
    reviews: (ItemReview | UserReview)[];
    type: 'item' | 'user';
    averageRating?: number;
    totalReviews?: number;
}

export default function ReviewSection({
    reviews,
    type,
    averageRating,
    totalReviews,
}: ReviewSectionProps) {
    const displayReviews = reviews || [];
    const avgRating = averageRating || 0;
    const total = totalReviews || displayReviews.length;

    return (
        <div className="mt-8">
            {/* Header avec moyenne */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold">
                        <MessageSquare className="h-6 w-6" />
                        Avis ({total})
                    </h2>

                    {avgRating > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                            <StarRating rating={avgRating} showLabel />
                            <span className="text-sm text-gray-500">
                                sur {total} avis
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Liste des avis */}
            <div className="space-y-4">
                {displayReviews.length > 0 ? (
                    displayReviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            type={type}
                        />
                    ))
                ) : (
                    <p className="py-8 text-center text-gray-500">
                        Aucun avis pour le moment. Soyez le premier à laisser un
                        avis !
                    </p>
                )}
            </div>
        </div>
    );
}
