<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateItemRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'picture' => 'nullable|image|max:2048',
            'video' => 'nullable|mimes:mp4,mov,avi|max:10240',
            'media_type' => 'required|in:image,video,both',
            'category_id' => 'required|exists:categories,id',
            'condition' => 'required|in:new,like_new,good,fair,poor',
            'value' => 'nullable|numeric|min:0',
        ];
    }
}
