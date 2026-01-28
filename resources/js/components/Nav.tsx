// resources/js/Components/Navbar.tsx

import { Link, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';
import { useState, useRef, useEffect } from 'react';
import { Settings, User, LogOut, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { auth } = usePage<PageProps>().props;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Fermer le dropdown si on clique ailleurs
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    // Fermer le menu mobile quand on change de route
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [usePage().url]);
    
    return (
        <nav className="border-b bg-white/20 backdrop-blur-md py-2 shadow-md">
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
                            className="text-white font-semibold underline hover:text-blue-600 transition-colors"
                        >
                            Items
                        </Link>
                        <Link
                            href="/categories"
                            className="text-white font-semibold underline hover:text-blue-600 transition-colors"
                        >
                            Catégories
                        </Link>
                        
                        {auth.user && (
                            <>
                                <Link
                                    href="/loans"
                                    className="text-white font-semibold underline hover:text-blue-600 transition-colors"
                                >
                                    Mes Prêts
                                </Link>
                                <Link
                                    href="/favorites"
                                    className="text-white font-semibold underline hover:text-blue-600 transition-colors"
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
                                    href="/items/create"
                                    className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                >
                                    Ajouter un item
                                </Link>
                                
                                {/* Menu utilisateur avec dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                                            {auth.user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span>{auth.user.name}</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {/* Dropdown menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="py-1">
                                                <div className="px-4 py-3 border-b">
                                                    <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                                                    <p className="text-sm text-gray-500 truncate">{auth.user.email}</p>
                                                </div>
                                                
                                                <Link
                                                    href="/dashboard"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <User className="mr-3 h-4 w-4" />
                                                    Mon profil
                                                </Link>
                                                
                                                <Link
                                                    href="/settings"
                                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    <Settings className="mr-3 h-4 w-4" />
                                                    Paramètres
                                                </Link>
                                                
                                                <div className="border-t">
                                                    <Link
                                                        href="/logout"
                                                        method="post"
                                                        as="button"
                                                        className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                        onClick={() => setIsDropdownOpen(false)}
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
                                    className="text-gray-700 hover:text-gray-900 transition-colors"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                >
                                    Inscription
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Bouton hamburger Mobile */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
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
                <div className="md:hidden border-t bg-white/10 backdrop-blur-md">
                    <div className="space-y-1 px-4 pb-3 pt-2">
                        {/* Navigation */}
                        <Link
                            href="/items"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                        >
                            Items
                        </Link>
                        <Link
                            href="/categories"
                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                        >
                            Catégories
                        </Link>
                        
                        {auth.user && (
                            <>
                                <Link
                                    href="/loans"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                >
                                    Mes Prêts
                                </Link>
                                <Link
                                    href="/favorites"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                                >
                                    Favoris
                                </Link>
                                <Link
                                    href="/items/create"
                                    className="block rounded-md px-3 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                    Ajouter un item
                                </Link>
                            </>
                        )}
                        
                        {/* Section utilisateur mobile */}
                        {auth.user ? (
                            <div className="border-t pt-4 mt-4">
                                <div className="flex items-center px-3 py-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-800">{auth.user.name}</div>
                                        <div className="text-sm text-gray-500">{auth.user.email}</div>
                                    </div>
                                </div>
                                
                                <Link
                                    href="/dashboard"
                                    className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors mt-2"
                                >
                                    <User className="mr-3 h-5 w-5" />
                                    Mon profil
                                </Link>
                                
                                <Link
                                    href="/settings"
                                    className="flex items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <Settings className="mr-3 h-5 w-5" />
                                    Paramètres
                                </Link>
                                
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex w-full items-center rounded-md px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="mr-3 h-5 w-5" />
                                    Déconnexion
                                </Link>
                            </div>
                        ) : (
                            <div className="border-t pt-4 mt-4 space-y-2">
                                <Link
                                    href="/login"
                                    className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Connexion
                                </Link>
                                <Link
                                    href="/register"
                                    className="block rounded-md px-3 py-2 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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