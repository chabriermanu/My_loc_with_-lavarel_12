export type * from './auth';
export type * from './page';
export type * from './model';
export type * from './navigation';
export type * from './ui';

import type { Auth, User } from './auth';
export interface BreadcrumbItem {
    title: string;
    href: string;
}
export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
};
