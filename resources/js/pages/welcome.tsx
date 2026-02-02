import ItemCard from '@/components/Items/ItemCard';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';
import type { Category, Item } from '@/types/model';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface WelcomeProps {
    canRegister?: boolean;
    topRatedItems: Item[];
    recentItems: Item[];
    popularCategories: Category[];
}

export default function Welcome({
    canRegister = true,
    topRatedItems = [],
    recentItems = [],
    popularCategories = [],
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            <Head title="Bienvenue" />

            <div className="min-h-screen bg-gray-50">
                {/* SECTION HERO */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
                                Bienvenue sur MyLoc
                            </h1>

                            <p className="mb-8 text-xl text-blue-100 md:text-2xl">
                                Louez, partagez et découvrez des objets et des
                                services près de chez vous.
                            </p>

                            <div className="flex justify-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                                    >
                                        Accéder au dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-lg border-2 border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-blue-600"
                                        >
                                            Connexion
                                        </Link>

                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                                            >
                                                Inscription
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION ITEMS LES MIEUX NOTÉS - SCROLL HORIZONTAL */}
                <div className="bg-white py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-gray-900">
                                ⭐ Items les mieux notés
                            </h2>
                            {topRatedItems.length > 0 && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => scroll('left')}
                                        className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
                                        aria-label="Défiler vers la gauche"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={() => scroll('right')}
                                        className="rounded-full bg-gray-100 p-2 transition hover:bg-gray-200"
                                        aria-label="Défiler vers la droite"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* CONTENU OU MESSAGE VIDE */}
                        {topRatedItems.length > 0 ? (
                            <div
                                ref={scrollContainerRef}
                                className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth pb-4"
                                style={{
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                }}
                            >
                                {topRatedItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="w-80 flex-none"
                                    >
                                        <ItemCard
                                            item={item}
                                            showActions={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-lg text-gray-500">
                                    Aucun item noté pour le moment. Soyez le
                                    premier à noter un item ! 🌟
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* SECTION CATÉGORIES LES PLUS VUES */}
                <div className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-gray-900">
                                🔥 Catégories populaires
                            </h2>
                            {popularCategories.length > 0 && (
                                <Link
                                    href={route('categories.index')}
                                    className="font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Voir tout →
                                </Link>
                            )}
                        </div>

                        {/* CONTENU OU MESSAGE VIDE */}
                        {popularCategories.length > 0 ? (
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                                {popularCategories
                                    .filter(category => category.id) // ✅ Filtrer les catégories sans ID
                                    .map((category) => (
                                        <Link
                                            key={category.id}
                                            href={route('categories.show', category.id)} // ✅ Utilisez route() avec l'ID
                                            className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
                                        >
                                            {/* Badge du nombre d'items */}
                                            <div className="absolute top-4 right-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                                                {category.items_count || 0}
                                            </div>

                                            {/* Icône ou emoji */}
                                            <div className="mb-4 text-4xl">
                                                {category.icon || '📦'}
                                            </div>

                                            {/* Nom de la catégorie */}
                                            <h3 className="text-lg font-bold text-gray-900 transition group-hover:text-blue-600">
                                                {category.name}
                                            </h3>

                                            {/* Description */}
                                            {category.description && (
                                                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                                                    {category.description}
                                                </p>
                                            )}
                                        </Link>
                                    ))
                                }
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-lg text-gray-500">
                                    Aucune catégorie disponible pour le moment.
                                    📂
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* SECTION ITEMS RÉCENTS */}
                <div className="bg-white py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-gray-900">
                                🆕 Nouveautés
                            </h2>
                            {recentItems.length > 0 && (
                                <Link
                                    href={route('items.index')}
                                    className="font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Voir tout →
                                </Link>
                            )}
                        </div>

                        {/* CONTENU OU MESSAGE VIDE */}
                        {recentItems.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {recentItems.map((item) => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        showActions={false}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-lg text-gray-500">
                                    Aucun item récent pour le moment. 📦
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}