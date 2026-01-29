// Pages/Items/Show.tsx

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { ShowProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Heart, Star, StarOff } from 'lucide-react';
import { useState } from 'react';

declare function route(name: string, params?: any): string;

export default function Show({
    auth,
    item,
    isFavorited, // ← Déjà déclaré ici
    hasCompletedLoan,
    userReview,
}: ShowProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // ✨ Utilisez des noms différents pour éviter le conflit
    const [localIsLiked, setLocalIsLiked] = useState(item.is_liked);
    const [localLikesCount, setLocalLikesCount] = useState(item.likes_count);
    const [localIsFavorited, setLocalIsFavorited] = useState(isFavorited); // Utilisez le prop ici
    const [localFavoritesCount, setLocalFavoritesCount] = useState(
        item.favorites_count,
    );

    const handleDelete = (itemId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?'))
            return;

        setDeletingId(itemId);

        router.delete(route('items.destroy', itemId), {
            onSuccess: () => router.visit(route('items.index')),
            onFinish: () => setDeletingId(null),
            onError: () =>
                alert('Une erreur est survenue lors de la suppression.'),
        });
    };

    const handleFavorite = () => {
        // ✨ Mise à jour immédiate
        setLocalIsFavorited(!localIsFavorited);
        setLocalFavoritesCount(
            localIsFavorited
                ? localFavoritesCount - 1
                : localFavoritesCount + 1,
        );

        router.post(route('items.favorite', item.id));
    };

    const handleLike = () => {
        // ✨ Mise à jour immédiate
        setLocalIsLiked(!localIsLiked);
        setLocalLikesCount(
            localIsLiked ? localLikesCount - 1 : localLikesCount + 1,
        );

        router.post(
            '/like/toggle',
            {
                model_type: 'App\\Models\\Item',
                model_id: item.id,
            },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    const canEditItem = () => auth.user?.id === item.user_id;

    return (
        <AppLayout>
            <Head title={item.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* ... IMAGE, VIDEO, etc ... */}

                            {/* Actions : Like, Favorite */}
                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="flex items-center space-x-6">
                                    {/* LIKE - Utilisez localIsLiked */}
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleLike}
                                            className={`transition-colors ${
                                                localIsLiked
                                                    ? 'text-red-600 hover:text-red-700'
                                                    : 'text-gray-600 hover:text-gray-700'
                                            }`}
                                        >
                                            <Heart
                                                className="h-6 w-6"
                                                fill={
                                                    localIsLiked
                                                        ? 'currentColor'
                                                        : 'none'
                                                }
                                            />
                                        </Button>
                                        <span className="text-gray-600">
                                            {localLikesCount}
                                        </span>
                                    </div>

                                    {/* FAVORITE - Utilisez localIsFavorited */}
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={handleFavorite}
                                            className={`transition-colors ${
                                                localIsFavorited
                                                    ? 'text-yellow-500 hover:text-yellow-600'
                                                    : 'text-gray-600 hover:text-gray-700'
                                            }`}
                                        >
                                            {localIsFavorited ? (
                                                <Star
                                                    className="h-6 w-6"
                                                    fill="currentColor"
                                                />
                                            ) : (
                                                <StarOff className="h-6 w-6" />
                                            )}
                                        </Button>
                                        <span className="text-gray-600">
                                            {localFavoritesCount}
                                        </span>
                                    </div>
                                </div>

                                {/* ... reste du code ... */}
                            </div>
                        </div>
                    </div>

                    {/* ... sections Review et Comments ... */}
                </div>
            </div>
        </AppLayout>
    );
}
