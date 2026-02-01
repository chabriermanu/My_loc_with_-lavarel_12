import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, EditProps, PostFormData } from '@/types';

import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';

declare function route(name: string, params?: any): string;

export default function Edit({
    item,
    categories,
    conditions,
    mediaTypes,
}: EditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Mes Items',
            href: route('items.my'),
        },
        {
            title: "Modifier l'item",
            href: route('items.edit', item.id),
        },
    ];

    // ⚠️ Pré-remplir avec les valeurs de l'item
    const { data, setData, put, processing, errors } = useForm<PostFormData>({
        name: item.name || '',
        description: item.description || '',
        type: (item.type as 'object' | 'service') || 'object', // ← AJOUTÉ
        category_id: item.category_id?.toString() || '',
        condition: item.condition || '',
        media_type: item.media_type || '',
        value: String(item.value || ''),
        picture: null as File | null,
        video: null as File | null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(
        item.picture ? `/storage/${item.picture}` : null,
    );
    const [videoPreview, setVideoPreview] = useState<string | null>(
        item.video ? `/storage/${item.video}` : null,
    );

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('picture', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('video', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('items.update', item.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Modifier l'item" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="mb-6 text-2xl font-semibold">
                                Modifier l'item : {item.name}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Type - NOUVEAU */}
                                <div className="space-y-2">
                                    <Label>Type *</Label>
                                    <div className="flex gap-6">
                                        <label className="flex cursor-pointer items-center space-x-2">
                                            <input
                                                type="radio"
                                                value="object"
                                                checked={data.type === 'object'}
                                                onChange={() =>
                                                    setData('type', 'object')
                                                }
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                📦 Objet à louer
                                            </span>
                                        </label>
                                        <label className="flex cursor-pointer items-center space-x-2">
                                            <input
                                                type="radio"
                                                value="service"
                                                checked={
                                                    data.type === 'service'
                                                }
                                                onChange={() =>
                                                    setData('type', 'service')
                                                }
                                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                📋 Service à proposer
                                            </span>
                                        </label>
                                    </div>
                                    {errors.type && (
                                        <p className="text-sm text-red-500">
                                            {errors.type}
                                        </p>
                                    )}
                                </div>

                                {/* Titre */}
                                <div className="space-y-2">
                                    <Label htmlFor="titre">Titre *</Label>
                                    <Input
                                        id="titre"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="block overflow-hidden border bg-white px-3 py-2 text-sm shadow-sm sm:rounded-lg"
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description *
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                'description',
                                                e.target.value,
                                            )
                                        }
                                        className="overflow-hidden bg-white shadow-sm sm:rounded-lg"
                                        required
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Catégorie */}
                                <div className="space-y-2">
                                    <Label htmlFor="category">
                                        Catégorie *
                                    </Label>
                                    <select
                                        id="category"
                                        value={data.category_id}
                                        onChange={(e) =>
                                            setData(
                                                'category_id',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                                        required
                                    >
                                        <option value="">
                                            -- Sélectionnez une catégorie --
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.icon} {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="text-sm text-red-500">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                {/* Valeur - Label dynamique */}
                                <div className="space-y-2">
                                    <Label htmlFor="value">
                                        {data.type === 'service'
                                            ? 'Prix de la prestation (€)'
                                            : 'Prix par jour (€)'}
                                    </Label>
                                    <Input
                                        type="number"
                                        id="value"
                                        value={data.value}
                                        onChange={(e) =>
                                            setData('value', e.target.value)
                                        }
                                        min="0"
                                        step="0.01"
                                        className="block overflow-hidden border bg-white px-3 py-2 text-sm shadow-sm sm:rounded-lg"
                                    />
                                    {errors.value && (
                                        <p className="text-sm text-red-500">
                                            {errors.value}
                                        </p>
                                    )}
                                </div>

                                {/* Condition - Uniquement pour les objets */}
                                {data.type === 'object' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="condition">État</Label>
                                        <select
                                            id="condition"
                                            value={data.condition}
                                            onChange={(e) =>
                                                setData(
                                                    'condition',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                                        >
                                            <option value="">
                                                -- Sélectionnez un état --
                                            </option>
                                            {conditions.map((condition) => (
                                                <option
                                                    key={condition}
                                                    value={condition}
                                                >
                                                    {condition === 'new' &&
                                                        'Neuf'}
                                                    {condition === 'like_new' &&
                                                        'Comme neuf'}
                                                    {condition === 'good' &&
                                                        'Bon état'}
                                                    {condition === 'fair' &&
                                                        'État correct'}
                                                    {condition === 'poor' &&
                                                        'Mauvais état'}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.condition && (
                                            <p className="text-sm text-red-500">
                                                {errors.condition}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Type de média */}
                                <div className="space-y-2">
                                    <Label htmlFor="media_type">
                                        Type de média
                                    </Label>
                                    <select
                                        id="media_type"
                                        value={data.media_type}
                                        onChange={(e) =>
                                            setData(
                                                'media_type',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
                                    >
                                        <option value="">
                                            -- Sélectionnez un type --
                                        </option>
                                        {mediaTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type === 'image' &&
                                                    'Image seulement'}
                                                {type === 'video' &&
                                                    'Vidéo seulement'}
                                                {type === 'both' &&
                                                    'Image et vidéo'}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.media_type && (
                                        <p className="text-sm text-red-500">
                                            {errors.media_type}
                                        </p>
                                    )}
                                </div>

                                {/* Image */}
                                <div className="space-y-2">
                                    <Label htmlFor="image">
                                        Image
                                        {previewUrl && (
                                            <span className="text-sm text-gray-500">
                                                {' '}
                                                (laisser vide pour garder
                                                l'actuelle)
                                            </span>
                                        )}
                                    </Label>
                                    <Input
                                        type="file"
                                        id="image"
                                        onChange={handlePictureChange}
                                        accept="image/*"
                                        className="block w-full bg-white py-2 shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 sm:rounded-lg"
                                    />
                                    {errors.picture && (
                                        <p className="text-sm text-red-500">
                                            {errors.picture}
                                        </p>
                                    )}
                                    {previewUrl && (
                                        <div className="mt-2">
                                            <p className="mb-1 text-sm text-gray-600">
                                                Aperçu :
                                            </p>
                                            <img
                                                src={previewUrl}
                                                alt="preview"
                                                className="max-h-48 rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Vidéo */}
                                <div className="space-y-2">
                                    <Label htmlFor="video">
                                        Vidéo
                                        {videoPreview && (
                                            <span className="text-sm text-gray-500">
                                                {' '}
                                                (laisser vide pour garder
                                                l'actuelle)
                                            </span>
                                        )}
                                    </Label>
                                    <Input
                                        type="file"
                                        id="video"
                                        onChange={handleVideoChange}
                                        accept="video/*"
                                        className="block w-full bg-white py-2 shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 sm:rounded-lg"
                                    />
                                    {errors.video && (
                                        <p className="text-sm text-red-500">
                                            {errors.video}
                                        </p>
                                    )}
                                    {videoPreview && (
                                        <div className="mt-2">
                                            <p className="mb-1 text-sm text-gray-600">
                                                Aperçu :
                                            </p>
                                            <video
                                                src={videoPreview}
                                                controls
                                                className="max-h-48 rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Boutons */}
                                <div className="flex items-center justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                    >
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? 'Enregistrement...'
                                            : 'Enregistrer les modifications'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
