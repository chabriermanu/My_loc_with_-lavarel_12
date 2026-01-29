// Pages/Items/Show.tsx

import ReviewSection from '@/components/ReviewSection';
import AppLayout from '@/layouts/app-layout';
import { ShowProps } from '@/types';
import { Head } from '@inertiajs/react';
import CommentSection from '../../components/Commentsection';

declare function route(name: string, params?: any): string;

export default function Show({
    auth,
    item,
    isFavorited,
    hasCompletedLoan,
    userReview,
}: ShowProps) {
    // ... (garde tous tes handleLike, handleFavorite, handleDelete)

    return (
        <AppLayout>
            <Head title={item.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* ... (garde tout ton code existant) */}

                    {/* Section Avis (si l'utilisateur a emprunté) */}
                    <div className="mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <ReviewSection
                                itemId={item.id}
                                hasCompletedLoan={hasCompletedLoan}
                                userReview={userReview}
                            />
                        </div>
                    </div>

                    {/* Section Commentaires */}
                    <div className="mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <CommentSection
                                itemId={item.id}
                                comments={item.comments || []}
                                currentUser={auth.user}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
