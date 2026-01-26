<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreItemReviewRequest extends FormRequest
{
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
            'loan_id' => 'nullable|exists: loans_id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10|max500',

        ];
    }
}
