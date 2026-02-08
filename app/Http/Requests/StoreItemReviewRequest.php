<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreItemReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check();
    }

    public function rules(): array
    {
        return [
            'loan_id' => 'required|exists:loans,id',  // ✅ CORRIGÉ (sans espace)
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'loan_id.required' => 'Le prêt est requis.',
            'loan_id.exists' => 'Ce prêt n\'existe pas.',
            'rating.required' => 'La note est requise.',
            'rating.min' => 'La note doit être au minimum 1.',
            'rating.max' => 'La note doit être au maximum 5.',
            'comment.max' => 'Le commentaire ne peut pas dépasser 1000 caractères.',
        ];
    }
}
