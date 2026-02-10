<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
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
            'item_id' => 'required|exists:items,id',
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
        ];
    }

    public function messages(): array
    {
        return [
            'item_id.required' => 'L\'item est obligatoire.',
            'item_id.exists' => 'L\'item sélectionné n\'existe pas.',
            'content.required' => 'Le contenu du commentaire est obligatoire.',
            'content.max' => 'Le commentaire ne peut pas dépasser 1000 caractères.',
            'parent_id.exists' => 'Le commentaire parent n\'existe pas.',
        ];
    }

    public function attributes(): array
    {
        return [
            'item_id' => 'item',
            'content' => 'contenu',
            'parent_id' => 'commentaire parent',
        ];
    }
}
