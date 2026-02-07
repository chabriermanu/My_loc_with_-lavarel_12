<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;


class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Item::with(['category', 'owner'])
            ->withCount(['likes', 'favorites', 'comments'])
            ->where('is_available', true);

        // ✅ SI L'UTILISATEUR A UNE LOCALISATION, CALCUL DES DISTANCES
        if ($user && $user->latitude && $user->longitude) {
            $userLat = $user->latitude;
            $userLng = $user->longitude;

            $query->join('users', 'items.user_id', '=', 'users.id')
                ->select('items.*')
                ->selectRaw(
                    'ROUND(6371 * acos(
                        cos(radians(?)) * cos(radians(users.latitude)) * 
                        cos(radians(users.longitude) - radians(?)) + 
                        sin(radians(?)) * sin(radians(users.latitude))
                    )) AS distance',
                    [$userLat, $userLng, $userLat]
                )
                ->orderBy('distance', 'asc'); // Tri par distance croissante
        } else {
            // Tri par défaut : les plus récents
            $query->latest();
        }

        $items = $query->paginate(12);

        // ✅ Ajouter is_liked et is_favorited pour chaque item
        if (Auth::check()) {
            $items->getCollection()->transform(function ($item) {
                $item->is_liked = $item->likes()
                    ->where('user_id', Auth::id())
                    ->exists();

                $item->is_favorited = $item->favorites()
                    ->where('user_id', Auth::id())
                    ->exists();

                return $item;
            });
        }

        return Inertia::render('Items/Index', [
            'items' => $items,
        ]);
    }

    /**
     * Display user's own items
     */
    public function myItems()
    {
        $items = Item::with(['category'])
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(12);

        return Inertia::render('Items/MyItems', [
            'items' => $items
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();
        $conditions = ['new', 'like_new', 'good', 'fair', 'poor'];
        $mediaTypes = ['image', 'video', 'both'];

        return Inertia::render('Items/Create', [
            'categories' => $categories,
            'conditions' => $conditions,
            'mediaTypes' => $mediaTypes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreItemRequest $request)
    {
        $picturePath = null;
        if ($request->hasFile('picture')) {
            $picturePath = $request->file('picture')->store('items', 'public');
        }

        $videoPath = null;
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('items', 'public');
        }

        Item::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'type' => $request->type,
            'picture' => $picturePath,
            'video' => $videoPath,
            'media_type' => $request->media_type,
            'user_id' => Auth::id(),
            'category_id' => $request->category_id,
            'condition' => $request->condition,
            'value' => $request->value,
            'is_available' => true,
        ]);

        return redirect()->route('items.index')
            ->with('success', 'Item créé avec succès !');
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        $item->load([
            'owner',
            'category',
            'media',
            'reviews.user',
            'comments.user',
            'comments.replies.user'
        ]);

        $item->increment('views_count');

        $hasCompletedLoan = Auth::check()
            ? $item->loans()
            ->where('borrower_id', Auth::id())
            ->where('status', 'completed')
            ->exists()
            : false;

        $userReview = Auth::check()
            ? $item->reviews()->where('user_id', Auth::id())->first()
            : null;

        return Inertia::render('Items/Show', [
            'item' => $item,
            'isFavorited' => $item->is_favorited,
            'hasCompletedLoan' => $hasCompletedLoan,
            'userReview' => $userReview,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $item)
    {
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Action non autorisée');
        }

        $categories = Category::all();
        $conditions = ['new', 'like_new', 'good', 'fair', 'poor'];
        $mediaTypes = ['image', 'video', 'both'];

        return Inertia::render('Items/Edit', [
            'item' => $item,
            'categories' => $categories,
            'conditions' => $conditions,
            'mediaTypes' => $mediaTypes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateItemRequest $request, Item $item)
    {
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Action non autorisée');
        }

        // Gestion de l'image
        if ($request->hasFile('picture')) {
            if ($item->picture) {
                Storage::disk('public')->delete($item->picture);
            }
            $picturePath = $request->file('picture')->store('items', 'public');
        } else {
            $picturePath = $item->picture;
        }

        // Gestion de la vidéo
        if ($request->hasFile('video')) {
            if ($item->video) {
                Storage::disk('public')->delete($item->video);
            }
            $videoPath = $request->file('video')->store('items', 'public');
        } else {
            $videoPath = $item->video;
        }

        $item->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'type' => $request->type,
            'picture' => $picturePath,
            'video' => $videoPath,
            'media_type' => $request->media_type,
            'category_id' => $request->category_id,
            'condition' => $request->condition,
            'value' => $request->value,
            'is_available' => true,
        ]);

        return redirect()->route('items.index')
            ->with('success', 'Item modifié avec succès !');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Action non autorisée');
        }

        if ($item->loans()->whereIn('status', ['pending', 'approved', 'in_progress'])->exists()) {
            return redirect()->back()->with('error', 'Impossible de supprimer un item avec des prêts en cours !');
        }

        // Supprimer les fichiers avant de supprimer l'item
        if ($item->picture) {
            Storage::disk('public')->delete($item->picture);
        }
        if ($item->video) {
            Storage::disk('public')->delete($item->video);
        }

        $item->delete();

        return redirect()->route('items.index')->with('success', 'Item supprimé avec succès !');
    }
}
