import type { Media } from '@/components/Items/ItemMediaCarousel';
import ItemMediaCarousel from '@/components/Items/ItemMediaCarousel';
import type { ItemCardProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Edit, Eye, Heart, MessageCircle, Star, Trash } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge'; // ✅ AJOUTÉ
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';

declare function route(name: string, params?: any): string;

export default function ItemCard({ item, showActions = false }: ItemCardProps) {
    const { auth } = usePage().props as any;
    const medias: Media[] = [];

    if (item.picture) {
        medias.push({
            type: 'image',
            src: `/items/${item.id}/picture`,
        });
    }

    if (item.video) {
        medias.push({
            type: 'video',
            src: `/items/${item.id}/video`,
        });
    }

    const [deletingId, setDeletingId] = useState<number | null>(null);

    // ✅ States locaux avec valeurs par défaut
    const [localIsLiked, setLocalIsLiked] = useState(item.is_liked ?? false);
    const [localLikesCount, setLocalLikesCount] = useState(
        item.likes_count ?? 0,
    );
    const [localIsFavorited, setLocalIsFavorited] = useState(
        item.is_favorited ?? false,
    );
    const [localFavoritesCount, setLocalFavoritesCount] = useState(
        item.favorites_count ?? 0,
    );

    const handleDelete = (itemId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?'))
            return;

        setDeletingId(itemId);

        router.delete(`/items/${itemId}`, {
            onFinish: () => setDeletingId(null),
            onError: () =>
                alert('Une erreur est survenue lors de la suppression.'),
        });
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();

        setLocalIsFavorited(!localIsFavorited);
        setLocalFavoritesCount(
            localIsFavorited
                ? localFavoritesCount - 1
                : localFavoritesCount + 1,
        );

        router.post(`/items/${item.id}/favorite`);
    };

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();

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
        <Card className="relative overflow-hidden">
            {/* ✅ BADGE DÉJÀ LOUÉ - Position absolue en haut à droite */}
            {!item.is_available && (
                <div className="absolute top-2 right-2 z-10">
                    <Badge variant="destructive" className="font-bold">
                        🚫 Déjà loué
                    </Badge>
                </div>
            )}

            {/* MediaCarousel */}
            {medias.length > 0 && <ItemMediaCarousel medias={medias} />}

            <CardHeader>
                <h3 className="text-xl font-semibold text-gray-800">
                    {item.name}
                </h3>
            </CardHeader>

            <CardContent>
                <p className="line-clamp-3 text-gray-600 md:line-clamp-4">
                    {item.description}
                </p>

                {/* Affichage de la catégorie */}
                {item.category && (
                    <div className="mt-3">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                            {item.category.name}
                        </span>
                    </div>
                )}

                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                    {showActions && item.owner && (
                        <span>Par {item.owner.pseudo}</span>
                    )}
                    <span>
                        {new Date(item.created_at).toLocaleDateString('fr-FR')}
                    </span>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
                {/* LEFT SIDE : LIKE + FAVORITE + COMMENTS */}
                <div className="flex items-center space-x-3">
                    {/* ✅ LIKE - Seulement si ce n'est PAS son item */}
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
                                    className="h-6 w-6"
                                    fill={
                                        localIsLiked ? 'currentColor' : 'none'
                                    }
                                />
                            </Button>
                            <span className="text-gray-600">
                                {localLikesCount}
                            </span>
                        </div>
                    ) : (
                        localLikesCount > 0 && (
                            <div className="flex items-center space-x-1">
                                <Heart className="h-6 w-6 text-gray-400" />
                                <span className="text-gray-600">
                                    {localLikesCount}
                                </span>
                            </div>
                        )
                    )}

                    {/* ✅ FAVORITE - Seulement si ce n'est PAS son item */}
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
                                <Star
                                    className="h-6 w-6"
                                    fill={
                                        localIsFavorited
                                            ? 'currentColor'
                                            : 'none'
                                    }
                                />
                            </Button>
                            <span className="text-gray-600">
                                {localFavoritesCount}
                            </span>
                        </div>
                    ) : (
                        localFavoritesCount > 0 && (
                            <div className="flex items-center space-x-1">
                                <Star className="h-6 w-6 text-gray-400" />
                                <span className="text-gray-600">
                                    {localFavoritesCount}
                                </span>
                            </div>
                        )
                    )}

                    {/* COMMENTS - Toujours visible */}
                    <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" asChild>
                            <Link
                                href={
                                    route('items.show', item.id) + '#comments'
                                }
                            >
                                <MessageCircle className="h-6 w-6" />
                            </Link>
                        </Button>
                        <span className="text-gray-600">
                            {item.comments_count ?? 0}
                        </span>
                    </div>
                </div>

                {/* RIGHT SIDE : ACTIONS */}
                <div className="flex items-center space-x-3">
                    <Button variant="link" asChild>
                        <Link href={route('items.show', item.id)}>
                            <Eye />
                        </Link>
                    </Button>

                    {canEditItem() && (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href={route('items.edit', item.id)}>
                                    <Edit />
                                </Link>
                            </Button>

                            <Button
                                onClick={() => handleDelete(item.id)}
                                disabled={deletingId === item.id}
                                variant="ghost"
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash />
                            </Button>
                        </>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
