<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserConsent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ConsentController extends Controller
{
    /**
     * Récupérer tous les consentements de l'utilisateur connecté
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $consents = $user->consents()->latest()->get();

        return response()->json([
            'success' => true,
            'consents' => $consents
        ]);
    }

    /**
     * Donner un consentement
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'consent_type' => [
                'required',
                'string',
                Rule::in([
                    'terms',
                    'privacy_policy',
                    'contact_sharing',
                    'geolocation',
                    'marketing',
                    'data_processing'
                ])
            ]
        ]);

        $user = Auth::user();

        $consent = $user->giveConsent(
            $validated['consent_type'],
            $request->ip(),
            $request->userAgent()
        );

        return response()->json([
            'success' => true,
            'message' => 'Consentement enregistré avec succès',
            'consent' => $consent
        ], 201);
    }

    /**
     * Révoquer un consentement
     */
    public function revoke(Request $request, string $consentType): JsonResponse
    {
        $user = Auth::user();

        $validTypes = [
            'terms',
            'privacy_policy',
            'contact_sharing',
            'geolocation',
            'marketing',
            'data_processing'
        ];

        if (!in_array($consentType, $validTypes)) {
            return response()->json([
                'success' => false,
                'message' => 'Type de consentement invalide'
            ], 400);
        }

        $revoked = $user->revokeConsent($consentType);

        if (!$revoked) {
            return response()->json([
                'success' => false,
                'message' => 'Consentement non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Consentement révoqué avec succès'
        ]);
    }

    /**
     * Vérifier si un consentement est donné
     */
    public function check(string $consentType): JsonResponse
    {
        $user = Auth::user();

        $validTypes = [
            'terms',
            'privacy_policy',
            'contact_sharing',
            'geolocation',
            'marketing',
            'data_processing'
        ];

        if (!in_array($consentType, $validTypes)) {
            return response()->json([
                'success' => false,
                'message' => 'Type de consentement invalide'
            ], 400);
        }

        $hasConsent = $user->hasConsent($consentType);

        return response()->json([
            'success' => true,
            'has_consent' => $hasConsent
        ]);
    }

    /**
     * Supprimer toutes les données personnelles (droit à l'effacement RGPD)
     */
    public function deleteAllData(Request $request): JsonResponse
    {
        $user = Auth::user();

        // Vérifier le mot de passe pour sécurité
        $request->validate([
            'password' => 'required|string'
        ]);

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Mot de passe incorrect'
            ], 403);
        }

        // Anonymiser ou supprimer les données selon RGPD
        // À adapter selon vos besoins
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Vos données ont été supprimées'
        ]);
    }
}
