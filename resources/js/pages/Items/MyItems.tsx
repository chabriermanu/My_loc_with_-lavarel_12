// resources/js/Pages/Items/MyItems.tsx

import ItemCard from '@/components/Items/ItemCard';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Item, LaravelPagination } from '@/types/model';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

interface MyItemsProps {
    items: LaravelPagination<Item>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mes items', href: undefined },
];

export default function MyItems({ items }: MyItemsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes items" />

            <div className="space-y-6">
                {/* En-tête */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Mes items
                        </h1>
                        <p className="mt-2 text-white/80">
                            {items.total} item{items.total > 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Bouton Ajouter */}
                    <Link
                        href="/items/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                    >
                        <Plus className="h-5 w-5" />
                        Ajouter un item
                    </Link>
                </div>

                {/* Grid des items */}
                {items.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {items.data.map((item) => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                showActions={false}
                            />
                        ))}
                    </div>
                ) : (
                    /* Message si aucun item */
                    <div className="rounded-lg border-2 border-dashed border-white/20 bg-white/5 p-12 text-center backdrop-blur-sm">
                        <p className="mb-4 text-lg text-white">
                            Vous n'avez encore aucun item
                        </p>
                        <Link
                            href="/items/create"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                        >
                            <Plus className="h-5 w-5" />
                            Créer mon premier item
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {items.last_page > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                        <p className="text-sm text-white/70">
                            Page {items.current_page} sur {items.last_page}
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
