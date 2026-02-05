import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

export default function Register() {
    return (
        <AuthLayout
            title="Créer un compte"
            description="Remplissez les informations ci-dessous pour créer votre compte"
        >
            <Head title="Inscription" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            {/* PSEUDO */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Pseudo *</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    name="name"
                                    placeholder="Choisissez un pseudo unique"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* PRÉNOM ET NOM SUR LA MÊME LIGNE */}
                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* PRÉNOM */}
                                <div className="grid gap-2">
                                    <Label htmlFor="first_name">Prénom</Label>
                                    <Input
                                        id="first_name"
                                        type="text"
                                        tabIndex={2}
                                        autoComplete="given-name"
                                        name="first_name"
                                        placeholder="Votre prénom"
                                    />
                                    <InputError
                                        message={errors.first_name}
                                        className="mt-2"
                                    />
                                </div>

                                {/* NOM */}
                                <div className="grid gap-2">
                                    <Label htmlFor="last_name">Nom</Label>
                                    <Input
                                        id="last_name"
                                        type="text"
                                        tabIndex={3}
                                        autoComplete="family-name"
                                        name="last_name"
                                        placeholder="Votre nom"
                                    />
                                    <InputError
                                        message={errors.last_name}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* EMAIL */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Adresse email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={4}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@exemple.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* TÉLÉPHONE (OPTIONNEL) */}
                            <div className="grid gap-2">
                                <Label htmlFor="phone">
                                    Téléphone{' '}
                                    <span className="text-sm text-gray-500">
                                        (optionnel)
                                    </span>
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    tabIndex={5}
                                    autoComplete="tel"
                                    name="phone"
                                    placeholder="+33 6 12 34 56 78"
                                />
                                <p className="text-xs text-gray-500">
                                    Utile pour les demandes de prêt
                                </p>
                                <InputError message={errors.phone} />
                            </div>
                            {/* SECTION LOCALISATION */}
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                    📍 Localisation (optionnel mais recommandé)
                                </h3>
                                <p className="mb-4 text-xs text-gray-500">
                                    Permet aux utilisateurs de trouver des
                                    objets près de chez eux. Seule votre ville
                                    sera visible publiquement.
                                </p>

                                {/* CODE POSTAL ET VILLE */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="postal_code">
                                            Code postal
                                        </Label>
                                        <Input
                                            id="postal_code"
                                            type="text"
                                            tabIndex={6}
                                            autoComplete="postal-code"
                                            name="postal_code"
                                            placeholder="75001"
                                            maxLength={5}
                                        />
                                        <InputError
                                            message={errors.postal_code}
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="city">Ville</Label>
                                        <Input
                                            id="city"
                                            type="text"
                                            tabIndex={7}
                                            autoComplete="address-level2"
                                            name="city"
                                            placeholder="Paris"
                                        />
                                        <InputError message={errors.city} />
                                    </div>
                                </div>

                                {/* ADRESSE COMPLÈTE (OPTIONNELLE) */}
                                <div className="mt-4 grid gap-2">
                                    <Label htmlFor="street_address">
                                        Adresse complète{' '}
                                        <span className="text-sm text-gray-500">
                                            (privée - pour les échanges)
                                        </span>
                                    </Label>
                                    <Input
                                        id="street_address"
                                        type="text"
                                        tabIndex={8}
                                        autoComplete="street-address"
                                        name="street_address"
                                        placeholder="12 rue de la Paix"
                                    />
                                    <InputError
                                        message={errors.street_address}
                                    />
                                </div>
                            </div>
                            {/* MOT DE PASSE */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mot de passe *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Minimum 8 caractères"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* CONFIRMATION MOT DE PASSE */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmer le mot de passe *
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={7}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Retapez votre mot de passe"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={8}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Créer mon compte
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Vous avez déjà un compte ?{' '}
                            <TextLink href={login()} tabIndex={9}>
                                Se connecter
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}