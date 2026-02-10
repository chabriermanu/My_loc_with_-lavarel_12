<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemReviewRequest extends FormRequest
{
    /**
     * Sanitisation des données validées
     */
    public function validated($key = null, $default = null)
    {
        $data = parent::validated($key, $default);

        // Nettoyer le contenu HTML du commentaire
        if (isset($data['comment'])) {
            $data['comment'] = strip_tags($data['comment']);
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
        return [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Messages d'erreur personnalisés en français
     */
    public function messages(): array
    {
        return [
            'rating.required' => 'La note est obligatoire.',
            'rating.integer' => 'La note doit être un nombre entier.',
            'rating.min' => 'La note minimale est 1 étoile.',
            'rating.max' => 'La note maximale est 5 étoiles.',
            'comment.max' => 'Le commentaire ne peut pas dépasser 1000 caractères.',
        ];
    }

    /**
     * Noms des attributs pour les messages d'erreur
     */
    public function attributes(): array
    {
        return [
            'rating' => 'note',
            'comment' => 'commentaire',
        ];
    }
}
