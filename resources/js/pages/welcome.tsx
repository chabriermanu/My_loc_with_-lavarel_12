import { Head, Link, usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import { dashboard, login, register } from '@/routes';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFDFC] p-6 text-[#1b1b18] dark:bg-[#0a0a0a]">
                <div className="w-full max-w-[335px] lg:max-w-4xl text-center">
                    <h1 className="text-3xl font-bold mb-4">Bienvenue sur MyLoc</h1>

                    <p className="text-[#706f6c] dark:text-[#A1A09A] mb-6">
                        Louez, partagez et découvrez des objets près de chez vous.
                    </p>

                    <div className="flex justify-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                            >
                                Accéder au dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded border border-gray-300 px-5 py-2 hover:bg-gray-100 dark:border-[#3E3E3A]"
                                >
                                    Connexion
                                </Link>

                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                                    >
                                        Inscription
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
