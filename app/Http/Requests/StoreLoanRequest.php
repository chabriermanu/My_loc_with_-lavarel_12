<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'item_id' => 'required|exists:items,id',

            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',

            'start_time' => 'required|date_format:H:i',
            'end_time'   => 'required|date_format:H:i',

            'notes' => 'nullable|string|max:500',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {

            $startDate = $this->start_date;
            $endDate   = $this->end_date;
            $startTime = $this->start_time;
            $endTime   = $this->end_time;

            // Si même jour → end_time doit être > start_time
            if ($startDate === $endDate && $startTime >= $endTime) {
                $validator->errors()->add(
                    'end_time',
                    'L\'heure de fin doit être supérieure à l\'heure de début.'
                );
            }
        });
    }
}
