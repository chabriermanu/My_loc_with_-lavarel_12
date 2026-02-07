<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class GeocodingService
{
    /**
     * Récupérer toutes les communes d'un code postal
     */
    public static function getCommunesByPostalCode(string $postalCode): ?array
    {
        try {
            $postalCode = trim($postalCode);

            Log::info("Recherche communes pour le code postal : {$postalCode}");

            $url = "https://geo.api.gouv.fr/communes?codePostal={$postalCode}&fields=nom,code,population&format=json";

            $json = @file_get_contents($url);

            if ($json === false) {
                Log::error("Impossible d'accéder à l'API Geo pour le code postal : {$postalCode}");
                return null;
            }

            $communes = json_decode($json, true);

            if (empty($communes)) {
                Log::warning("Code postal introuvable : {$postalCode}");
                return null;
            }

            // Trier par population décroissante
            usort($communes, function ($a, $b) {
                return ($b['population'] ?? 0) <=> ($a['population'] ?? 0);
            });

            Log::info("Communes trouvées : " . count($communes));

            return $communes;
        } catch (\Exception $e) {
            Log::error("Exception recherche communes : " . $e->getMessage());
            return null;
        }
    }

    /**
     * Récupérer les coordonnées GPS d'une commune par son code INSEE
     */
    public static function getCoordinatesByCommuneCode(string $communeCode): ?array
    {
        try {
            Log::info("Géocodage pour la commune : {$communeCode}");

            $url = "https://geo.api.gouv.fr/communes/{$communeCode}?fields=nom,centre";

            $json = @file_get_contents($url);

            if ($json === false) {
                Log::error("Impossible d'accéder à l'API Geo pour la commune : {$communeCode}");
                return null;
            }

            $commune = json_decode($json, true);

            if (!isset($commune['centre']['coordinates'])) {
                Log::error("Coordonnées manquantes pour la commune : {$communeCode}");
                return null;
            }

            $result = [
                'latitude' => $commune['centre']['coordinates'][1],  // Y
                'longitude' => $commune['centre']['coordinates'][0], // X
                'city' => $commune['nom']
            ];

            Log::info("Géocodage réussi", $result);

            return $result;
        } catch (\Exception $e) {
            Log::error("Exception géocodage : " . $e->getMessage());
            return null;
        }
    }

    /**
     * Calculer la distance entre deux points GPS (formule Haversine)
     */
    public static function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371; // Rayon de la Terre en km

        $latDelta = deg2rad($lat2 - $lat1);
        $lonDelta = deg2rad($lon2 - $lon1);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return (int)round($earthRadius * $c,);
    }

    /**
     * Vérifier si un code postal français est valide
     */
    public static function isValidFrenchPostalCode(string $postalCode): bool
    {
        return preg_match('/^[0-9]{5}$/', trim($postalCode));
    }
}
