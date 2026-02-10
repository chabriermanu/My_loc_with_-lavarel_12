<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLoanRequest extends FormRequest
{
    /**
     * Sanitisation des données validées
     */
    public function validated($key = null, $default = null)
    {
        $data = parent::validated($key, $default);

        // Nettoyer le contenu HTML des notes
        if (isset($data['notes'])) {
            $data['notes'] = strip_tags($data['notes']);
        }

        return $data;
    }

    /**
     * Détermine si l'utilisateur est autorisé à modifier ce prêt
     */
    public function authorize(): bool
    {
        $loan = $this->route('loan');
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

    /**
     * Règles de validation
     */
    public function rules(): array
    {
        return [
            'start_date' => 'required|date|after_or_equal:today',
            'end_date'   => 'required|date|after:start_date',
            'start_time' => 'nullable|date_format:H:i',
            'end_time'   => 'nullable|date_format:H:i',
            'notes'      => 'nullable|string|max:500',
        ];
    }

    /**
     * Messages d'erreur personnalisés en français
     */
    public function messages(): array
    {
        return [
            'start_date.required' => 'La date de début est obligatoire.',
            'start_date.date' => 'La date de début doit être une date valide.',
            'start_date.after_or_equal' => 'La date de début ne peut pas être dans le passé.',

            'end_date.required' => 'La date de fin est obligatoire.',
            'end_date.date' => 'La date de fin doit être une date valide.',
            'end_date.after' => 'La date de fin doit être après la date de début.',

            'start_time.date_format' => 'Le format de l\'heure de début n\'est pas valide (HH:MM attendu).',
            'end_time.date_format' => 'Le format de l\'heure de fin n\'est pas valide (HH:MM attendu).',

            'notes.max' => 'Les notes ne peuvent pas dépasser 500 caractères.',
        ];
    }

    /**
     * Noms des attributs pour les messages d'erreur
     */
    public function attributes(): array
    {
        return [
            'start_date' => 'date de début',
            'end_date' => 'date de fin',
            'start_time' => 'heure de début',
            'end_time' => 'heure de fin',
            'notes' => 'notes',
        ];
    }

    /**
     * Validation croisée : si même jour, l'heure de fin doit être après l'heure de début
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {

            $startDate = $this->start_date;
            $endDate   = $this->end_date;
            $startTime = $this->start_time;
            $endTime   = $this->end_time;

            // Si même jour ET que les heures sont renseignées
            if ($startDate === $endDate && $startTime && $endTime && $startTime >= $endTime) {
                $validator->errors()->add(
                    'end_time',
                    'L\'heure de fin doit être après l\'heure de début.'
                );
            }
        });
    }
}
