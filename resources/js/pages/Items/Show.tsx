import CommentSection from '@/components/Commentsection';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ShowProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Heart, Star, StarOff } from 'lucide-react';
import { useState } from 'react';

declare function route(name: string, params?: any): string;

export default function Show({
    auth,
    item,
    isFavorited,
    hasCompletedLoan,
    userReview,
}: ShowProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // ✅ States locaux avec valeurs par défaut
    const [localIsLiked, setLocalIsLiked] = useState(item.is_liked ?? false);
    const [localLikesCount, setLocalLikesCount] = useState(
        item.likes_count ?? 0,
    );
    const [localIsFavorited, setLocalIsFavorited] = useState(
        isFavorited ?? false,
    );
    const [localFavoritesCount, setLocalFavoritesCount] = useState(
        item.favorites_count ?? 0,
    );

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Articles',
            href: route('items.index'),
        },
        {
            title: item.name,
            href: route('items.show', item.id),
        },
    ];

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
        setLocalIsFavorited(!localIsFavorited);
        setLocalFavoritesCount(
            localIsFavorited
                ? localFavoritesCount - 1
                : localFavoritesCount + 1,
        );

        router.post(route('items.favorite', item.id));
    };

    const handleLike = () => {
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={item.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* IMAGE */}
                            {item.picture && (
                                <div className="mb-6">
                                    <img
                                        src={`/storage/${item.picture}`}
                                        alt={item.name}
                                        className="h-auto w-full rounded-lg object-cover"
                                    />
                                </div>
                            )}

                            {/* VIDEO */}
                            {item.video && (
                                <div className="mb-6">
                                    <video
                                        src={`/storage/${item.video}`}
                                        controls
                                        className="h-auto w-full rounded-lg"
                                    />
                                </div>
                            )}

                            {/* TITRE ET DESCRIPTION */}
                            <h1 className="mb-4 text-3xl font-bold text-gray-900">
                                {item.name}
                            </h1>

                            <p className="mb-6 text-gray-700">
                                {item.description}
                            </p>

                            {/* CATÉGORIE */}
                            {item.category && (
                                <div className="mb-4">
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                        {item.category.name}
                                    </span>
                                </div>
                            )}

                            {/* PROPRIÉTAIRE */}
                            {item.owner && (
                                <div className="mb-4 text-sm text-gray-600">
                                    Par{' '}
                                    <span className="font-semibold">
                                        {item.owner.pseudo}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between border-t pt-4">
                                <div className="flex items-center space-x-6">
                                    {/* ✅ LIKE - Ne s'affiche QUE si ce n'est PAS son item */}
                                    {auth.user?.id !== item.user_id && (
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
                                    )}

                                    {/* ✅ Si c'est son item, afficher juste le compteur de likes */}
                                    {auth.user?.id === item.user_id &&
                                        localLikesCount > 0 && (
                                            <div className="flex items-center space-x-2">
                                                <Heart className="h-6 w-6 text-gray-400" />
                                                <span className="text-gray-600">
                                                    {localLikesCount}
                                                </span>
                                            </div>
                                        )}

                                    {/* ✅ FAVORITE - Ne s'affiche QUE si ce n'est PAS son item */}
                                    {auth.user?.id !== item.user_id && (
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
                                    )}

                                    {/* ✅ Si c'est son item, afficher juste le compteur de favoris */}
                                    {auth.user?.id === item.user_id &&
                                        localFavoritesCount > 0 && (
                                            <div className="flex items-center space-x-2">
                                                <Star className="h-6 w-6 text-gray-400" />
                                                <span className="text-gray-600">
                                                    {localFavoritesCount}
                                                </span>
                                            </div>
                                        )}
                                </div>

                                {/* ACTIONS EDIT/DELETE */}
                                {canEditItem() && (
                                    <div className="flex items-center space-x-3">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.visit(
                                                    route(
                                                        'items.edit',
                                                        item.id,
                                                    ),
                                                )
                                            }
                                        >
                                            Modifier
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            disabled={deletingId === item.id}
                                        >
                                            Supprimer
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION REVIEW */}
                    {hasCompletedLoan && !userReview && (
                        <div className="mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h2 className="mb-4 text-xl font-semibold">
                                    Laisser un avis
                                </h2>
                                {/* Formulaire d'avis ici */}
                            </div>
                        </div>
                    )}

                    {/* ✅ SECTION COMMENTS - Utilisez votre composant */}
                    <div
                        id="comments"
                        className="mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg"
                    >
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
