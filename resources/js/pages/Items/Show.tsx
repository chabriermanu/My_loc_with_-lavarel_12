import CommentSection from '@/components/Comments/CommentSection';
import type { Media } from '@/components/Items/ItemMediaCarousel';
import ItemMediaCarousel from '@/components/Items/ItemMediaCarousel';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, ShowProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit, Heart, Mail, Star, StarOff, Trash, User } from 'lucide-react';
import { useState } from 'react';
import StarRating from '@/components/Reviews/StarRating';

import ItemReviewForm from '@/components/Reviews/ItemReviewForm';
import ReviewSection from '@/components/Reviews/ReviewSection';

declare function route(name: string, params?: any): string;

export default function Show({
    auth,
    item,
    isFavorited,
    hasCompletedLoan,
    completedLoanId,
    userReview,
}: ShowProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Construction du tableau medias pour le carrousel
    const medias: Media[] = [];
    if (item.picture) {
        medias.push({
            type: 'image',
            src: `/storage/${item.picture}`,
        });
    }
    if (item.video) {
        medias.push({
            type: 'video',
            src: `/storage/${item.video}`,
        });
    }

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

        router.post(route('favorites.toggle', item.id));
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
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* COLONNE GAUCHE - MEDIA */}
                                <div>
                                    {medias.length > 0 ? (
                                        <ItemMediaCarousel medias={medias} />
                                    ) : (
                                        <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100">
                                            <span className="text-6xl">
                                                {item.category?.icon || '📦'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* COLONNE DROITE - INFOS */}
                                <div className="flex flex-col">
                                    {/* TITRE */}
                                    <h1 className="mb-3 text-3xl font-bold text-gray-900">
                                        {item.name}
                                    </h1>

                                    {/* CATÉGORIE ET TYPE */}
                                    <div className="mb-4 flex flex-wrap gap-2">
                                        {item.category && (
                                            <Link
                                                href={route(
                                                    'categories.show',
                                                    item.category.id,
                                                )}
                                                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 transition hover:bg-blue-200"
                                            >
                                                {item.category.icon && (
                                                    <span className="mr-1">
                                                        {item.category.icon}
                                                    </span>
                                                )}
                                                {item.category.name}
                                            </Link>
                                        )}

                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                                                item.type === 'service'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {item.type === 'service'
                                                ? '📋 Service'
                                                : '📦 Objet'}
                                        </span>
                                    </div>

                                    {/* DESCRIPTION */}
                                    <p className="mb-4 text-gray-700">
                                        {item.description}
                                    </p>

                                    {/* PRIX ET CONDITION */}
                                    <div className="mb-4 flex flex-wrap gap-4">
                                        {item.value && (
                                            <div>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {item.value} €
                                                    <span className="text-sm font-normal text-gray-500">
                                                        {item.type === 'service'
                                                            ? ' / prestation'
                                                            : ' / jour'}
                                                    </span>
                                                </p>
                                            </div>
                                        )}

                                        {item.type === 'object' &&
                                            item.condition && (
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        État
                                                    </p>
                                                    <span className="text-sm font-medium text-gray-800">
                                                        {item.condition ===
                                                            'new' && '🆕 Neuf'}
                                                        {item.condition ===
                                                            'like_new' &&
                                                            '✨ Comme neuf'}
                                                        {item.condition ===
                                                            'good' &&
                                                            '👍 Bon état'}
                                                        {item.condition ===
                                                            'fair' &&
                                                            '👌 État correct'}
                                                        {item.condition ===
                                                            'poor' &&
                                                            '🔧 À réparer'}
                                                    </span>
                                                </div>
                                            )}
                                    </div>

                                    {/* PROPRIÉTAIRE */}
                                    {item.owner && (
                                        <div className="mb-4 rounded-lg border bg-gray-50 p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Proposé par
                                                        </p>
                                                        <p className="font-semibold text-gray-900">
                                                            {item.owner.pseudo}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Bouton contacter */}
                                                {auth.user &&
                                                    auth.user.id !==
                                                        item.user_id && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => {
                                                                router.visit(
                                                                    route(
                                                                        'loans.create',
                                                                        {
                                                                            item: item.id,
                                                                        },
                                                                    ),
                                                                );
                                                            }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                            Demander
                                                        </Button>
                                                    )}
                                            </div>
                                        </div>
                                    )}

                                    {/* ACTIONS */}
                                    <div className="mt-auto flex items-center justify-between border-t pt-4">
                                        <div className="flex items-center space-x-4">
                                            {/* LIKE */}
                                            {auth.user?.id !== item.user_id ? (
                                                <div className="flex items-center space-x-1">
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
                                                            className="h-5 w-5"
                                                            fill={
                                                                localIsLiked
                                                                    ? 'currentColor'
                                                                    : 'none'
                                                            }
                                                        />
                                                    </Button>
                                                    <span className="text-sm text-gray-600">
                                                        {localLikesCount}
                                                    </span>
                                                </div>
                                            ) : (
                                                localLikesCount > 0 && (
                                                    <div className="flex items-center space-x-1">
                                                        <Heart className="h-5 w-5 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {localLikesCount}
                                                        </span>
                                                    </div>
                                                )
                                            )}

                                            {/* FAVORITE */}
                                            {auth.user?.id !== item.user_id ? (
                                                <div className="flex items-center space-x-1">
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
                                                                className="h-5 w-5"
                                                                fill="currentColor"
                                                            />
                                                        ) : (
                                                            <StarOff className="h-5 w-5" />
                                                        )}
                                                    </Button>
                                                    <span className="text-sm text-gray-600">
                                                        {localFavoritesCount}
                                                    </span>
                                                </div>
                                            ) : (
                                                localFavoritesCount > 0 && (
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="h-5 w-5 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {
                                                                localFavoritesCount
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* EDIT/DELETE */}
                                        {canEditItem() && (
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        router.visit(
                                                            route(
                                                                'items.edit',
                                                                item.id,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDelete(item.id)
                                                    }
                                                    disabled={
                                                        deletingId === item.id
                                                    }
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION REVIEW - Formulaire pour laisser un avis */}
                    {hasCompletedLoan && !userReview && (
                        <div className="mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h2 className="mb-4 text-xl font-semibold">
                                    Laisser un avis sur cet item
                                </h2>
                                <ItemReviewForm
                                    itemId={item.id}
                                    loanId={completedLoanId || 0} // ⚠️ TODO: Il faudra récupérer le vrai loan_id depuis le backend
                                />
                            </div>
                        </div>
                    )}

                    {/* SECTION AVIS - Affichage des avis existants */}
                    {item.reviews && item.reviews.length > 0 && (
                        <div className="mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <ReviewSection
                                    reviews={item.reviews}
                                    type="item"
                                    averageRating={item.rating || 0}
                                    totalReviews={item.total_ratings || 0}
                                />
                            </div>
                        </div>
                    )}

                    {/* SECTION COMMENTS */}
                    <div
                        id="comments"
                        className="mt-6 overflow-hidden bg-white shadow-sm sm:rounded-lg"
                    >
                        <div className="p-6">
                            <CommentSection
                                itemId={item.id}
                                itemOwnerId={item.user_id}
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
