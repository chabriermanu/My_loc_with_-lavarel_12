<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLoanRequest extends FormRequest
{
    public function validated($key = null, $default = null)
    {
        $data = parent::validated($key, $default);

        // Nettoyer les notes
        if (isset($data['notes'])) {
            $data['notes'] = strip_tags($data['notes']);
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
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i',
            'notes' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'item_id.required' => 'L\'item est obligatoire.',
            'item_id.exists' => 'L\'item sélectionné n\'existe pas.',
            'start_date.required' => 'La date de début est obligatoire.',
            'start_date.after_or_equal' => 'La date de début ne peut pas être dans le passé.',
            'end_date.required' => 'La date de fin est obligatoire.',
            'end_date.after' => 'La date de fin doit être après la date de début.',
            'start_time.date_format' => 'Le format de l\'heure de début n\'est pas valide.',
            'end_time.date_format' => 'Le format de l\'heure de fin n\'est pas valide.',
            'notes.max' => 'Les notes ne peuvent pas dépasser 500 caractères.',
        ];
    }

    public function attributes(): array
    {
        return [
            'item_id' => 'item',
            'start_date' => 'date de début',
            'end_date' => 'date de fin',
            'start_time' => 'heure de début',
            'end_time' => 'heure de fin',
            'notes' => 'notes',
        ];
    }

    // ⭐ Validation croisée date/heure
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->start_date === $this->end_date) {
                if ($this->start_time && $this->end_time && $this->start_time >= $this->end_time) {
                    $validator->errors()->add('end_time', 'L\'heure de fin doit être après l\'heure de début.');
                }
            }
        });
    }
}
