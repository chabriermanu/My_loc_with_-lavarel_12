import { LoanCard } from '@/components/Loans/LoanCard';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, LaravelPagination, Loan } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';

declare function route(name: string, params?: any): string;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: 'dashboard' },
    { title: 'Mes prêts', href: 'loans.lends' },
];

interface Props {
    lends: LaravelPagination<Loan>;
}

export default function Lends({ lends }: Props) {
    // Approve
    const handleApprove = (loanId: number) => {
        if (!confirm('Voulez-vous vraiment approuver ce prêt ?')) return;

        router.patch(
            route('loans.approve', loanId),
            {},
            {
                preserveScroll: true,
                onError: () =>
                    alert(
                        "Une erreur est survenue lors de l'approbation du prêt.",
                    ),
            },
        );
    };

    // Reject
    const handleReject = (loanId: number) => {
        if (!confirm('Voulez-vous vraiment refuser ce prêt ?')) return;

        router.patch(
            route('loans.reject', loanId),
            {},
            {
                preserveScroll: true,
                onError: () =>
                    alert('Une erreur est survenue lors du refus du prêt.'),
            },
        );
    };

    // Complete
    const handleComplete = (loanId: number) => {
        if (!confirm("Confirmez-vous que l'objet a été restitué ?")) return;

        router.patch(
            route('loans.complete', loanId),
            {},
            {
                preserveScroll: true,
                onError: () =>
                    alert('Une erreur est survenue lors de la restitution.'),
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes prêts" />

            <div className="space-y-10">
                <section>
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
                                Demande de prêts reçus (je suis propriétaire)
                            </h1>
                            <p className="mt-2 text-white/80">
                                Objets que vous avez prêtés
                            </p>
                        </div>

                        <ClipboardList className="h-10 w-10 text-blue-500 drop-shadow-lg" />
                    </div>

                    {lends.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {lends.data.map((loan) => (
                                    <LoanCard
                                        key={loan.id}
                                        loan={loan}
                                        userRole="owner"
                                        onApprove={handleApprove}
                                        onReject={handleReject}
                                        onComplete={handleComplete}
                                    />
                                ))}
                            </div>

                            {/* PAGINATION */}
                            {lends.last_page > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex items-center gap-2">
                                        {lends.links.map((link, index) => (
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
                            <p className="text-gray-600">Aucun prêt reçu.</p>
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
