import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function PrivacyPolicy() {
    return (
        <AppLayout>
            <Head title="Politique de Confidentialité" />

            <div className="mx-auto max-w-4xl">
                <div className="rounded-lg bg-white p-8 shadow-md">
                    <h1 className="mb-6 text-3xl font-bold text-gray-900">
                        Politique de Confidentialité
                    </h1>

                    <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                1. Collecte des données
                            </h2>
                            <p>
                                MyLoc collecte les données personnelles
                                suivantes :
                            </p>
                            <ul className="list-disc pl-6">
                                <li>Nom, prénom et pseudo</li>
                                <li>Adresse email</li>
                                <li>Numéro de téléphone</li>
                                <li>Adresse postale (ville et code postal)</li>
                                <li>Photo de profil (optionnelle)</li>
                                <li>Données de géolocalisation</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                2. Utilisation des données
                            </h2>
                            <p>
                                Vos données personnelles sont utilisées pour :
                            </p>
                            <ul className="list-disc pl-6">
                                <li>Créer et gérer votre compte utilisateur</li>
                                <li>
                                    Faciliter les transactions de prêt entre
                                    utilisateurs
                                </li>
                                <li>
                                    Vous mettre en relation avec d'autres
                                    utilisateurs proches géographiquement
                                </li>
                                <li>
                                    Envoyer des notifications concernant vos
                                    prêts et emprunts
                                </li>
                                <li>
                                    Améliorer nos services et votre expérience
                                    utilisateur
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                3. Partage des données
                            </h2>
                            <p>
                                Vos coordonnées (téléphone, adresse) ne sont
                                partagées avec d'autres utilisateurs que :
                            </p>
                            <ul className="list-disc pl-6">
                                <li>
                                    Avec votre consentement explicite lors d'une
                                    demande de prêt
                                </li>
                                <li>
                                    Uniquement avec la personne concernée par le
                                    prêt
                                </li>
                                <li>
                                    Pour la durée nécessaire à la transaction
                                </li>
                            </ul>
                            <p>
                                MyLoc ne vend jamais vos données personnelles à
                                des tiers.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                4. Vos droits (RGPD)
                            </h2>
                            <p>
                                Conformément au Règlement Général sur la
                                Protection des Données (RGPD), vous disposez des
                                droits suivants :
                            </p>
                            <ul className="list-disc pl-6">
                                <li>
                                    <strong>Droit d'accès :</strong> Vous pouvez
                                    consulter vos données personnelles
                                </li>
                                <li>
                                    <strong>Droit de rectification :</strong>{' '}
                                    Vous pouvez modifier vos données inexactes
                                </li>
                                <li>
                                    <strong>Droit à l'effacement :</strong> Vous
                                    pouvez demander la suppression de vos
                                    données
                                </li>
                                <li>
                                    <strong>Droit à la portabilité :</strong>{' '}
                                    Vous pouvez récupérer vos données
                                </li>
                                <li>
                                    <strong>Droit d'opposition :</strong> Vous
                                    pouvez vous opposer au traitement de vos
                                    données
                                </li>
                                <li>
                                    <strong>
                                        Droit de retrait du consentement :
                                    </strong>{' '}
                                    Vous pouvez révoquer vos consentements à
                                    tout moment
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                5. Sécurité des données
                            </h2>
                            <p>
                                Nous mettons en œuvre des mesures techniques et
                                organisationnelles pour protéger vos données
                                personnelles :
                            </p>
                            <ul className="list-disc pl-6">
                                <li>Chiffrement des données sensibles</li>
                                <li>Accès restreint aux données</li>
                                <li>Sauvegardes régulières</li>
                                <li>Surveillance des accès</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                6. Conservation des données
                            </h2>
                            <p>
                                Vos données personnelles sont conservées tant
                                que votre compte est actif. Après suppression de
                                votre compte, vos données sont effacées sous 30
                                jours, sauf obligation légale de conservation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                7. Cookies
                            </h2>
                            <p>
                                MyLoc utilise des cookies strictement
                                nécessaires au fonctionnement de la plateforme
                                (authentification, préférences). Aucun cookie de
                                tracking publicitaire n'est utilisé.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                8. Contact
                            </h2>
                            <p>
                                Pour exercer vos droits ou pour toute question
                                concernant la protection de vos données :
                            </p>
                            <p className="font-semibold">
                                Email : dpo@myloc.fr
                                <br />
                                Courrier : MyLoc - DPO, [Adresse]
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
