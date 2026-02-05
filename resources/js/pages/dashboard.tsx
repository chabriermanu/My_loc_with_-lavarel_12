import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowBigLeftDash,
    Boxes,
    ChevronRight,
    Grid3x3,
    Handshake,
    Package,
} from 'lucide-react';

declare function route(name: string, params?: any): string;

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: 'dashboard', // ✔ nom de route
    },
];

interface DashboardProps {
    totalItems: number;
    categoriesCount: number;
    myItemsCount: number;
    myLoansCount: number;
    myBorrowsCount: number;
}

export default function Dashboard({
    totalItems,
    categoriesCount,
    myItemsCount,
    myLoansCount,
    myBorrowsCount,
}: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="space-y-8 p-6">
                {/* En-tête */}
                <p
                    className="text-center text-3xl font-semibold underline"
                    style={{
                        color: 'white',
                        WebkitTextStroke: '1.5px #2563eb',
                        paintOrder: 'stroke fill',
                        textShadow:
                            '0 4px 16px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.6)',
                    }}
                >
                    Gérez vos items et prêts
                </p>

                {/* Première ligne : 3 cards */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1 : Tous les items */}
                    <Link href="/items">
                        <Card className="cursor-pointer border-white/20 bg-blue-600/20 backdrop-blur-md transition-all hover:scale-105">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-blue-500/20 p-4">
                                        <Boxes
                                            className="h-8 w-8 text-blue-400"
                                            strokeWidth={2}
                                        />
                                    </div>

                                    <div className="mx-4 flex-1">
                                        <p className="text-sm text-white/80">
                                            Tous les items
                                        </p>
                                        <p className="text-3xl font-bold text-white drop-shadow-2xl">
                                            {totalItems}
                                        </p>
                                    </div>

                                    <ChevronRight
                                        className="h-10 w-10 text-white/70 drop-shadow-lg"
                                        strokeWidth={2.5}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Card 2 : Mes items */}
                    <Link href="/my-items">
                        <Card className="cursor-pointer border-white/20 bg-green-600/20 backdrop-blur-md transition-all hover:scale-105">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-green-500/20 p-4">
                                        <Package
                                            className="h-8 w-8 text-green-400"
                                            strokeWidth={2}
                                        />
                                    </div>

                                    <div className="mx-4 flex-1">
                                        <p className="text-sm text-white/80">
                                            Mes items
                                        </p>
                                        <p className="text-3xl font-bold text-white drop-shadow-2xl">
                                            {myItemsCount}
                                        </p>
                                    </div>

                                    <ChevronRight
                                        className="h-10 w-10 text-white/70 drop-shadow-lg"
                                        strokeWidth={2.5}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Card 3 : Catégories */}
                    <Link href="/categories">
                        <Card className="cursor-pointer border-white/20 bg-purple-600/20 backdrop-blur-md transition-all hover:scale-105">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-purple-500/20 p-4">
                                        <Grid3x3
                                            className="h-8 w-8 text-purple-400"
                                            strokeWidth={2}
                                        />
                                    </div>

                                    <div className="mx-4 flex-1">
                                        <p className="text-sm text-white/80">
                                            Catégories
                                        </p>
                                        <p className="text-3xl font-bold text-white drop-shadow-2xl">
                                            {categoriesCount}
                                        </p>
                                    </div>

                                    <ChevronRight
                                        className="h-10 w-10 text-white/70 drop-shadow-lg"
                                        strokeWidth={2.5}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Deuxième ligne : 2 cards */}
                <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Card 4 : Mes prêts */}
                    <Link href={route('loans.lends')}>
                        <Card className="cursor-pointer border-white/20 bg-orange-600/20 backdrop-blur-md transition-all hover:scale-105">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-orange-500/20 p-4">
                                        <Handshake
                                            className="h-8 w-8 text-orange-400"
                                            strokeWidth={2}
                                        />
                                    </div>

                                    <div className="mx-4 flex-1">
                                        <p className="text-sm text-white/80">
                                            Mes prêts
                                        </p>
                                        <p className="text-3xl font-bold text-white drop-shadow-2xl">
                                            {myLoansCount}
                                        </p>
                                    </div>

                                    <ChevronRight
                                        className="h-10 w-10 text-white/70 drop-shadow-lg"
                                        strokeWidth={2.5}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Card 5 : Mes emprunts */}
                    <Link href={route('loans.borrows')}>
                        <Card className="cursor-pointer border-white/20 bg-pink-600/20 backdrop-blur-md transition-all hover:scale-105">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-pink-500/20 p-4">
                                        <ArrowBigLeftDash
                                            className="h-8 w-8 text-pink-400"
                                            strokeWidth={2}
                                        />
                                    </div>

                                    <div className="mx-4 flex-1">
                                        <p className="text-sm text-white/80">
                                            Mes emprunts
                                        </p>
                                        <p className="text-3xl font-bold text-white drop-shadow-2xl">
                                            {myBorrowsCount}
                                        </p>
                                    </div>

                                    <ChevronRight
                                        className="h-10 w-10 text-white/70 drop-shadow-lg"
                                        strokeWidth={2.5}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
