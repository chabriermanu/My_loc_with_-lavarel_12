<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        $loan = $this->loan;
        $user = $this->user();

        // --- Emprunteur ---
        if ($user->id === $loan->borrower_id) {

            // Peut modifier si pending ou approved
            if (in_array($loan->status, ['pending', 'approved'])) {
                return true;
            }

            // Peut modifier si in_progress mais pas encore commencé
            if ($loan->status === 'in_progress') {
                $start = $loan->start_date->format('Y-m-d') . ' ' . $loan->start_time;
                return now()->lt($start);
            }

            return false;
        }

        // --- Propriétaire ---
        if ($user->id === $loan->owner_id) {

            // Peut modifier si pending ou approved
            if (in_array($loan->status, ['pending', 'approved'])) {
                return true;
            }

            // Peut modifier si in_progress tant que pas retourné
            if ($loan->status === 'in_progress' && $loan->returned_at === null) {
                return true;
            }

            return false;
        }

        return false;
    }

    public function rules(): array
    {
        return [
            'start_date' => 'required|date|after_or_equal:today',
            'end_date'   => 'required|date|after_or_equal:start_date',

            'start_time' => 'required|date_format:H:i',
            'end_time'   => 'required|date_format:H:i',

            'notes'      => 'nullable|string|max:500',
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
