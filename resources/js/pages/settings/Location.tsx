import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import axios from 'axios';
import { MapPin, Search, Trash } from 'lucide-react';
import { useState } from 'react';
import { route } from 'ziggy-js';

interface LocationProps extends PageProps {
    user: {
        postal_code: string | null;
        city: string | null;
        latitude: number | null;
        longitude: number | null;
    };
}

interface Commune {
    nom: string;
    code: string;
    population: number;
}

export default function Location({ auth, user }: LocationProps) {
    const [searchingCommunes, setSearchingCommunes] = useState(false);
    const [communes, setCommunes] = useState<Commune[]>([]);
    const [selectedCommuneCode, setSelectedCommuneCode] = useState<string>('');
    const [searchError, setSearchError] = useState<string>('');

    const { data, setData, post, processing, errors } = useForm({
        postal_code: user.postal_code || '',
        commune_code: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Paramètres', href: route('dashboard') },
        { title: 'Ma localisation', href: route('location.edit') },
    ];

    // Rechercher les communes du code postal
    const handleSearchCommunes = async () => {
        if (!data.postal_code || data.postal_code.length !== 5) {
            setSearchError(
                'Veuillez entrer un code postal valide (5 chiffres)',
            );
            return;
        }

        setSearchingCommunes(true);
        setSearchError('');
        setCommunes([]);
        setSelectedCommuneCode('');

        try {
            const response = await axios.post(
                route('location.search-communes'),
                {
                    postal_code: data.postal_code,
                },
            );

            setCommunes(response.data.communes);

            // Si une seule commune, la sélectionner automatiquement
            if (response.data.communes.length === 1) {
                setSelectedCommuneCode(response.data.communes[0].code);
                setData('commune_code', response.data.communes[0].code);
            }
        } catch (error: any) {
            if (error.response?.data?.error) {
                setSearchError(error.response.data.error);
            } else {
                setSearchError('Une erreur est survenue lors de la recherche.');
            }
        } finally {
            setSearchingCommunes(false);
        }
    };

    const handleSelectCommune = (communeCode: string) => {
        setSelectedCommuneCode(communeCode);
        setData('commune_code', communeCode);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.commune_code) {
            setSearchError('Veuillez sélectionner votre commune');
            return;
        }

        post(route('location.update'));
    };

    const handleDelete = () => {
        if (
            confirm('Êtes-vous sûr de vouloir supprimer votre localisation ?')
        ) {
            router.delete(route('location.destroy'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ma localisation" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="mb-6 flex items-center gap-3">
                                <MapPin className="h-8 w-8 text-blue-600" />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Ma localisation
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Configurez votre localisation pour
                                        trouver des items près de chez vous
                                    </p>
                                </div>
                            </div>

                            {/* Localisation actuelle */}
                            {user.city && user.latitude && (
                                <div className="mb-6 rounded-lg bg-blue-50 p-4">
                                    <h3 className="mb-2 font-semibold text-blue-900">
                                        📍 Localisation actuelle
                                    </h3>
                                    <div className="space-y-1 text-sm text-blue-800">
                                        <p>
                                            <strong>Ville :</strong> {user.city}
                                        </p>
                                        <p>
                                            <strong>Code postal :</strong>{' '}
                                            {user.postal_code}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Étape 1 : Code postal */}
                            <div className="mb-6 space-y-4">
                                <div>
                                    <Label htmlFor="postal_code">
                                        Étape 1 : Code postal *
                                    </Label>
                                    <div className="mt-1 flex gap-2">
                                        <Input
                                            id="postal_code"
                                            type="text"
                                            value={data.postal_code}
                                            onChange={(e) => {
                                                setData(
                                                    'postal_code',
                                                    e.target.value,
                                                );
                                                setCommunes([]);
                                                setSelectedCommuneCode('');
                                            }}
                                            placeholder="34480"
                                            maxLength={5}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleSearchCommunes}
                                            disabled={searchingCommunes}
                                        >
                                            <Search className="mr-2 h-4 w-4" />
                                            {searchingCommunes
                                                ? 'Recherche...'
                                                : 'Rechercher'}
                                        </Button>
                                    </div>
                                    {errors.postal_code && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.postal_code}
                                        </p>
                                    )}
                                    {searchError && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {searchError}
                                        </p>
                                    )}
                                </div>

                                {/* Étape 2 : Sélection de la commune */}
                                {communes.length > 0 && (
                                    <div>
                                        <Label>
                                            Étape 2 : Sélectionnez votre commune
                                            *
                                        </Label>
                                        <div className="mt-2 space-y-2">
                                            {communes.map((commune) => (
                                                <button
                                                    key={commune.code}
                                                    type="button"
                                                    onClick={() =>
                                                        handleSelectCommune(
                                                            commune.code,
                                                        )
                                                    }
                                                    className={`w-full rounded-lg border-2 p-4 text-left transition ${
                                                        selectedCommuneCode ===
                                                        commune.code
                                                            ? 'border-blue-600 bg-blue-50'
                                                            : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {commune.nom}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                {commune.population.toLocaleString()}{' '}
                                                                habitants
                                                            </p>
                                                        </div>
                                                        {selectedCommuneCode ===
                                                            commune.code && (
                                                            <div className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
                                                                ✓ Sélectionné
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.commune_code && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.commune_code}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Boutons d'action */}
                            <form onSubmit={handleSubmit}>
                                <div className="flex items-center justify-between gap-4">
                                    <Button
                                        type="submit"
                                        disabled={
                                            processing || !selectedCommuneCode
                                        }
                                        className="flex-1"
                                    >
                                        Enregistrer
                                    </Button>

                                    {user.postal_code && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={handleDelete}
                                            disabled={processing}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </form>

                            {/* Info */}
                            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <h3 className="mb-2 font-semibold text-gray-900">
                                    ℹ️ Comment ça marche ?
                                </h3>
                                <ul className="space-y-1 text-sm text-gray-600">
                                    <li>1. Entrez votre code postal</li>
                                    <li>
                                        2. Sélectionnez votre ville/village dans
                                        la liste
                                    </li>
                                    <li>
                                        3. Les items proches s'afficheront avec
                                        leur distance
                                    </li>
                                    <li>
                                        4. Filtrez par rayon : 5km, 10km, 20km
                                        ou plus
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
