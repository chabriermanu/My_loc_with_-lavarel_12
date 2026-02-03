import { LoanCard } from '@/components/Loans/LoanCard';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Loan } from '@/types';
import { Head } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';

declare function route(name: string, params?: any): string;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Prêts', href: route('loans.index') },
];

interface Props {
    myLoansAsOwner: { data: Loan[] };
    myLoansAsBorrower: { data: Loan[] };
}

export default function Index({ myLoansAsOwner, myLoansAsBorrower }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes prêts" />

            <div className="space-y-10">
                {/* SECTION OWNER */}
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
                                Prêts reçus (je suis propriétaire)
                            </h1>
                            <p className="mt-2 text-white/80">
                                Objets que vous avez prêtés
                            </p>
                        </div>

                        <ClipboardList className="h-10 w-10 text-blue-500 drop-shadow-lg" />
                    </div>

                    {myLoansAsOwner.data.length > 0 ? (
                        <div className="grid gap-4">
                            {myLoansAsOwner.data.map((loan) => (
                                <LoanCard
                                    key={loan.id}
                                    loan={loan}
                                    userRole="owner"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg bg-white p-8 text-center shadow">
                            <p className="text-gray-600">Aucun prêt reçu.</p>
                        </div>
                    )}
                </section>

                {/* SECTION BORROWER */}
                <section>
                    <h2 className="mb-4 text-2xl font-bold">
                        Prêts demandés (je suis emprunteur)
                    </h2>

                    {myLoansAsBorrower.data.length > 0 ? (
                        <div className="grid gap-4">
                            {myLoansAsBorrower.data.map((loan) => (
                                <LoanCard
                                    key={loan.id}
                                    loan={loan}
                                    userRole="borrower"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg bg-white p-8 text-center shadow">
                            <p className="text-gray-600">Aucun prêt demandé.</p>
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
