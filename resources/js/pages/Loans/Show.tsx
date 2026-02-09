import { LoanCard } from '@/components/Loans/LoanCard';
import MessageBox from '../../components/Loans/MessageBox';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps } from '@/types';
import { User } from '@/types/auth';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, Mail, MapPin, Phone } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { Loan } from '@/types/model';

declare function route(name: string, params?: any): string;

interface LoanShowProps extends PageProps {
    loan: Loan;
    otherUser: User;
    userRole: 'owner' | 'borrower';
    canRequestContact: boolean;
    canShareContact: boolean;
    canViewContactInfo: boolean;
    contactInfo?: {
        email?: string;
        phone?: string;
        address?: string;
    };
    borrowerContactInfo?: {
        email?: string;
        phone?: string;
        address?: string;
    };
    showContact: boolean;
}

export default function Show({
    auth,
    loan,
    otherUser,
    userRole,
    canRequestContact,
    canShareContact,
    canViewContactInfo,
    contactInfo,
    borrowerContactInfo,
    showContact,
}: LoanShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        {
            title: userRole === 'borrower' ? 'Mes emprunts' : 'Mes prêts',
            href:
                userRole === 'borrower'
                    ? route('loans.borrows')
                    : route('loans.lends'),
        },
        { title: `Prêt #${loan.id}` },
    ];

    const [showShareForm, setShowShareForm] = useState(false);

    const shareForm = useForm({
        share_email: false,
        share_phone: false,
        share_address: false,
    });

    const handleRequestContact = () => {
        router.post(
            route('loans.request-contact', loan.id),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    const handleShareContact: FormEventHandler = (e) => {
        e.preventDefault();
        shareForm.post(route('loans.share-contact', loan.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowShareForm(false);
                shareForm.reset();
            },
        });
    };

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
                <LoanCard
                    loan={loan}
                    userRole={userRole}
                    hideDetailsButton={true}
                    onApprove={(loanId) => {
                        router.patch(
                            route('loans.approve', loanId),
                            {},
                            {
                                preserveScroll: true,
                            },
                        );
                    }}
                    onReject={(loanId) => {
                        router.patch(
                            route('loans.reject', loanId),
                            {},
                            {
                                preserveScroll: true,
                            },
                        );
                    }}
                    onComplete={(loanId) => {
                        router.patch(
                            route('loans.complete', loanId),
                            {},
                            {
                                preserveScroll: true,
                            },
                        );
                    }}
                />

                {/* Section Coordonnées */}
                <div className="space-y-4 rounded-lg bg-white p-6 shadow">
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                        <Phone className="h-5 w-5 text-blue-600" />
                        Coordonnées
                    </h2>

                    {/* Propriétaire : Coordonnées de l'emprunteur si retard */}
                    {userRole === 'owner' &&
                        showContact &&
                        borrowerContactInfo &&
                        Object.keys(borrowerContactInfo).length > 0 && (
                            <div className="space-y-3 rounded-md border-2 border-orange-400 bg-orange-50 p-4">
                                <div className="flex items-start gap-2">
                                    <div className="rounded-full bg-orange-500 p-1">
                                        <AlertCircle className="h-5 w-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-orange-900">
                                            Retard détecté (+0.25h)
                                        </p>
                                        <p className="text-sm text-orange-800">
                                            L'emprunteur n'a pas restitué
                                            l'objet à temps. Ses coordonnées
                                            sont affichées automatiquement :
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-gray-700">
                                    {borrowerContactInfo.email && (
                                        <p className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-orange-600" />
                                            <strong>Email :</strong>{' '}
                                            {borrowerContactInfo.email}
                                        </p>
                                    )}

                                    {borrowerContactInfo.phone && (
                                        <p className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-orange-600" />
                                            <strong>Téléphone :</strong>{' '}
                                            {borrowerContactInfo.phone}
                                        </p>
                                    )}

                                    {borrowerContactInfo.address && (
                                        <p className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-orange-600" />
                                            <strong>Adresse :</strong>{' '}
                                            {borrowerContactInfo.address}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Emprunteur : Demander les coordonnées */}
                    {userRole === 'borrower' && canRequestContact && (
                        <div>
                            <p className="mb-3 text-sm text-gray-600">
                                Vous pouvez demander les coordonnées du
                                propriétaire pour organiser la remise de
                                l'objet.
                            </p>
                            <button
                                onClick={handleRequestContact}
                                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                Demander les coordonnées
                            </button>
                        </div>
                    )}

                    {/* Propriétaire : Partager les coordonnées */}
                    {userRole === 'owner' && canShareContact && (
                        <div>
                            {!showShareForm ? (
                                <div>
                                    <p className="mb-3 text-sm text-gray-600">
                                        L'emprunteur a demandé vos coordonnées.
                                    </p>
                                    <button
                                        onClick={() => setShowShareForm(true)}
                                        className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                    >
                                        Partager mes coordonnées
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleShareContact}
                                    className="space-y-3"
                                >
                                    <p className="text-sm text-gray-600">
                                        Choisissez les informations à partager :
                                    </p>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={shareForm.data.share_email}
                                            onChange={(e) =>
                                                shareForm.setData(
                                                    'share_email',
                                                    e.target.checked,
                                                )
                                            }
                                            className="rounded"
                                        />
                                        <span className="text-sm">
                                            Partager mon email
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={shareForm.data.share_phone}
                                            onChange={(e) =>
                                                shareForm.setData(
                                                    'share_phone',
                                                    e.target.checked,
                                                )
                                            }
                                            className="rounded"
                                        />
                                        <span className="text-sm">
                                            Partager mon téléphone
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                shareForm.data.share_address
                                            }
                                            onChange={(e) =>
                                                shareForm.setData(
                                                    'share_address',
                                                    e.target.checked,
                                                )
                                            }
                                            className="rounded"
                                        />
                                        <span className="text-sm">
                                            Partager mon adresse
                                        </span>
                                    </label>

                                    {shareForm.errors && (
                                        <p className="text-sm text-red-600">
                                            {shareForm.errors.share_email ||
                                                shareForm.errors.share_phone ||
                                                shareForm.errors.share_address}
                                        </p>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            type="submit"
                                            disabled={shareForm.processing}
                                            className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                                        >
                                            Confirmer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowShareForm(false)
                                            }
                                            className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {/* Affichage des coordonnées partagées */}
                    {contactInfo &&
                        Object.keys(contactInfo).length > 0 &&
                        loan.status !== 'completed' &&
                        loan.status !== 'cancelled' && (
                            <div className="mt-4 space-y-2 rounded-md bg-green-50 p-4">
                                <p className="font-semibold text-green-800">
                                    Coordonnées partagées :
                                </p>
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

                    {/* Message si le prêt est terminé */}
                    {(loan.status === 'completed' ||
                        loan.status === 'cancelled') &&
                        userRole === 'borrower' && (
                            <div className="mt-4 rounded-md bg-gray-100 p-4">
                                <p className="text-sm text-gray-600">
                                    ℹ️ Les coordonnées ne sont plus disponibles
                                    car le prêt est{' '}
                                    {loan.status === 'completed'
                                        ? 'terminé'
                                        : 'annulé'}
                                    .
                                </p>
                            </div>
                        )}

                    {/* Message si coordonnées déjà partagées */}
                    {userRole === 'owner' &&
                        !canShareContact &&
                        contactInfo &&
                        Object.keys(contactInfo).length > 0 && (
                            <p className="text-sm text-green-600">
                                ✓ Vous avez déjà partagé vos coordonnées
                            </p>
                        )}
                </div>

                {/* SECTION MESSAGERIE - ⭐ NOUVEAU */}
                {auth.user &&
                    (loan.status === 'in_progress' ||
                        loan.status === 'completed') && (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <MessageBox
                                    loanId={loan.id}
                                    currentUserId={auth.user.id}
                                    initialMessages={loan.messages || []}
                                    otherUser={otherUser}
                                />
                            </div>
                        </div>
                    )}

                {/* Bouton retour */}
                <div className="text-center">
                    <Link
                        href={
                            userRole === 'borrower'
                                ? route('loans.borrows')
                                : route('loans.lends')
                        }
                        className="text-blue-600 hover:underline"
                    >
                        ← Retour à la liste{' '}
                        {userRole === 'borrower' ? 'des emprunts' : 'des prêts'}
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
