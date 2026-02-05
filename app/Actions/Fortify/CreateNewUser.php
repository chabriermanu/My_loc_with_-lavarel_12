<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'phone' => ['nullable', 'string', 'max:20'],
        ])->validate();

        return User::create([
            'pseudo' => $input['name'],  // ✅ Change 'name' en 'pseudo'
            'email' => $input['email'],
            'password' => $input['password'],
            'first_name' => $input['first_name'] ?? '',
            'last_name' => $input['last_name'] ?? '',
            'phone' => $input['phone'] ?? null,

            // ✅ NOUVEAUX CHAMPS DE LOCALISATION
            'postal_code' => $input['postal_code'] ?? null,
            'city' => $input['city'] ?? null,
            'street_address' => $input['street_address'] ?? null,
        ]);
    }
}
