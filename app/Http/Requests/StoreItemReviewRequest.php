<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemReviewRequest extends FormRequest
{
    public function validated($key = null, $default = null)
    {
        $data = parent::validated($key, $default);

        // Nettoyer le commentaire
        if (isset($data['comment'])) {
            $data['comment'] = strip_tags($data['comment']);
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
            'item_id' => 'required|exists:items,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'item_id.required' => 'L\'item est obligatoire.',
            'item_id.exists' => 'L\'item sélectionné n\'existe pas.',
            'rating.required' => 'La note est obligatoire.',
            'rating.integer' => 'La note doit être un nombre entier.',
            'rating.min' => 'La note minimale est 1.',
            'rating.max' => 'La note maximale est 5.',
            'comment.max' => 'Le commentaire ne peut pas dépasser 1000 caractères.',
        ];
    }

    public function attributes(): array
    {
        return [
            'item_id' => 'item',
            'rating' => 'note',
            'comment' => 'commentaire',
        ];
    }
}
