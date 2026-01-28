
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Boxes, Package, Component, Handshake, ArrowBigLeftDash, Grid3x3, Upload, Download, FolderOpen, ChevronRight } from 'lucide-react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
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
    myBorrowsCount 
}: DashboardProps) {

     const dashboardCards = [
        {
            title: 'Tous les items',
            icon: Package,
            href: '/items',
            description: `${totalItems} items disponibles`,
            color: 'text-blue-500',
        },
        {
            title: 'Catégories',
            icon: Grid3x3,
            href: '/categories',
            description: `${categoriesCount} catégories`,
            color: 'text-purple-500',
        },
        {
            title: 'Mes items',
            icon: FolderOpen,
            href: '/my-items',
            description: `${myItemsCount} items actifs`,
            color: 'text-green-500',
        },
        {
            title: 'Mes prêts',
            icon: Upload,
            href: '/loans/owner',
            description: `${myLoansCount} prêts actifs`,
            color: 'text-orange-500',
        },
        {
            title: 'Mes emprunts',
            icon: Download,
            href: '/loans/borrower',
            description: `${myBorrowsCount} emprunts actifs`,
            color: 'text-pink-500',
        },
    ];
    return (
        
            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="text-blue-600">
                    <Head title="Dashboard" />
                    <p className="font-semibold underline text-center text-3xl" style={{color: 'white', WebkitTextStroke: '5px #2563eb', paintOrder: 'stroke fill', textShadow: '0 4px 16px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.6)' }}>
                        Gérez vos items et prêts
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                     {/* Card 1 : Tous les items */}
                    <Link href="/items">  {/* ← Le lien vers la page */}
                        <Card className="bg-emerald-600/20 backdrop-blur-md border-white/20 hover:scale-105 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    {/* Logo */}
                                    <div className="bg-blue-500/20 p-4 rounded-xl">
                                        <Boxes className="h-8 w-8 text-white font-extra-bold" />
                                    </div>
                                    
                                    {/* Titre + Compteur */}
                                    <div className="flex-1 mx-4">
                                        <p className="text-white/70 text-sm" style={{color: 'white', WebkitTextStroke: '5px #2563eb', paintOrder: 'stroke fill', textShadow: '0 4px 16px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.6)' }}>Tous les items</p>
                                        <p className="text-white text-3xl font-bold ">{totalItems}</p>
                                    </div>
                                    
                                    {/* Flèche */}
                                     <ChevronRight  className="h-10 w-10 text-white drop-shadow-lg" strokeWidth={2.5}/>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/items">
                        <Card className="bg-emerald-600/20 backdrop-blur-md border-white/20 hover:scale-105 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    {/* Logo */}
                                    <div className="bg-blue-500/20 p-4 rounded-xl">
                                        <Component className="h-8 w-8 text-white font-extra-bold" />
                                    </div>
                                    
                                    {/* Titre + Compteur */}
                                    <div className="flex-1 mx-4">
                                        <p className="text-white/70 text-sm" style={{color: 'white', WebkitTextStroke: '5px #2563eb', paintOrder: 'stroke fill', textShadow: '0 4px 16px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.6)' }}>Mes items</p>
                                        <p className="text-white text-3xl font-bold">{totalItems}</p>
                                    </div>
                                    
                                    {/* Flèche */}
                                     <ChevronRight className="h-10 w-10 text-white drop-shadow-lg" strokeWidth={2.5}/> 
   
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/categories">
                        <Card className="bg-emerald-600/20 backdrop-blur-md border-white/20 hover:scale-105 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    {/* Logo */}
                                    <div className="bg-blue-500/20 p-4 rounded-xl">
                                        <Package className="h-8 w-8 text-white font-extra-bold" />
                                    </div>
                                    
                                    {/* Titre + Compteur */}
                                    <div className="flex-1 mx-4">
                                        <p className="text-white/70 text-sm"style={{color: 'white', WebkitTextStroke: '5px #2563eb', paintOrder: 'stroke fill', textShadow: '0 4px 16px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.6)' }}>Toute les items par catégories</p>
                                        <p className="text-white text-3xl font-bold">{totalItems}</p>
                                    </div>
                                    
                                    {/* Flèche */}
                                    <ChevronRight className="h-10 w-10 text-white drop-shadow-lg" strokeWidth={2.5}/>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto ">
                    <Link href="/loans">
                        <Card className="bg-emerald-600/20 backdrop-blur-md border-white/20 hover:scale-105 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    {/* Logo */}
                                    <div className="bg-blue-500/20 p-4 rounded-xl">
                                        <Handshake className="h-8 w-8 text-white font-extra-bold" />
                                    </div>
                                    
                                    {/* Titre + Compteur */}
                                    <div className="flex-1 mx-4">
                                        <p className="text-white/70 text-sm" style={{color: 'white', WebkitTextStroke: '5px #2563eb', paintOrder: 'stroke fill', textShadow: '0 4px 16px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.6)' }}>Mes prêts</p>
                                        <p className="text-white text-3xl font-bold">{totalItems}</p>
                                    </div>
                                    
                                    {/* Flèche */}
                                    <ChevronRight className="h-10 w-10 text-white drop-shadow-lg" strokeWidth={2.5}/> 
  
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/borrows">
                        <Card className="bg-emerald-600/20 backdrop-blur-md border-white/20 hover:scale-105 transition-all cursor-pointer">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    {/* Logo */}
                                    <div className="bg-blue-500/20 p-4 rounded-xl">
                                        <ArrowBigLeftDash className="h-8 w-8 text-white font-extra-bold"  />
                                    </div>
                                    
                                    {/* Titre + Compteur */}
                                    <div className="flex-1 mx-4">
                                        <p className="text-white/70 text-sm"style={{color: 'white', WebkitTextStroke: '5px #2563eb', paintOrder: 'stroke fill', textShadow: '0 4px 16px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.6)' }}>Mes emprunts</p>
                                        <p className="text-white text-3xl font-bold">{totalItems}</p>
                                    </div>
                                    
                                    {/* Flèche */}
                                     <ChevronRight className="h-10 w-10 text-white drop-shadow-lg"  strokeWidth={2.5}/>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
               
            </AppLayout>
        
    );
}
