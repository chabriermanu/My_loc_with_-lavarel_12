<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemRequest extends FormRequest
{
    public function validated($key = null, $default = null)
    {
        $data = parent::validated($key, $default);

        // Nettoyer le contenu HTML
        if (isset($data['content'])) {
            $data['content'] = strip_tags($data['content']);
            // OU si tu veux garder certaines balises :
            // $data['content'] = strip_tags($data['content'], '<b><i><u>');
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
            'picture' => 'nullable|image|max:10240', // 5MB max
            'video' => 'nullable|mimes:mp4,mov,avi,wmv|max:1048576', // 50MB max
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire',
            'description.required' => 'La description est obligatoire',
            'type.required' => 'Le type est obligatoire',
            'type.in' => 'Le type doit être "objet" ou "service"',
            'category_id.required' => 'La catégorie est obligatoire',
            'category_id.exists' => 'La catégorie sélectionnée n\'existe pas',
            'picture.image' => 'Le fichier doit être une image',
            'picture.max' => 'L\'image ne doit pas dépasser 5MB',
            'video.mimes' => 'La vidéo doit être au format mp4, mov, avi ou wmv',
            'video.max' => 'La vidéo ne doit pas dépasser 50MB',
        ];
    }
}
