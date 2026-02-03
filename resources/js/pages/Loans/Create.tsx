import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Item } from '@/types/model';
import { Head, useForm } from '@inertiajs/react';
import { Calendar, Clock, FileText, User } from 'lucide-react';

declare function route(name: string, params?: any): string;

interface CreateProps {
    item: Item;
}

export default function Create({ item }: CreateProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Articles', href: route('items.index') },
        { title: item.name, href: route('items.show', item.id) },
        { title: 'Demande de prêt', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        item_id: item.id,
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('loans.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Demander - ${item.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* En-tête */}
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Demande de prêt
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Remplissez le formulaire pour demander à
                                    emprunter cet article
                                </p>
                            </div>

                            {/* Récapitulatif de l'article */}
                            <div className="mb-6 rounded-lg border bg-gray-50 p-4">
                                <div className="flex items-start gap-4">
                                    {item.picture && (
                                        <img
                                            src={`/storage/${item.picture}`}
                                            alt={item.name}
                                            className="h-24 w-24 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {item.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {item.description}
                                        </p>
                                        {item.owner && (
                                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                                <User className="h-4 w-4" />
                                                <span>
                                                    Proposé par{' '}
                                                    {item.owner.pseudo}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Formulaire */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Dates */}
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {/* Date de début */}
                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Calendar className="h-4 w-4" />
                                            Date de début *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) =>
                                                setData(
                                                    'start_date',
                                                    e.target.value,
                                                )
                                            }
                                            min={
                                                new Date()
                                                    .toISOString()
                                                    .split('T')[0]
                                            }
                                            required
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                        {errors.start_date && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.start_date}
                                            </p>
                                        )}
                                    </div>

                                    {/* Heure de début */}
                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Clock className="h-4 w-4" />
                                            Heure de début
                                        </label>
                                        <input
                                            type="time"
                                            value={data.start_time}
                                            onChange={(e) =>
                                                setData(
                                                    'start_time',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                        {errors.start_time && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.start_time}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date de fin */}
                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Calendar className="h-4 w-4" />
                                            Date de fin *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) =>
                                                setData(
                                                    'end_date',
                                                    e.target.value,
                                                )
                                            }
                                            min={
                                                data.start_date ||
                                                new Date()
                                                    .toISOString()
                                                    .split('T')[0]
                                            }
                                            required
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                        {errors.end_date && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.end_date}
                                            </p>
                                        )}
                                    </div>

                                    {/* Heure de fin */}
                                    <div>
                                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <Clock className="h-4 w-4" />
                                            Heure de fin
                                        </label>
                                        <input
                                            type="time"
                                            value={data.end_time}
                                            onChange={(e) =>
                                                setData(
                                                    'end_time',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        />
                                        {errors.end_time && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.end_time}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <FileText className="h-4 w-4" />
                                        Message (optionnel)
                                    </label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) =>
                                            setData('notes', e.target.value)
                                        }
                                        rows={4}
                                        placeholder="Précisez l'usage prévu, des détails sur la récupération, etc."
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    {errors.notes && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.notes}
                                        </p>
                                    )}
                                </div>

                                {/* Boutons */}
                                <div className="flex items-center justify-end gap-3 border-t pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        {processing
                                            ? 'Envoi...'
                                            : 'Envoyer la demande'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
