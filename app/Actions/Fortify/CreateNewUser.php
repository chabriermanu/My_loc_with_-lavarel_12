<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\User;
use App\Services\GeocodingService;
use Illuminate\Support\Facades\Log;
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
            'postal_code' => ['nullable', 'regex:/^[0-9]{5}$/'],
            'city' => ['nullable', 'string', 'max:255'],
            'street_address' => ['nullable', 'string', 'max:255'],
        ])->validate();

        // ✅ GÉOCODAGE AUTOMATIQUE si code postal fourni
        $latitude = null;
        $longitude = null;
        $geoCity = null;

        if (!empty($input['postal_code'])) {
            try {
                Log::info("Géocodage automatique pour l'inscription", ['postal_code' => $input['postal_code']]);

                $communes = GeocodingService::getCommunesByPostalCode($input['postal_code']);

                if ($communes && count($communes) > 0) {
                    // Prendre la commune la plus peuplée (première après le tri)
                    $communeCode = $communes[0]['code'];
                    $coordinates = GeocodingService::getCoordinatesByCommuneCode($communeCode);

                    if ($coordinates) {
                        $latitude = $coordinates['latitude'];
                        $longitude = $coordinates['longitude'];
                        // Si l'utilisateur n'a pas renseigné de ville, on utilise celle du géocodage
                        $geoCity = $coordinates['city'];

                        Log::info("Géocodage réussi", [
                            'city' => $geoCity,
                            'latitude' => $latitude,
                            'longitude' => $longitude
                        ]);
                    }
                }
            } catch (\Exception $e) {
                // En cas d'erreur de géocodage, on continue l'inscription sans coordonnées
                Log::warning("Erreur de géocodage lors de l'inscription : " . $e->getMessage());
            }
        }

        return User::create([
            'pseudo' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'first_name' => $input['first_name'] ?? '',
            'last_name' => $input['last_name'] ?? '',
            'phone' => $input['phone'] ?? null,

            // ✅ CHAMPS DE LOCALISATION avec géocodage
            'postal_code' => $input['postal_code'] ?? null,
            'city' => $input['city'] ?? $geoCity ?? null,  // Utilise la ville saisie ou géocodée
            'street_address' => $input['street_address'] ?? null,
            'latitude' => $latitude,
            'longitude' => $longitude,
        ]);
    }
}
