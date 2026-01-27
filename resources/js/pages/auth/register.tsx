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
                                <Label htmlFor="name">Pseudo</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    name="name"
                                    placeholder="Choisissez un pseudo"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* PRÉNOM */}
                            <div className="grid gap-2">
                                <Label htmlFor="first_name">Prénom</Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    required
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
                                    required
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

                            {/* EMAIL */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Adresse email</Label>
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

                            {/* MOT DE PASSE */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Mot de passe"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* CONFIRMATION MOT DE PASSE */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmer le mot de passe
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirmer le mot de passe"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full"
                                tabIndex={7}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Créer mon compte
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            Vous avez déjà un compte ?{' '}
                            <TextLink href={login()} tabIndex={8}>
                                Se connecter
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
