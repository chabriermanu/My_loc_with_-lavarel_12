export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth, User } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};
// Type pour les props de page avec Inertia
export type PageProps = {
    auth: {
        user: User | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
};
