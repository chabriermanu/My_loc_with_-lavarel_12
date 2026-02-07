import ItemCard from '@/components/Items/ItemCard';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Item, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { route } from 'ziggy-js';

interface Favorite {
    id: number;
    item: Item;
    created_at: string;
}

interface PaginatedFavorites {
    data: Favorite[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface FavoritesIndexProps extends PageProps {
    favorites: PaginatedFavorites;
}

export default function Index({ auth, favorites }: FavoritesIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: route('dashboard'),
        },
        {
            title: 'Mes favoris',
            href: route('favorites.index'),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes favoris" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        <div className="mb-4 flex items-center justify-center">
                            <Star className="mr-3 h-10 w-10 fill-yellow-500 text-yellow-500" />
                            <h1 className="font-baloo text-4xl font-bold text-gray-900">
                                Mes favoris
                            </h1>
                        </div>
                        <p className="text-lg text-gray-600">
                            {favorites.total > 0
                                ? `${favorites.total} article${favorites.total > 1 ? 's' : ''} en favori`
                                : 'Aucun article en favori'}
                        </p>
                    </div>

                    {/* Grille de favoris */}
                    {favorites.data.length > 0 ? (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {favorites.data.map((favorite) => (
                                        <ItemCard
                                            key={favorite.item.id}
                                            item={favorite.item}
                                            showActions={true}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {favorites.last_page > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <nav className="flex items-center gap-2">
                                            {favorites.links.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        preserveScroll
                                                        className={`rounded px-4 py-2 text-sm font-medium transition ${
                                                            link.active
                                                                ? 'bg-blue-600 text-white'
                                                                : link.url
                                                                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                  : 'cursor-not-allowed bg-gray-50 text-gray-400'
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                ),
                                            )}
                                        </nav>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                            <div className="p-12 text-center">
                                <Star className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                                <h2 className="mb-2 text-xl font-semibold text-gray-800">
                                    Aucun favori pour le moment
                                </h2>
                                <p className="mb-6 text-gray-600">
                                    Commencez à ajouter des articles à vos
                                    favoris pour les retrouver facilement ici.
                                </p>
                                <Link
                                    href={route('items.index')}
                                    className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                                >
                                    Découvrir des articles
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
