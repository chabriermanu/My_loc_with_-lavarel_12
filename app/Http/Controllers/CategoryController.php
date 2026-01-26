<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::all();

        return Inertia::render('Categories/Index', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        $slug = Str::slug($request->name);

        Category::create([
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'icon' => $request->icon,
            'points' => $request->points,
            'color' => $request->color,
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Catégorie créée avec succès !');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $category->load('items');
        return Inertia::render('Categories/Show', [
            'category' => $category,
            'itemsCount' => $category->items->count(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        return Inertia::render('Categories/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update([

            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'icon' => $request->icon,
            'points' => $request->points,
            'color' => $request->color,
        ]);
        return Redirect()->route('categories.index')
            ->with('success', 'Catégorie modifiée avec succès !');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if ($category->items()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer une catégorie avec des items !');
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Catégorie supprimée avec succès !');
    }
}
