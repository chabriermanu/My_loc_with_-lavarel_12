<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Models\Category;
use App\Services\SecureFileUploadService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Injection du service d'upload sécurisé
     */
    public function __construct(
        private SecureFileUploadService $fileUploadService
    ) {}

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
                ->orderBy('distance', 'asc');
        } else {
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
     * 🛡️ SÉCURISÉ avec SecureFileUploadService
     */
    public function store(StoreItemRequest $request)
    {
        try {
            // 🛡️ Upload sécurisé de l'image
            $picturePath = null;
            if ($request->hasFile('picture')) {
                $picturePath = $this->fileUploadService->uploadImage(
                    $request->file('picture')
                );
            }

            // 🛡️ Upload sécurisé de la vidéo
            $videoPath = null;
            if ($request->hasFile('video')) {
                $videoPath = $this->fileUploadService->uploadVideo(
                    $request->file('video')
                );
            }

            // Créer l'item
            $item = Item::create([
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'type' => $request->type,
                'picture' => $picturePath,
                'video' => $videoPath,
                'media_type' => $request->media_type ?? 'image', // Valeur par défaut si non fourni
                'category_id' => $request->category_id,
                'condition' => $request->condition,
                'value' => $request->value,
                'user_id' => Auth::id(),
                'is_available' => true,
            ]);

            return redirect()->route('items.show', $item)
                ->with('success', 'Item créé avec succès !');
        } catch (\InvalidArgumentException $e) {
            // Erreur de validation du fichier
            return back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
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

        $completedLoan = null;

        if (Auth::check()) {
            $completedLoan = $item->loans()
                ->where('borrower_id', Auth::id())
                ->where('status', 'completed')
                ->first();
        }

        $userReview = Auth::check()
            ? $item->reviews()->where('user_id', Auth::id())->first()
            : null;

        return Inertia::render('Items/Show', [
            'item' => $item,
            'isFavorited' => $item->is_favorited,
            'hasCompletedLoan' => (bool) $completedLoan,
            'completedLoanId' => $completedLoan?->id,
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
     * 🛡️ SÉCURISÉ avec SecureFileUploadService
     */
    public function update(UpdateItemRequest $request, Item $item)
    {
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Action non autorisée');
        }

        try {
            // 🛡️ Gestion sécurisée de l'image
            $picturePath = $item->picture;
            if ($request->hasFile('picture')) {
                // Supprimer l'ancienne image
                if ($item->picture) {
                    $this->fileUploadService->deleteFile($item->picture);
                }

                // Upload sécurisé de la nouvelle image
                $picturePath = $this->fileUploadService->uploadImage(
                    $request->file('picture')
                );
            }

            // 🛡️ Gestion sécurisée de la vidéo
            $videoPath = $item->video;
            if ($request->hasFile('video')) {
                // Supprimer l'ancienne vidéo
                if ($item->video) {
                    $this->fileUploadService->deleteFile($item->video);
                }

                // Upload sécurisé de la nouvelle vidéo
                $videoPath = $this->fileUploadService->uploadVideo(
                    $request->file('video')
                );
            }

            $item->update([
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'description' => $request->description,
                'type' => $request->type,
                'picture' => $picturePath,
                'video' => $videoPath,
                'media_type' => $request->media_type ?? 'image', // Valeur par défaut si non fourni
                'category_id' => $request->category_id,
                'condition' => $request->condition,
                'value' => $request->value,
                'is_available' => true,
            ]);

            return redirect()->route('items.show', $item)
                ->with('success', 'Item modifié avec succès !');
        } catch (\InvalidArgumentException $e) {
            return back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     * 🛡️ SÉCURISÉ avec SecureFileUploadService
     */
    public function destroy(Item $item)
    {
        if ($item->user_id !== Auth::id()) {
            abort(403, 'Action non autorisée');
        }

        if ($item->loans()->whereIn('status', ['pending', 'approved', 'in_progress'])->exists()) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer un item avec des prêts en cours !');
        }

        // 🛡️ Supprimer les fichiers de manière sécurisée
        if ($item->picture) {
            $this->fileUploadService->deleteFile($item->picture);
        }

        if ($item->video) {
            $this->fileUploadService->deleteFile($item->video);
        }

        $item->delete();

        return redirect()->route('items.index')
            ->with('success', 'Item supprimé avec succès !');
    }

    /**
     * 🛡️ Afficher l'image d'un item de manière sécurisée
     * Les fichiers sont dans private/ donc pas accessibles directement
     */
    public function showPicture(Item $item)
    {
        if (!$item->picture) {
            abort(404, 'Image non trouvée');
        }

        // Normaliser les slashes pour Windows
        $path = str_replace('/', DIRECTORY_SEPARATOR, storage_path('app/' . $item->picture));

        if (!file_exists($path)) {
            abort(404, 'Fichier non trouvé');
        }

        // Retourner le fichier avec les bons headers
        return response()->file($path, [
            'Content-Type' => mime_content_type($path),
            'Cache-Control' => 'public, max-age=31536000', // Cache 1 an
        ]);
    }

    /**
     * 🛡️ Afficher la vidéo d'un item de manière sécurisée
     */
    public function showVideo(Item $item)
    {
        if (!$item->video) {
            abort(404, 'Vidéo non trouvée');
        }

        // Normaliser les slashes pour Windows
        $path = str_replace('/', DIRECTORY_SEPARATOR, storage_path('app/' . $item->video));

        if (!file_exists($path)) {
            abort(404, 'Fichier non trouvé');
        }

        // Retourner le fichier avec les bons headers
        return response()->file($path, [
            'Content-Type' => mime_content_type($path),
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
}
