// resources/js/Pages/Categories/Show.tsx

import ItemCard from '@/components/Items/ItemCard';
import AppLayout from '@/layouts/app-layout';
import type { Category, Item, LaravelPagination, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { route } from 'ziggy-js';

interface CategoryShowProps extends PageProps {
    category: Category;
    items: LaravelPagination<Item>;
}

export default function Show({ auth, category, items }: CategoryShowProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Catégories', href: route('categories.index') },
        { title: category.name, href: route('categories.show', category.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={category.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* En-tête de la catégorie */}
                    <div className="mb-8 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <Link
                                href={route('categories.index')}
                                className="mb-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour aux catégories
                            </Link>

                            <div className="flex items-center gap-4">
                                {category.icon && (
                                    <span className="text-6xl">
                                        {category.icon}
                                    </span>
                                )}
                                <div className="flex-1">
                                    <h1 className="font-baloo text-4xl font-bold text-gray-900">
                                        {category.name}
                                    </h1>
                                    {category.description && (
                                        <p className="mt-2 text-lg text-gray-600">
                                            {category.description}
                                        </p>
                                    )}
                                    <p className="mt-2 text-sm text-gray-500">
                                        {items.total} item
                                        {items.total > 1 ? 's' : ''} disponible
                                        {items.total > 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des items */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {items.data.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {items.data.map((item) => (
                                            <ItemCard
                                                key={item.id}
                                                item={item}
                                                showActions={true}
                                            />
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
                                    <div className="mb-4 text-6xl">
                                        {category.icon || '📦'}
                                    </div>
                                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                        Aucun item disponible
                                    </h3>
                                    <p className="text-gray-600">
                                        Cette catégorie ne contient pas encore
                                        d'items.
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
