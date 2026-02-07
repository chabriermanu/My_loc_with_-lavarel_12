import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEventHandler, useState } from 'react';

interface Props {
    show: boolean;
}

export default function FirstLoginConsentModal({ show }: Props) {
    const { data, setData, post, processing } = useForm({
        terms: false,
        privacy_policy: false,
        data_processing: false,
        geolocation: false,
        marketing: false,
    });

    const [canSubmit, setCanSubmit] = useState(false);

    // Vérifier si tous les consentements obligatoires sont cochés
    const checkCanSubmit = (newData: typeof data) => {
        const allRequired =
            newData.terms &&
            newData.privacy_policy &&
            newData.data_processing &&
            newData.geolocation;
        setCanSubmit(allRequired);
    };

    const handleCheckboxChange = (field: keyof typeof data) => {
        const newData = { ...data, [field]: !data[field] };
        setData(newData);
        checkCanSubmit(newData);
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        const consentsToSend = Object.entries(data)
            .filter(([_, accepted]) => accepted)
            .map(([consent_type]) => ({ consent_type }));

        try {
            // Envoyer tous les consentements en parallèle
            await Promise.all(
                consentsToSend.map((consent) =>
                    axios.post('/consents', consent),
                ),
            );

            // Recharger la page après succès
            window.location.reload();
        } catch (error) {
            console.error(
                "Erreur lors de l'enregistrement des consentements",
                error,
            );
        }
    };
    return (
        <Dialog open={show}>
            <DialogContent
                className="max-w-2xl"
                onInteractOutside={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        🔒 Protection de vos données
                    </DialogTitle>
                </DialogHeader>

                <p className="mb-4 text-muted-foreground">
                    Avant d'utiliser MyLoc, nous avons besoin de votre
                    consentement concernant l'utilisation de vos données
                    personnelles.
                </p>

                <form onSubmit={submit} className="space-y-4">
                    {/* CGU - Obligatoire */}
                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id="terms"
                            checked={data.terms}
                            onCheckedChange={() =>
                                handleCheckboxChange('terms')
                            }
                        />
                        <Label
                            htmlFor="terms"
                            className="cursor-pointer leading-relaxed font-normal"
                        >
                            J'accepte les{' '}
                            <Link
                                href="/terms"
                                className="text-primary hover:underline"
                                target="_blank"
                            >
                                Conditions Générales d'Utilisation
                            </Link>{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                    </div>

                    {/* Politique de confidentialité - Obligatoire */}
                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id="privacy_policy"
                            checked={data.privacy_policy}
                            onCheckedChange={() =>
                                handleCheckboxChange('privacy_policy')
                            }
                        />
                        <Label
                            htmlFor="privacy_policy"
                            className="cursor-pointer leading-relaxed font-normal"
                        >
                            J'accepte la{' '}
                            <Link
                                href="/privacy-policy"
                                className="text-primary hover:underline"
                                target="_blank"
                            >
                                Politique de Confidentialité
                            </Link>{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                    </div>

                    {/* Traitement des données - Obligatoire */}
                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id="data_processing"
                            checked={data.data_processing}
                            onCheckedChange={() =>
                                handleCheckboxChange('data_processing')
                            }
                        />
                        <Label
                            htmlFor="data_processing"
                            className="cursor-pointer leading-relaxed font-normal"
                        >
                            J'autorise MyLoc à traiter mes données personnelles
                            pour le fonctionnement du service (prêts,
                            messagerie, avis){' '}
                            <span className="text-destructive">*</span>
                        </Label>
                    </div>

                    {/* Géolocalisation - Obligatoire */}
                    <div className="flex items-start space-x-3">
                        <Checkbox
                            id="geolocation"
                            checked={data.geolocation}
                            onCheckedChange={() =>
                                handleCheckboxChange('geolocation')
                            }
                        />
                        <Label
                            htmlFor="geolocation"
                            className="cursor-pointer leading-relaxed font-normal"
                        >
                            J'autorise l'utilisation de ma localisation (ville
                            et code postal) pour trouver des objets/services à
                            proximité{' '}
                            <span className="text-destructive">*</span>
                        </Label>
                    </div>

                    {/* Marketing - Optionnel */}
                    <div className="flex items-start space-x-3 border-t pt-4">
                        <Checkbox
                            id="marketing"
                            checked={data.marketing}
                            onCheckedChange={() =>
                                handleCheckboxChange('marketing')
                            }
                        />
                        <Label
                            htmlFor="marketing"
                            className="cursor-pointer leading-relaxed font-normal text-muted-foreground"
                        >
                            J'accepte de recevoir des communications marketing
                            par email (optionnel)
                        </Label>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <p className="text-sm text-muted-foreground">
                            <span className="text-destructive">*</span> Champs
                            obligatoires
                        </p>

                        <Button
                            type="submit"
                            disabled={!canSubmit || processing}
                            className="w-full"
                        >
                            {processing
                                ? 'Enregistrement...'
                                : 'Valider et accéder à MyLoc'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
