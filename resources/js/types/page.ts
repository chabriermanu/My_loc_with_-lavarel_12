// types/page.ts

import type { User } from './auth';

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
