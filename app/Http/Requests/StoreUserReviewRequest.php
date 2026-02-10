<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserReviewRequest extends FormRequest
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
            'reviewed_user_id' => 'required|exists:users,id',
            'loan_id' => 'required|exists:loans,id',
            'role' => 'required|in:owner,borrower',
            'communication' => 'required|integer|min:1|max:5',
            'reliability' => 'required|integer|min:1|max:5',
            'condition' => 'required|integer|min:1|max:5',
            'overall' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'reviewed_user_id.required' => 'L\'utilisateur est obligatoire.',
            'reviewed_user_id.exists' => 'L\'utilisateur sélectionné n\'existe pas.',
            'loan_id.required' => 'Le prêt est obligatoire.',
            'loan_id.exists' => 'Le prêt sélectionné n\'existe pas.',
            'role.required' => 'Le rôle est obligatoire.',
            'role.in' => 'Le rôle doit être "owner" ou "borrower".',
            'communication.required' => 'La note de communication est obligatoire.',
            'communication.min' => 'La note minimale est 1.',
            'communication.max' => 'La note maximale est 5.',
            'reliability.required' => 'La note de fiabilité est obligatoire.',
            'reliability.min' => 'La note minimale est 1.',
            'reliability.max' => 'La note maximale est 5.',
            'condition.required' => 'La note d\'état est obligatoire.',
            'condition.min' => 'La note minimale est 1.',
            'condition.max' => 'La note maximale est 5.',
            'overall.required' => 'La note globale est obligatoire.',
            'overall.min' => 'La note minimale est 1.',
            'overall.max' => 'La note maximale est 5.',
            'comment.max' => 'Le commentaire ne peut pas dépasser 1000 caractères.',
        ];
    }

    public function attributes(): array
    {
        return [
            'reviewed_user_id' => 'utilisateur',
            'loan_id' => 'prêt',
            'role' => 'rôle',
            'communication' => 'communication',
            'reliability' => 'fiabilité',
            'condition' => 'état',
            'overall' => 'note globale',
            'comment' => 'commentaire',
        ];
    }
}
