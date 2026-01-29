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

        $isFavorited = Auth::check()
            ? $item->favorites()->where('user_id', Auth::id())->exists()
            : false;

        // Vérifier si l'utilisateur a déjà emprunté et restitué cet item
        $hasCompletedLoan = Auth::check()
            ? $item->loans()
            ->where('borrower_id', Auth::id())
            ->where('status', 'completed')
            ->exists()
            : false;

        // Vérifier si l'utilisateur a déjà laissé un avis
        $userReview = Auth::check()
            ? $item->reviews()->where('user_id', Auth::id())->first()
            : null;

        return Inertia::render('Items/Show', [
            'item' => $item,
            'isFavorited' => $isFavorited,
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

        if ($request->hasFile('picture')) {
            $picturePath = $request->file('picture')->store('items', 'public');
        } else {
            $picturePath = $item->picture;
        }

        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('items', 'public');
        } else {
            $videoPath = $item->video;
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

        $item->delete();

        return redirect()->route('items.index')->with('success', 'Item supprimé avec succès !');
    }
}
