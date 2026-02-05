<?php

namespace App\Concerns;

use Illuminate\Validation\Rule;

trait ProfileValidationRules
{
    /**
     * Get the validation rules for profile information.
     *
     * @param  int|null  $userId
     * @return array<string, array<mixed>>
     */
    public function profileRules(?int $userId = null): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                $userId
                    ? Rule::unique('users', 'pseudo')->ignore($userId)
                    : 'unique:users,pseudo'
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                $userId
                    ? Rule::unique('users')->ignore($userId)
                    : 'unique:users'
            ],
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],

            // ✅ NOUVEAUX CHAMPS DE LOCALISATION
            'postal_code' => ['nullable', 'string', 'max:10'],
            'city' => ['nullable', 'string', 'max:255'],
            'street_address' => ['nullable', 'string', 'max:500'],
        ];
    }
}
