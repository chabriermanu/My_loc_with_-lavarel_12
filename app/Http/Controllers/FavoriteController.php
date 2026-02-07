<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Item;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * Afficher la liste des favoris de l'utilisateur connecté
     */
    public function index()
    {
        $favorites = Favorite::with(['item.owner', 'item.category'])
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(12);

        // ✅ Enrichir chaque item avec les compteurs et états
        $favorites->getCollection()->transform(function ($favorite) {
            if ($favorite->item) {
                // Charger les compteurs
                $favorite->item->loadCount(['likes', 'favorites', 'comments']);

                // Vérifier si l'utilisateur a liké cet item
                $favorite->item->is_liked = $favorite->item->likes()
                    ->where('user_id', Auth::id())
                    ->exists();

                // Cet item est forcément en favori puisqu'on est dans la liste des favoris
                $favorite->item->is_favorited = true;
            }
            return $favorite;
        });

        return Inertia::render('Favorites/Index', [
            'favorites' => $favorites
        ]);
    }

    /**
     * Ajouter ou retirer un item des favoris
     */
    public function toggle(Item $item)
    {
        $favorite = Favorite::where('user_id', Auth::id())
            ->where('item_id', $item->id)
            ->first();

        if ($favorite) {
            // Le favori existe → Le supprimer
            $favorite->delete();
            return back()->with('success', 'Retiré des favoris');
        } else {
            // Le favori n'existe pas → Le créer
            Favorite::create([
                'user_id' => Auth::id(),
                'item_id' => $item->id
            ]);
            return back()->with('success', 'Ajouté aux favoris');
        }
    }
}
