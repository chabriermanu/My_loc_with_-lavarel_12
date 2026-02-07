import ItemCard from '@/components/Items/ItemCard';
import AppLayout from '@/layouts/app-layout';
import type {
    BreadcrumbItem,
    Item,
    LaravelPagination,
    PageProps,
} from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface ItemsIndexProps extends PageProps {
    items: LaravelPagination<Item>;
}

export default function Index({ auth, items }: ItemsIndexProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Articles', href: route('items.index') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Articles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="font-baloo text-3xl font-bold text-gray-900">
                                📦 Tous les articles
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                {items.total} article
                                {items.total > 1 ? 's' : ''} disponible
                                {items.total > 1 ? 's' : ''}
                            </p>
                        </div>

                        {auth.user && (
                            <Link
                                href={route('items.create')}
                                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
                            >
                                + Ajouter un article
                            </Link>
                        )}
                    </div>

                    {/* Liste des items */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {items.data.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {items.data.map((item) => (
                                            <div
                                                key={item.id}
                                                className="relative"
                                            >
                                                <ItemCard
                                                    item={item}
                                                    showActions={true}
                                                />

                                                {/* Badge distance si disponible */}
                                                {item.distance !==
                                                    undefined && (
                                                    <div className="absolute top-2 left-2 z-10">
                                                        <span className="flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                                                            📍 {item.distance}{' '}
                                                            km
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {items.last_page > 1 && (
                                        <div className="mt-8 flex justify-center">
                                            <nav className="flex items-center gap-2">
                                                {items.links.map(
                                                    (link, index) => (
                                                        <Link
                                                            key={index}
                                                            href={
                                                                link.url || '#'
                                                            }
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
                                </>
                            ) : (
                                <div className="py-12 text-center">
                                    <div className="mb-4 text-6xl">📦</div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                        Aucun article trouvé
                                    </h3>
                                    <p className="text-gray-600">
                                        Aucun article disponible pour le moment.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
