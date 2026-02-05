import { LoanCard } from '@/components/Loans/LoanCard';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Loan } from '@/types/model';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
} from 'lucide-react';
import { FormEventHandler, useState } from 'react';

declare function route(name: string, params?: any): string;

interface LoanShowProps {
    loan: Loan;
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
    loan,
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
        { title: 'Prêts', href: route('loans.index') },
        { title: `Prêt #${loan.id}`, href: route('loans.show', loan.id) },
    ];

    // État pour afficher/masquer le formulaire de partage
    const [showShareForm, setShowShareForm] = useState(false);

    // Formulaire de partage de coordonnées
    const shareForm = useForm({
        share_email: false,
        share_phone: false,
        share_address: false,
    });

    // Formulaire d'envoi de message
    const messageForm = useForm({
        content: '',
    });

    // Demander les coordonnées (emprunteur)
    const handleRequestContact = () => {
        router.post(
            route('loans.request-contact', loan.id),
            {},
            {
                preserveScroll: true,
            },
        );
    };

    // Partager les coordonnées (propriétaire)
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

    // Envoyer un message
    const handleSendMessage: FormEventHandler = (e) => {
        e.preventDefault();
        messageForm.post(route('loans.send-message', loan.id), {
            preserveScroll: true,
            onSuccess: () => {
                messageForm.reset();
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

                    {/* ⚠️ PROPRIÉTAIRE : Coordonnées de l'emprunteur si retard */}
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

                {/* Messages */}
                <div className="space-y-4 rounded-lg bg-white p-6 shadow">
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                        <MessageCircle className="h-5 w-5 text-blue-600" />
                        Messages
                    </h2>

                    {/* Liste des messages */}
                    {loan.messages?.length ? (
                        <div className="max-h-96 space-y-3 overflow-y-auto">
                            {loan.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`rounded-md p-3 text-sm ${
                                        msg.sender_id === loan.borrower_id
                                            ? 'bg-blue-100'
                                            : 'bg-gray-100'
                                    }`}
                                >
                                    <p className="font-semibold text-gray-700">
                                        {msg.sender?.name ?? 'Utilisateur'}
                                    </p>
                                    <p className="text-gray-600">
                                        {msg.content}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {new Date(
                                            msg.created_at,
                                        ).toLocaleDateString('fr-FR', {
                                            day: 'numeric',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            Aucun message pour le moment.
                        </p>
                    )}

                    {/* Formulaire d'envoi de message */}
                    <form
                        onSubmit={handleSendMessage}
                        className="mt-4 flex gap-2"
                    >
                        <input
                            type="text"
                            value={messageForm.data.content}
                            onChange={(e) =>
                                messageForm.setData('content', e.target.value)
                            }
                            placeholder="Écrivez votre message..."
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                            maxLength={2000}
                        />
                        <button
                            type="submit"
                            disabled={
                                messageForm.processing ||
                                !messageForm.data.content.trim()
                            }
                            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Send className="h-4 w-4" />
                            Envoyer
                        </button>
                    </form>

                    {messageForm.errors.content && (
                        <p className="text-sm text-red-600">
                            {messageForm.errors.content}
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
