// resources/js/Components/Navbar.tsx

import { Link, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

export default function Navbar() {
    const { auth } = usePage<PageProps>().props;
    
    return (
        <nav className="border-b bg-white py-2 shadow-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    {/* Logo + Navigation principale */}
                    <div className="flex items-center space-x-8">
                        <Link
                            href="/"
                            className="text-2xl font-black text-blue-600"
                        >
                            MyLoc
                        </Link>
                        
                        {/* Liens publics */}
                        <div className="hidden md:flex space-x-6">
                            <Link
                                href="/items"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Items
                            </Link>
                            <Link
                                href="/categories"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Catégories
                            </Link>
                            
                            {/* Liens privés (si connecté) */}
                            {auth.user && (
                                <>
                                    <Link
                                        href="/loans"
                                        className="text-gray-700 hover:text-blue-600"
                                    >
                                        Mes Prêts
                                    </Link>
                                    <Link
                                        href="/favorites"
                                        className="text-gray-700 hover:text-blue-600"
                                    >
                                        Favoris
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Boutons Auth */}
                    <div className="flex items-center space-x-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href="/items/create"
                                    className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Ajouter un item
                                </Link>
                                <span className="text-gray-700">
                                    {auth.user.name}
                                </span>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Déconnexion
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-gray-900"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Inscription
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}