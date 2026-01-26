<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Item;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $favorites = Favorite::with(['item.owner', 'item.category'])
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(12);

        return Inertia::render('Favorites/Index', [
            'favorites' => $favorites
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function toggle(Item $item)
    {
        $favorite = Favorite::where('user_id', Auth::id())
            ->where('item_id', $item->id)
            ->first();

        if ($favorite) {
            $favorite->delete();
            $item->decrement('favorites_count');
            return back()->with('success', 'Retiré des favoris');
        } else {
            // Le favori N'EXISTE PAS → Le créer
            Favorite::create([
                'user_id' => Auth::id(),
                'item_id' => $item->id
            ]);
            $item->increment('favorites_count');
            return back()->with('success', 'Ajouté aux favoris');
        }
    }
}
