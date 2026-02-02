<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    /**
     * Affiche toutes les catégories avec leurs 4 meilleurs items
     */
    public function index()
    {
        $categories = Category::with(['items' => function ($query) {
            $query->with('owner')
                ->where('is_available', true)
                ->orderByRaw('
                (
                    COALESCE(average_rating, 0) * 0.3 +
                    (COALESCE(views_count, 0) / 100) * 0.2 +
                    (SELECT COUNT(*) FROM comments WHERE comments.item_id = items.id) * 0.25 +
                    (SELECT COUNT(*) FROM likes WHERE likes.likeable_id = items.id AND likes.likeable_type = "App\\\\Models\\\\Item") * 0.25
                ) DESC
            ')
            ->take(4);
    }])
        ->withCount('items')
        ->orderBy('name')
        ->paginate(12)
        ->withQueryString();

    return Inertia::render('Categories/Index', [
        'categories' => $categories,
        'type' => 'all'
    ]);
}

    /**
     * Affiche uniquement les catégories d'OBJETS avec leurs 4 meilleurs items
     */
    public function indexObjects()
{
    $categories = Category::with(['items' => function ($query) {
        $query->with('owner')
            ->where('is_available', true)
            ->where('type', 'object')
            ->orderByRaw('
                (
                    COALESCE(average_rating, 0) * 0.3 +
                    (COALESCE(views_count, 0) / 100) * 0.2 +
                    (SELECT COUNT(*) FROM comments WHERE comments.item_id = items.id) * 0.25 +
                    (SELECT COUNT(*) FROM likes WHERE likes.likeable_id = items.id AND likes.likeable_type = "App\\\\Models\\\\Item") * 0.25
                ) DESC
            ')
            ->take(4);
    }])
        ->whereHas('items', function ($query) {
            $query->where('type', 'object');
        })
        ->withCount(['items' => function ($query) {
            $query->where('type', 'object');
        }])
        ->orderBy('name')
        ->paginate(12)
        ->withQueryString();

    return Inertia::render('Categories/Index', [
        'categories' => $categories,
        'type' => 'object'
    ]);
}

public function indexServices()
{
    $categories = Category::with(['items' => function ($query) {
        $query->with('owner')
            ->where('is_available', true)
            ->where('type', 'service')
            ->orderByRaw('
                (
                    COALESCE(average_rating, 0) * 0.3 +
                    (COALESCE(views_count, 0) / 100) * 0.2 +
                    (SELECT COUNT(*) FROM comments WHERE comments.item_id = items.id) * 0.25 +
                    (SELECT COUNT(*) FROM likes WHERE likes.likeable_id = items.id AND likes.likeable_type = "App\\\\Models\\\\Item") * 0.25
                ) DESC
            ')
            ->take(4);
    }])
        ->whereHas('items', function ($query) {
            $query->where('type', 'service');
        })
        ->withCount(['items' => function ($query) {
            $query->where('type', 'service');
        }])
        ->orderBy('name')
        ->paginate(12)
        ->withQueryString();

    return Inertia::render('Categories/Index', [
        'categories' => $categories,
        'type' => 'service'
    ]);
}
    /**
     * Affiche une catégorie spécifique avec tous ses items (paginés)
     */
    public function show(Category $category)
{
    $items = $category->items()
        ->with(['owner', 'category'])
        ->where('is_available', true)
        ->selectRaw('
            items.*,
            (
                COALESCE(average_rating, 0) * 0.3 +
                (COALESCE(views_count, 0) / 100) * 0.2 +
                COALESCE(comments_count, 0) * 0.25 +
                COALESCE(likes_count, 0) * 0.25
            ) as popularity_score
        ')
        ->orderByDesc('popularity_score')
        ->paginate(12);

    return Inertia::render('Categories/Show', [
        'category' => $category,
        'items' => $items
    ]);
}

    /**
     * Affiche le formulaire de création (pour admin)
     */
    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    /**
     * Enregistre une nouvelle catégorie
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:10',
        ]);

        Category::create($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Catégorie créée avec succès');
    }

    /**
     * Affiche le formulaire d'édition
     */
    public function edit(Category $category)
    {
        return Inertia::render('Categories/Edit', [
            'category' => $category
        ]);
    }

    /**
     * Met à jour une catégorie
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:10',
        ]);

        $category->update($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Catégorie mise à jour avec succès');
    }

    /**
     * Supprime une catégorie
     */
    public function destroy(Category $category)
    {
        // Vérifie si la catégorie a des items
        if ($category->items()->count() > 0) {
            return back()->with('error', 'Impossible de supprimer une catégorie contenant des items');
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Catégorie supprimée avec succès');
    }
}