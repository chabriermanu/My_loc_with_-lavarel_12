<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest
{
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
            'picture' => 'nullable|image|max:5120',
            'video' => 'nullable|mimes:mp4,mov,avi,wmv|max:51200',
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
        ];
    }
}
