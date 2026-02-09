// resources/js/Layouts/AppLayout.tsx

import FirstLoginConsentModal from '@/components/Consent/FirstLoginConsentModal';
import Nav from '@/components/Nav';
import type { AppLayoutProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight, Home } from 'lucide-react';

export default function AppLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const { auth, csrf_token } = usePage<{
        auth: {
            user: {
                has_given_consents: boolean;
            } | null;
        };
        csrf_token: string;
    }>().props;

    return (
        <div className="flex min-h-screen flex-col bg-linear-to-br from-sky-500 to-fuchsia-500">
            {/* ⭐ AJOUTE LE HEAD AVEC CSRF */}
            <Head>
                <meta name="csrf-token" content={csrf_token} />
            </Head>

            {/* Modal RGPD - s'affiche si l'utilisateur est connecté mais n'a pas donné ses consentements */}
            {auth.user && !auth.user.has_given_consents && (
                <FirstLoginConsentModal show={true} />
            )}

            {/* Navbar toujours en haut */}
            <Nav />

            {/* Breadcrumbs (si présents) */}
            {breadcrumbs.length > 0 && (
                <div className="border-b bg-white/10 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <nav className="flex h-12 items-center space-x-2 text-sm">
                            <Link
                                href="/"
                                className="flex items-center text-red-600 transition-colors hover:text-red-700"
                            >
                                <Home className="h-4 w-4" strokeWidth={2.5} />
                            </Link>

                            {breadcrumbs.map((breadcrumb, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                >
                                    <ChevronRight className="h-4 w-4 text-white" />
                                    {breadcrumb.href ? (
                                        <Link
                                            href={breadcrumb.href}
                                            className="font-semibold text-white underline transition-colors hover:text-blue-600"
                                        >
                                            {breadcrumb.title}
                                        </Link>
                                    ) : (
                                        <span className="font-medium text-gray-900">
                                            {breadcrumb.title}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Contenu principal */}
            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {/* Footer optionnel */}
            <footer className="border-t bg-white py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        © {new Date().getFullYear()} MyLoc - Plateforme de
                        partage et location
                    </p>
                </div>
            </footer>
        </div>
    );
}
