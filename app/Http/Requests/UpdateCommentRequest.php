<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCommentRequest extends FormRequest
{
    public function validated($key = null, $default = null)
    {
        $data = parent::validated($key, $default);

        // Nettoyer le contenu HTML
        if (isset($data['content'])) {
            $data['content'] = strip_tags($data['content']);
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
            'content' => 'required|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'content.required' => 'Le contenu du commentaire est obligatoire.',
            'content.max' => 'Le commentaire ne peut pas dépasser 1000 caractères.',
        ];
    }

    public function attributes(): array
    {
        return [
            'content' => 'contenu',
        ];
    }
}
