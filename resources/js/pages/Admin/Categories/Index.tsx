import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    items_count: number;
    created_at: string;
}

interface Props extends PageProps {
    categories: {
        data: Category[];
    };
}

export default function Index({ categories }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
            router.delete(route('admin.categories.destroy', id));
        }
    };
    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Admin', href: route('admin.categories.index') },
        { title: 'Catégories', href: route('admin.categories.index') },
        { title: 'Créer' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Gestion des Catégories
                    </h2>
                    <Link href={route('admin.categories.create')}>
                        <Button>Créer une catégorie</Button>
                    </Link>
                </div>
            }
            <Head title="Admin - Catégories" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                        Nom
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-center text-sm font-medium text-gray-700">
                                        Nombre d'items
                                    </th>
                                    <th className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {categories.data.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {category.description || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            {category.items_count}
                                        </td>
                                        <td className="space-x-2 px-6 py-4 text-right">
                                            <Link
                                                href={route(
                                                    'admin.categories.edit',
                                                    category.id,
                                                )}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Pencil className="mr-1 h-4 w-4" />
                                                    Modifier
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(category.id)
                                                }
                                                disabled={
                                                    category.items_count > 0
                                                }
                                            >
                                                <Trash2 className="mr-1 h-4 w-4" />
                                                Supprimer
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {categories.data.length === 0 && (
                            <div className="py-12 text-center text-gray-500">
                                Aucune catégorie trouvée
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
