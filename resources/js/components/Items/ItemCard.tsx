import { router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import route from 'ziggy-js';
import { Item } from '@/types/model';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Edit, Eye, Heart, Trash, MessageCircle, Star, StarOff } from 'lucide-react';
import { Button } from '../ui/button';

interface ItemCardProps {
    item: Item;
    showActions?: boolean;
}

export default function ItemCard({ item, showActions = false }: ItemCardProps) {

    const { auth } = usePage().props as any;
    const [deletingId, setDeletingId] = useState<number | null>(null);

    
    const handleDelete = (itemId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

        setDeletingId(itemId);

        router.delete(`/items/${itemId}`, {
            onFinish: () => setDeletingId(null),
            onError: () => alert("Une erreur est survenue lors de la suppression.")
        });
    };

  
    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        router.post(`/items/${item.id}/favorite`);
    };

  
    const handleLike = (itemId: number) => {
        router.post(
            '/like/toggle',
            {
                model_type: 'App\\Models\\Item',
                model_id: itemId,
            },
            {
                preserveScroll: true,
                preserveState: true,
            }
        );
    };


    const canEditItem = (item: Item) => auth.user?.id === item.user_id;

    return (
        <Card className="overflow-hidden">

            {/* IMAGE */}
            {item.picture && (
                <div className="aspect-w-16 aspect-h-9">
                    <img
                        src={`/storage/${item.picture}`}
                        className="object-cover w-full h-full rounded-md"
                        alt={item.name}
                    />
                </div>
            )}

            {/* VIDEO */}
            {item.video && (
                <div className="aspect-w-16 aspect-h-9">
                    <video
                        src={`/storage/${item.video}`}
                        controls
                        className="object-cover w-full h-full rounded-md"
                    />
                </div>
            )}

            <CardHeader>
                <h3 className="text-xl font-semibold text-gray-800">
                    {item.name}
                </h3>
            </CardHeader>

            <CardContent>
                <p className="text-gray-600 line-clamp-3 md:line-clamp-4">
                    {item.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                    {showActions && (
                        <span>
                            Par {item.owner.first_name} {item.owner.last_name}
                        </span>
                    )}
                    <span>{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">

                {/* LEFT SIDE : LIKE + FAVORITE + COMMENTS */}
                <div className="flex items-center space-x-3">

                    {/* LIKE */}
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleLike(item.id)}
                            className={`transition-colors ${
                                item.is_liked
                                    ? "text-red-600 hover:text-red-700"
                                    : "text-gray-600 hover:text-gray-700"
                            }`}
                        >
                            <Heart
                                className="h-6 w-6"
                                fill={item.is_liked ? "currentColor" : "none"}
                            />
                        </Button>
                        <span className="text-gray-600">{item.likes_count}</span>
                    </div>

                    {/* FAVORITE */}
                    <div className="flex items-center space-x-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleFavorite}
                            className={`transition-colors ${
                                item.is_favorited
                                    ? "text-yellow-500 hover:text-yellow-600"
                                    : "text-gray-600 hover:text-gray-700"
                            }`}
                        >
                            {item.is_favorited ? (
                                <Star className="h-6 w-6" fill="currentColor" />
                            ) : (
                                <StarOff className="h-6 w-6" />
                            )}
                        </Button>
                        <span className="text-gray-600">{item.favorites_count}</span>
                    </div>

                    {/* COMMENTS */}
                    <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={route('items.show', item.id)}>
                                <MessageCircle className="h-6 w-6" />
                            </Link>
                        </Button>
                        <span className="text-gray-600">{item.comments_count}</span>
                    </div>

                </div>

                {/* RIGHT SIDE : ACTIONS */}
                <div className="flex items-center space-x-3">
                    <Button variant="link" asChild>
                        <Link href={route('items.show', item.id)}>
                            <Eye />
                        </Link>
                    </Button>

                    {canEditItem(item) && (
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
