import { LoanCard } from '@/components/Loans/LoanCard';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LaravelPagination, Loan } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowBigLeftDash } from 'lucide-react';

declare function route(name: string, params?: any): string;

interface Props {
    borrows: LaravelPagination<Loan>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: 'dashboard' },
    { title: 'Mes emprunts', href: 'loans.borrows' },
];

export default function Borrows({ borrows }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes emprunts" />

            <div className="space-y-10">
                <section>
                    {/* HEADER */}
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1
                                className="text-3xl font-semibold underline"
                                style={{
                                    color: 'white',
                                    WebkitTextStroke: '1.5px #2563eb',
                                    paintOrder: 'stroke fill',
                                    textShadow:
                                        '0 4px 16px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.6)',
                                }}
                            >
                                Mes emprunts (je suis emprunteur)
                            </h1>

                            <p className="mt-2 text-white/80">
                                Objets que vous avez empruntés
                            </p>
                        </div>
                    </div>

                    {/* LISTE DES EMPRUNTS */}
                    {borrows.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {borrows.data.map((loan) => (
                                    <LoanCard
                                        key={loan.id}
                                        loan={loan}
                                        userRole="borrower"
                                    />
                                ))}
                            </div>

                            {/* PAGINATION */}
                            {borrows.last_page > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex items-center gap-2">
                                        {borrows.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
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
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rounded-lg bg-white p-8 text-center shadow">
                            <p className="text-gray-600">
                                Vous n'avez encore rien emprunté.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
