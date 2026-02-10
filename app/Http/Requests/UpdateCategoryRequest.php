<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    /**
     * Sanitisation des données validées
     */
    public function validated($key = null, $default = null)
    {
        $data = parent::validated($key, $default);

        // Nettoyer le contenu HTML
        if (isset($data['name'])) {
            $data['name'] = strip_tags($data['name']);
        }

        if (isset($data['description'])) {
            $data['description'] = strip_tags($data['description']);
        }

        // Nettoyer l'icône (éviter injection de code)
        if (isset($data['icon'])) {
            $data['icon'] = strip_tags($data['icon']);
        }

        return $data;
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $categoryId = $this->route('category')->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($categoryId),
            ],
            'description' => 'nullable|string|max:1000',
            'icon' => 'nullable|string|max:100',
            'type' => 'required|in:object,service',
            'parent_id' => [
                'nullable',
                'exists:categories,id',
                Rule::notIn([$categoryId]), // Une catégorie ne peut pas être son propre parent
            ],
            'color' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ];
    }

    /**
     * Messages d'erreur personnalisés en français
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Le nom de la catégorie est obligatoire.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'name.unique' => 'Ce nom de catégorie existe déjà.',

            'description.max' => 'La description ne peut pas dépasser 1000 caractères.',

            'icon.max' => 'Le nom de l\'icône ne peut pas dépasser 100 caractères.',

            'type.required' => 'Le type est obligatoire.',
            'type.in' => 'Le type doit être "objet" ou "service".',

            'parent_id.exists' => 'La catégorie parente sélectionnée n\'existe pas.',
            'parent_id.not_in' => 'Une catégorie ne peut pas être son propre parent.',

            'color.regex' => 'La couleur doit être au format hexadécimal (#RRGGBB).',
        ];
    }

    /**
     * Noms des attributs pour les messages d'erreur
     */
    public function attributes(): array
    {
        return [
            'name' => 'nom',
            'description' => 'description',
            'icon' => 'icône',
            'type' => 'type',
            'parent_id' => 'catégorie parente',
            'color' => 'couleur',
        ];
    }
}
