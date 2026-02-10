import type { Category, LaravelPagination, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '../../layouts/app-layout';

interface CategoriesIndexProps extends PageProps {
    categories: LaravelPagination<Category>;
    type: 'all' | 'object' | 'service';
}

export default function Index({
    auth,
    categories,
    type,
}: CategoriesIndexProps) {
    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Catégories', href: route('categories.index') },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Catégories" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête avec filtres */}
                            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="font-baloo text-3xl font-bold text-gray-900">
                                        {type === 'object' &&
                                            '📦 Objets à louer'}
                                        {type === 'service' &&
                                            '📋 Services disponibles'}
                                        {type === 'all' &&
                                            'Toutes les catégories'}
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-600">
                                        {categories.total} catégorie
                                        {categories.total > 1 ? 's' : ''}{' '}
                                        disponible
                                        {categories.total > 1 ? 's' : ''}
                                    </p>
                                </div>

                                {/* Filtres type */}
                                <div className="flex gap-2">
                                    <Link
                                        href={route('categories.index')}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                            type === 'all'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        Tout
                                    </Link>
                                    <Link
                                        href={route('categories.objects')}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                            type === 'object'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        📦 Objets
                                    </Link>
                                    <Link
                                        href={route('categories.services')}
                                        className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                            type === 'service'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        📋 Services
                                    </Link>
                                </div>
                            </div>

                            {/* Grid de catégories en CARDS */}
                            {categories.data.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                        {categories.data.map((category) => {
                                            // ✅ Debug - à retirer après test
                                            if (!category.id) {
                                                console.error(
                                                    'Catégorie sans ID:',
                                                    category,
                                                );
                                                return null;
                                            }

                                            return (
                                                <Link
                                                    key={category.id}
                                                    href={route(
                                                        'categories.show',
                                                        category.id,
                                                    )}
                                                    className="group overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-lg"
                                                >
                                                    {/* En-tête de la card */}
                                                    <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                                                        <div className="flex items-start gap-4">
                                                            {category.icon && (
                                                                <span className="text-5xl">
                                                                    {
                                                                        category.icon
                                                                    }
                                                                </span>
                                                            )}
                                                            <div className="flex-1">
                                                                <h2 className="mb-2 font-baloo text-xl font-bold text-gray-900 group-hover:text-blue-600">
                                                                    {
                                                                        category.name
                                                                    }
                                                                </h2>
                                                                {category.description && (
                                                                    <p className="line-clamp-2 text-sm text-gray-600">
                                                                        {
                                                                            category.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Aperçu des 4 meilleurs items */}
                                                    <div className="p-4">
                                                        {category.items &&
                                                        category.items.length >
                                                            0 ? (
                                                            <>
                                                                <div className="mb-3 grid grid-cols-2 gap-2">
                                                                    {category.items
                                                                        .slice(
                                                                            0,
                                                                            4,
                                                                        )
                                                                        .map(
                                                                            (
                                                                                item,
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        item.id
                                                                                    }
                                                                                    className="relative aspect-square overflow-hidden rounded bg-gray-100"
                                                                                >
                                                                                    {item.picture ? (
                                                                                        <img
                                                                                            src={`/items/${item.id}/picture`}
                                                                                            alt={
                                                                                                item.name
                                                                                            }
                                                                                            className="h-full w-full object-cover transition group-hover:scale-110"
                                                                                        />
                                                                                    ) : (
                                                                                        <div className="flex h-full items-center justify-center text-3xl">
                                                                                            {category.icon ||
                                                                                                '📦'}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                </div>

                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="text-gray-600">
                                                                        {category.items_count ??
                                                                            0}{' '}
                                                                        item
                                                                        {(category.items_count ??
                                                                            0) >
                                                                        1
                                                                            ? 's'
                                                                            : ''}
                                                                    </span>
                                                                    <span className="font-medium text-blue-600 group-hover:underline">
                                                                        Voir
                                                                        tout →
                                                                    </span>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <p className="py-8 text-center text-sm text-gray-500">
                                                                Aucun item pour
                                                                le moment
                                                            </p>
                                                        )}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {/* Pagination */}
                                    {categories.last_page > 1 && (
                                        <div className="mt-8 flex justify-center">
                                            <nav className="flex items-center gap-2">
                                                {categories.links.map(
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
                                <p className="py-12 text-center text-gray-500">
                                    Aucune catégorie disponible pour ce type
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
