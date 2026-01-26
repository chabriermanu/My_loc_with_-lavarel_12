<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = Item::with(['owner', 'category'])
            ->latest()
            ->paginate(12);

        return Inertia::render('Items/Index', [
            'items' => $items
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all(); // Liste des catégories pour le select

        $conditions = ['new', 'like_new', 'good', 'fair', 'poor']; // Options de condition

        $mediaTypes = ['image', 'video', 'both']; // Options de type média

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
            ->with('success', 'Item créé avec succès ! ');
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        $item->load(['owner', 'category', 'media', 'reviews', 'comments']);
        $item->increment('views_count');
        $isFavorited = Auth::check()
            ? $item->favorites()->where('user_id', Auth::id())->exists()
            : false;
        return Inertia::render('Items/Show', [
            'item' => $item,
            'isFavorited' => $isFavorited,
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
        // Passer les données pour le formulaire
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

        if ($request->hasFile('picture')) {
            $picturePath = $request->file('picture')->store('items', 'public');
        } else {
            $picturePath = $item->picture; // Garder l'ancienne
        }

        // Gestion upload vidéo
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('items', 'public');
        } else {
            $videoPath = $item->video; // Garder l'ancienne
        }

        $item->update([

            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'picture' => $picturePath,
            'video' => $videoPath,
            'media_type' => $request->media_type,
            'category_id' => $request->category_id,
            'condition' => $request->condition,
            'value' => $request->value,
            'is_available' => true,

        ]);

        return redirect()->route('items.index')
            ->with('success', 'Item modifiée avec succès !');
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
            return redirect()->back()->with('error', 'impossible de supprimer un item avec des pêts en cours ! ');
        }

        $item->delete();

        return redirect()->route('items.index')->with('success', 'Item supprimé avec succès !');
    }
}
