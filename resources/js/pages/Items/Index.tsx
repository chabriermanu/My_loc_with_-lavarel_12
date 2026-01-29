import ItemCard from '@/components/Items/ItemCard';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Item } from '@/types/model';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

declare function route(name: string, params?: any): string;

interface PaginatedItems {
    data: Item[];
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

interface Props {
    items: PaginatedItems;
}

export default function Index({ items }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Articles' }]}>
            <Head title="Tous les articles" />

            <div className="space-y-6">
                {/* Header avec bouton créer */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Tous les articles
                        </h1>
                        <p className="mt-2 text-white/80">
                            Découvrez tous les articles disponibles
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/items/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Créer un article
                        </Link>
                    </Button>
                </div>

                {/* Grille d'items */}
                {items.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {items.data.map((item) => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                showActions={true}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg bg-white p-8 text-center shadow">
                        <p className="text-gray-600">
                            Aucun article disponible pour le moment.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/items/create">
                                Créer le premier article
                            </Link>
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {items.last_page > 1 && (
                    <div className="flex items-center justify-center space-x-2">
                        {items.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                          ? 'bg-white text-gray-700 hover:bg-gray-50'
                                          : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                }`}
                                preserveScroll
                                dangerouslySetInnerHTML={{
                                    __html: link.label,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
