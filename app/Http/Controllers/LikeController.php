<?php

namespace App\Http\Controllers;

use App\Policies\LikePolicy;
use App\Models\Like;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    public function toggle(Request $request)
    {
        // 1. Validation des données
        $validated = $request->validate([
            'likeable_type' => 'required|string|in:Item', // Ajouter d'autres types si besoin
            'likeable_id'   => 'required|integer|exists:items,id', // Vérifier que l'item existe
        ]);

        // 2. Récupérer le modèle de manière sécurisée
        $likeableClass = "App\\Models\\" . $validated['likeable_type'];

        // Vérifier que la classe existe (sécurité supplémentaire)
        if (!class_exists($likeableClass)) {
            abort(400, 'Type de contenu invalide.');
        }

        $likeable = $likeableClass::findOrFail($validated['likeable_id']);

        // 3. Vérifier la Policy (pas de like sur son propre contenu)
        $policy = new LikePolicy();
        if (!$policy->toggle(Auth::user(), $validated['likeable_type'], $validated['likeable_id'])) {
            return back()->with('error', 'Vous ne pouvez pas liker votre propre contenu.');
        }

        // 4. Toggle like/unlike
        $existingLike = $likeable->likes()
            ->where('user_id', Auth::id())
            ->first();

        if ($existingLike) {
            // Unlike
            $existingLike->delete();
            $message = 'Like retiré avec succès.';
        } else {
            // Like
            $likeable->likes()->create([
                'user_id' => Auth::id(),
            ]);
            $message = 'Contenu liké avec succès.';
        }

        // 5. Retour avec message flash
        return back()->with('success', $message);
    }
}
