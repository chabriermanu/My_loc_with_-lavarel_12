// resources/js/Components/Navbar.tsx

import type { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, LogOut, Menu, Settings, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { route } from 'ziggy-js';

export default function Navbar() {
    const { auth } = usePage<PageProps>().props;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fermer le dropdown si on clique ailleurs
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fermer le menu mobile quand on change de route
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [usePage().url]);

    return (
        <nav className="sticky top-0 z-50 border-b bg-white/20 py-2 shadow-md backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="text-2xl font-black text-blue-600"
                        >
                            MyLoc
                        </Link>
                    </div>

                    {/* Navigation Desktop - cachée en mobile */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <Link
                            href="/items"
                            className="font-semibold text-white underline transition-colors hover:text-blue-600"
                        >
                            Items
                        </Link>
                        <Link
                            href="/categories"
                            className="font-semibold text-white underline transition-colors hover:text-blue-600"
                        >
                            Catégories
                        </Link>

                        {auth.user && (
                            <>
                                <Link
                                    href="/loans"
                                    className="font-semibold text-white underline transition-colors hover:text-blue-600"
                                >
                                    Mes Prêts
                                </Link>
                                <Link
                                    href="/favorites"
                                    className="font-semibold text-white underline transition-colors hover:text-blue-600"
                                >
                                    Favoris
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Boutons Auth Desktop */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href={route('items.create')}
                                    className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    Ajouter un item
                                </Link>

                                {/* Menu utilisateur avec dropdown */}
                                <div
                                    className="relative z-50"
                                    ref={dropdownRef}
                                >
                                    <button
                                        onClick={() =>
                                            setIsDropdownOpen(!isDropdownOpen)
                                        }
                                        className="flex items-center space-x-2 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                                            {auth.user.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <span>{auth.user.name}</span>
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Dropdown menu */}
                                    {isDropdownOpen && (
                                        <div className="ring-opacity-5 absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black">
                                            <div className="py-1">
                                                <div className="border-b px-4 py-3">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {auth.user.name}
                                                    </p>
                                                    <p className="truncate text-sm text-gray-500">
                                                        {auth.user.email}
                                                    </p>
                                                </div>

                                                <Link
                                                    href="/dashboard"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                                                    onClick={() =>
                                                        setIsDropdownOpen(false)
                                                    }
                                                >
                                                    <User className="mr-3 h-4 w-4" />
                                                    Mon profil
                                                </Link>

                                                <Link
                                                    href="/settings"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                                                    onClick={() =>
                                                        setIsDropdownOpen(false)
                                                    }
                                                >
                                                    <Settings className="mr-3 h-4 w-4" />
                                                    Paramètres
                                                </Link>

                                                <div className="border-t">
                                                    <Link
                                                        href="/logout"
                                                        method="post"
                                                        as="button"
                                                        className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                                                        onClick={() =>
                                                            setIsDropdownOpen(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        <LogOut className="mr-3 h-4 w-4" />
                                                        Déconnexion
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-700 transition-colors hover:text-gray-900"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    Inscription
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Bouton hamburger Mobile */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600"
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Mobile */}
            {isMobileMenuOpen && (
                <div className="border-t bg-white/10 backdrop-blur-md md:hidden">
                    <div className="space-y-1 px-4 pt-2 pb-3">
                        {/* Navigation */}
                        <Link
                            href="/items"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600"
                        >
                            Items
                        </Link>
                        <Link
                            href="/categories"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600"
                        >
                            Catégories
                        </Link>

                        {auth.user && (
                            <>
                                <Link
                                    href="/loans"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600"
                                >
                                    Mes Prêts
                                </Link>
                                <Link
                                    href="/favorites"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600"
                                >
                                    Favoris
                                </Link>
                                <Link
                                    href="/items/create"
                                    className="block rounded-md bg-blue-600 px-3 py-2 text-base font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    Ajouter un item
                                </Link>
                            </>
                        )}

                        {/* Section utilisateur mobile */}
                        {auth.user ? (
                            <div className="mt-4 border-t pt-4">
                                <div className="flex items-center px-3 py-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">
                                            {auth.user.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {auth.user.email}
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href="/dashboard"
                                    className="mt-2 flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100"
                                >
                                    <User className="mr-3 h-5 w-5" />
                                    Mon profil
                                </Link>

                                <Link
                                    href="/settings"
                                    className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100"
                                >
                                    <Settings className="mr-3 h-5 w-5" />
                                    Paramètres
                                </Link>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center rounded-md px-3 py-2 text-left text-base font-medium text-red-600 transition-colors hover:bg-red-50"
                                >
                                    <LogOut className="mr-3 h-5 w-5" />
                                    Déconnexion
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-4 space-y-2 border-t pt-4">
                                <Link
                                    href="/login"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/register"
                                    className="block rounded-md bg-blue-600 px-3 py-2 text-base font-medium text-white transition-colors hover:bg-blue-700"
                                >
                                    Inscription
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
