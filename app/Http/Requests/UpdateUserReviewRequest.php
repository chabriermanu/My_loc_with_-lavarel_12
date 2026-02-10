<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserReviewRequest extends FormRequest
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
            'communication' => 'required|integer|min:1|max:5',
            'reliability' => 'required|integer|min:1|max:5',
            'condition' => 'required|integer|min:1|max:5',
            'overall' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Messages d'erreur personnalisés en français
     */
    public function messages(): array
    {
        return [
            'communication.required' => 'La note de communication est obligatoire.',
            'communication.integer' => 'La note de communication doit être un nombre entier.',
            'communication.min' => 'La note minimale de communication est 1 étoile.',
            'communication.max' => 'La note maximale de communication est 5 étoiles.',

            'reliability.required' => 'La note de fiabilité est obligatoire.',
            'reliability.integer' => 'La note de fiabilité doit être un nombre entier.',
            'reliability.min' => 'La note minimale de fiabilité est 1 étoile.',
            'reliability.max' => 'La note maximale de fiabilité est 5 étoiles.',

            'condition.required' => 'La note d\'état est obligatoire.',
            'condition.integer' => 'La note d\'état doit être un nombre entier.',
            'condition.min' => 'La note minimale d\'état est 1 étoile.',
            'condition.max' => 'La note maximale d\'état est 5 étoiles.',

            'overall.required' => 'La note globale est obligatoire.',
            'overall.integer' => 'La note globale doit être un nombre entier.',
            'overall.min' => 'La note minimale globale est 1 étoile.',
            'overall.max' => 'La note maximale globale est 5 étoiles.',

            'comment.max' => 'Le commentaire ne peut pas dépasser 1000 caractères.',
        ];
    }

    /**
     * Noms des attributs pour les messages d'erreur
     */
    public function attributes(): array
    {
        return [
            'communication' => 'communication',
            'reliability' => 'fiabilité',
            'condition' => 'état',
            'overall' => 'note globale',
            'comment' => 'commentaire',
        ];
    }
}
