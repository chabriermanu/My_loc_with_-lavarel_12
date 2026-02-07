import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Terms() {
    return (
        <AppLayout>
            <Head title="Conditions Générales d'Utilisation" />

            <div className="mx-auto max-w-4xl">
                <div className="rounded-lg bg-white p-8 shadow-md">
                    <h1 className="mb-6 text-3xl font-bold text-gray-900">
                        Conditions Générales d'Utilisation
                    </h1>

                    <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                1. Objet
                            </h2>
                            <p>
                                MyLoc est une plateforme de partage et de
                                location d'objets et de services entre
                                particuliers. Les présentes Conditions Générales
                                d'Utilisation (CGU) ont pour objet de définir
                                les modalités et conditions d'utilisation de la
                                plateforme MyLoc.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                2. Inscription et compte utilisateur
                            </h2>
                            <p>
                                L'utilisation de MyLoc nécessite la création
                                d'un compte utilisateur. Vous vous engagez à
                                fournir des informations exactes et à jour lors
                                de votre inscription.
                            </p>
                            <ul className="list-disc pl-6">
                                <li>
                                    Vous êtes responsable de la confidentialité
                                    de vos identifiants
                                </li>
                                <li>
                                    Vous devez avoir au moins 18 ans pour
                                    utiliser la plateforme
                                </li>
                                <li>
                                    Un seul compte par personne est autorisé
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                3. Utilisation de la plateforme
                            </h2>
                            <p>Vous vous engagez à :</p>
                            <ul className="list-disc pl-6">
                                <li>
                                    Utiliser la plateforme de manière légale et
                                    respectueuse
                                </li>
                                <li>
                                    Ne pas publier de contenu illégal, offensant
                                    ou trompeur
                                </li>
                                <li>
                                    Respecter les droits de propriété
                                    intellectuelle
                                </li>
                                <li>
                                    Ne pas tenter de contourner les mesures de
                                    sécurité
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                4. Prêts et locations
                            </h2>
                            <p>
                                MyLoc est un intermédiaire qui met en relation
                                prêteurs et emprunteurs. La plateforme n'est pas
                                responsable des transactions entre utilisateurs.
                            </p>
                            <ul className="list-disc pl-6">
                                <li>
                                    Les conditions de prêt sont définies entre
                                    les parties
                                </li>
                                <li>
                                    Vous êtes responsable de l'état des objets
                                    prêtés ou empruntés
                                </li>
                                <li>
                                    En cas de litige, nous vous encourageons à
                                    trouver un arrangement à l'amiable
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                5. Responsabilité
                            </h2>
                            <p>
                                MyLoc décline toute responsabilité concernant :
                            </p>
                            <ul className="list-disc pl-6">
                                <li>
                                    Les dommages causés aux objets prêtés ou
                                    empruntés
                                </li>
                                <li>Les litiges entre utilisateurs</li>
                                <li>
                                    L'exactitude des informations fournies par
                                    les utilisateurs
                                </li>
                                <li>Les pertes financières</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                6. Modification des CGU
                            </h2>
                            <p>
                                MyLoc se réserve le droit de modifier les
                                présentes CGU à tout moment. Les utilisateurs
                                seront informés des modifications par email ou
                                notification sur la plateforme.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                7. Contact
                            </h2>
                            <p>
                                Pour toute question concernant les CGU, vous
                                pouvez nous contacter à l'adresse :
                                contact@myloc.fr
                            </p>
                        </section>

                        <p className="mt-8 text-sm text-gray-500">
                            Dernière mise à jour :{' '}
                            {new Date().toLocaleDateString('fr-FR')}
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
