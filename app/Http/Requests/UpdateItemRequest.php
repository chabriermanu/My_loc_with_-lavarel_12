<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest
{
    public function validated($key = null, $default = null)
    {
        $data = parent::validated($key, $default);

        // Nettoyer le contenu HTML de la description
        if (isset($data['description'])) {
            $data['description'] = strip_tags($data['description']);
        }

        return $data;
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:object,service', // ← AJOUTER
            'category_id' => 'required|exists:categories,id',
            'condition' => 'nullable|in:new,like_new,good,fair,poor',
            'value' => 'nullable|numeric|min:0',
            'media_type' => 'nullable|in:image,video,both',
            'picture' => 'nullable|image|max:10240',
            'video' => 'nullable|mimes:mp4,mov,avi,wmv|max:1048576',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire.',
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères.',
            'description.required' => 'La description est obligatoire.',
            'type.required' => 'Le type est obligatoire.',
            'type.in' => 'Le type doit être "objet" ou "service".',
            'category_id.required' => 'La catégorie est obligatoire.',
            'category_id.exists' => 'La catégorie sélectionnée n\'existe pas.',
            'condition.in' => 'L\'état sélectionné n\'est pas valide.',
            'value.numeric' => 'La valeur doit être un nombre.',
            'value.min' => 'La valeur doit être positive.',
            'media_type.in' => 'Le type de média n\'est pas valide.',
            'picture.image' => 'Le fichier doit être une image.',
            'picture.max' => 'L\'image ne peut pas dépasser 10 Mo.',
            'video.mimes' => 'La vidéo doit être au format mp4, mov, avi ou wmv.',
            'video.max' => 'La vidéo ne peut pas dépasser 1 Go.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nom',
            'description' => 'description',
            'type' => 'type',
            'category_id' => 'catégorie',
            'condition' => 'état',
            'value' => 'valeur',
            'media_type' => 'type de média',
            'picture' => 'image',
            'video' => 'vidéo',
        ];
    }
}
