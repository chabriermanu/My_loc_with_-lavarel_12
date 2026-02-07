<?php

namespace App\Http\Controllers;

use App\Services\GeocodingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Afficher le formulaire de localisation
     */
    public function edit()
    {
        $user = Auth::user();

        return Inertia::render('settings/Location', [
            'user' => [
                'postal_code' => $user->postal_code,
                'city' => $user->city,
                'latitude' => $user->latitude,
                'longitude' => $user->longitude,
            ]
        ]);
    }

    /**
     * Rechercher les communes d'un code postal (AJAX)
     */
    public function searchCommunes(Request $request)
    {
        $request->validate([
            'postal_code' => ['required', 'regex:/^[0-9]{5}$/'],
        ]);

        $communes = GeocodingService::getCommunesByPostalCode($request->postal_code);

        if (!$communes) {
            return response()->json([
                'error' => 'Code postal introuvable. Vérifiez qu\'il s\'agit d\'un code postal français valide.'
            ], 404);
        }

        return response()->json([
            'communes' => $communes
        ]);
    }

    /**
     * Mettre à jour la localisation avec le code commune sélectionné
     */
    public function update(Request $request)
    {
        $request->validate([
            'postal_code' => ['required', 'regex:/^[0-9]{5}$/'],
            'commune_code' => ['required', 'string'],
        ], [
            'postal_code.required' => 'Le code postal est obligatoire.',
            'postal_code.regex' => 'Le code postal doit contenir 5 chiffres.',
            'commune_code.required' => 'Veuillez sélectionner votre commune.',
        ]);

        $communeCode = $request->commune_code;

        // Récupérer les coordonnées GPS de la commune sélectionnée
        $coordinates = GeocodingService::getCoordinatesByCommuneCode($communeCode);

        if (!$coordinates) {
            return back()->withErrors([
                'commune_code' => 'Impossible de récupérer les coordonnées de cette commune.'
            ]);
        }

        // Mettre à jour l'utilisateur
        Auth::user()->update([
            'postal_code' => $request->postal_code,
            'city' => $coordinates['city'],
            'latitude' => $coordinates['latitude'],
            'longitude' => $coordinates['longitude'],
        ]);

        return back()->with('success', 'Localisation mise à jour avec succès.');
    }

    /**
     * Supprimer la localisation de l'utilisateur
     */
    public function destroy()
    {
        Auth::user()->update([
            'postal_code' => null,
            'city' => null,
            'latitude' => null,
            'longitude' => null,
        ]);

        return back()->with('success', 'Localisation supprimée.');
    }
}
