import { LoanCard } from '@/components/Loans/LoanCard';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Loan } from '@/types/model';
import { Head, Link } from '@inertiajs/react';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

declare function route(name: string, params?: any): string;

interface LoanShowProps {
    loan: Loan;
    userRole: 'owner' | 'borrower';
    contactInfo?: {
        email?: string;
        phone?: string;
        address?: string;
    };
}

export default function Show({ loan, userRole, contactInfo }: LoanShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Prêts', href: route('loans.index') },
        { title: `Prêt #${loan.id}`, href: route('loans.show', loan.id) },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Prêt #${loan.id}`} />

            <div className="space-y-8">
                {/* Titre */}
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
                        Détails du prêt
                    </h1>
                    <p className="mt-2 text-white/80">
                        Consultez toutes les informations concernant ce prêt
                    </p>
                </div>

                {/* Carte du prêt */}
                <LoanCard loan={loan} userRole={userRole} />

                {/* Coordonnées partagées */}
                {contactInfo && Object.keys(contactInfo).length > 0 && (
                    <div className="space-y-4 rounded-lg bg-white p-6 shadow">
                        <h2 className="flex items-center gap-2 text-xl font-semibold">
                            <Phone className="h-5 w-5 text-blue-600" />
                            Coordonnées partagées
                        </h2>

                        <div className="space-y-2 text-gray-700">
                            {contactInfo.email && (
                                <p className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-blue-500" />
                                    {contactInfo.email}
                                </p>
                            )}

                            {contactInfo.phone && (
                                <p className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-blue-500" />
                                    {contactInfo.phone}
                                </p>
                            )}

                            {contactInfo.address && (
                                <p className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-blue-500" />
                                    {contactInfo.address}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Messages */}
                <div className="space-y-4 rounded-lg bg-white p-6 shadow">
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                        <MessageCircle className="h-5 w-5 text-blue-600" />
                        Messages
                    </h2>

                    {loan.messages?.length ? (
                        <div className="space-y-3">
                            {loan.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="rounded-md bg-gray-100 p-3 text-sm"
                                >
                                    <p className="font-semibold text-gray-700">
                                        {msg.sender?.name ?? 'Utilisateur'}
                                    </p>
                                    <p className="text-gray-600">
                                        {msg.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            Aucun message pour le moment.
                        </p>
                    )}
                </div>

                {/* Bouton retour */}
                <div className="text-center">
                    <Link
                        href={route('loans.index')}
                        className="text-blue-600 hover:underline"
                    >
                        ← Retour à la liste des prêts
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
