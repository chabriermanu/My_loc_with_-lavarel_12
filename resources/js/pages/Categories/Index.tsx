import AppLayout from '../../layouts/app-layout';
import type { Category, PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface CategoriesIndexProps extends PageProps {
    categories: (Category & {
        items?: Array<{
            id: number;
            name: string;
            picture?: string;
            value?: number;
            type: 'object' | 'service';
            owner: {
                id: number;
                pseudo: string;
            };
        }>;
    })[];
    type: 'all' | 'object' | 'service'; // ← Nouveau
}

export default function Index({
    auth,
    categories,
    type,
}: CategoriesIndexProps) {
    const breadcrumbs = [
        { title: 'Accueil', href: '/' },
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
                            <div className="mb-8 flex items-center justify-between">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {type === 'object' && '📦 Objets à louer'}
                                    {type === 'service' &&
                                        '📋 Services disponibles'}
                                    {type === 'all' && 'Toutes les catégories'}
                                </h1>

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

                            {/* Liste des catégories */}
                            <div className="space-y-12">
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="border-b pb-8 last:border-b-0"
                                        >
                                            <div className="mb-6 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {category.icon && (
                                                        <span className="text-4xl">
                                                            {category.icon}
                                                        </span>
                                                    )}
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-gray-900">
                                                            {category.name}
                                                        </h2>
                                                        {category.description && (
                                                            <p className="text-sm text-gray-600">
                                                                {
                                                                    category.description
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <Link
                                                    href={`/categories/${category.id}`}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    Voir tout (
                                                    {category.items_count || 0})
                                                </Link>
                                            </div>

                                            {category.items &&
                                            category.items.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                    {category.items.map(
                                                        (item) => (
                                                            <Link
                                                                key={item.id}
                                                                href={`/items/${item.id}`}
                                                                className="group overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
                                                            >
                                                                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                                                                    {item.picture ? (
                                                                        <img
                                                                            src={`/storage/${item.picture}`}
                                                                            alt={
                                                                                item.name
                                                                            }
                                                                            className="h-full w-full object-cover transition group-hover:scale-105"
                                                                        />
                                                                    ) : (
                                                                        <div className="flex h-full items-center justify-center text-4xl">
                                                                            {category.icon ||
                                                                                '📦'}
                                                                        </div>
                                                                    )}

                                                                    <div className="absolute top-2 right-2">
                                                                        {item.type ===
                                                                        'service' ? (
                                                                            <span className="rounded bg-blue-500 px-2 py-1 text-xs font-medium text-white">
                                                                                📋
                                                                                Service
                                                                            </span>
                                                                        ) : (
                                                                            <span className="rounded bg-green-500 px-2 py-1 text-xs font-medium text-white">
                                                                                📦
                                                                                Objet
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="p-4">
                                                                    <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-blue-600">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </h3>

                                                                    {item.value && (
                                                                        <p className="mb-2 text-lg font-bold text-green-600">
                                                                            {
                                                                                item.value
                                                                            }{' '}
                                                                            €
                                                                            <span className="text-sm font-normal text-gray-500">
                                                                                {item.type ===
                                                                                'service'
                                                                                    ? ' / prestation'
                                                                                    : ' / jour'}
                                                                            </span>
                                                                        </p>
                                                                    )}

                                                                    <p className="text-sm text-gray-500">
                                                                        Par{' '}
                                                                        {
                                                                            item
                                                                                .owner
                                                                                .pseudo
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="py-8 text-center text-gray-500">
                                                    Aucun item dans cette
                                                    catégorie pour le moment
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="py-12 text-center text-gray-500">
                                        Aucune catégorie disponible pour ce type
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
