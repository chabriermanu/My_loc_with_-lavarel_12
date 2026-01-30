<?php

use App\Http\Controllers\AdminCategoryController;
use App\Models\Item;
use App\Models\Category;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemMediaController;
use App\Http\Controllers\ItemReviewController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\UserReviewController;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// ============================================================
// ROUTES PUBLIQUES (sans paramètres dynamiques)
// ============================================================

Route::get('/', function () {
    // Items les mieux notés (pour le scroll horizontal)
    $topRatedItems = Item::with(['category', 'owner'])
        ->withCount(['likes', 'comments', 'favorites'])
        ->where('is_available', true)
        ->whereNotNull('rating')
        ->where('total_ratings', '>', 0)
        ->orderByDesc('rating')
        ->orderByDesc('total_ratings')
        ->take(12)
        ->get()
        ->map(function ($item) {
            $item->is_liked = Auth::check()
                ? $item->likes()->where('user_id', Auth::id())->exists()
                : false;
            $item->is_favorited = Auth::check()
                ? $item->favorites()->where('user_id', Auth::id())->exists()
                : false;
            return $item;
        });

    // Items récents (pour une autre section)
    $recentItems = Item::with(['category', 'owner'])
        ->withCount(['likes', 'comments', 'favorites'])
        ->where('is_available', true)
        ->latest()
        ->take(8)
        ->get()
        ->map(function ($item) {
            $item->is_liked = Auth::check()
                ? $item->likes()->where('user_id', Auth::id())->exists()
                : false;
            $item->is_favorited = Auth::check()
                ? $item->favorites()->where('user_id', Auth::id())->exists()
                : false;
            return $item;
        });

    // Catégories les plus vues (basées sur le nombre d'items)
    $popularCategories = Category::withCount('items')
        ->having('items_count', '>', 0)
        ->orderByDesc('items_count')
        ->take(8)
        ->get();

    return Inertia::render('Welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'topRatedItems' => $topRatedItems,
        'recentItems' => $recentItems,
        'popularCategories' => $popularCategories,
    ]);
})->name('home');

Route::get('items', [ItemController::class, 'index'])->name('items.index');
Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');

// ============================================================
// ROUTES PRIVÉES (authentification requise)
// ============================================================

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Mes Items
    Route::get('my-items', [ItemController::class, 'myItems'])->name('items.my');

    // ⚠️ ROUTES ITEMS (create/edit AVANT les routes avec {item})
    Route::get('items/create', [ItemController::class, 'create'])->name('items.create');
    Route::post('items', [ItemController::class, 'store'])->name('items.store');
    Route::get('items/{item}/edit', [ItemController::class, 'edit'])->name('items.edit');
    Route::put('items/{item}', [ItemController::class, 'update'])->name('items.update');
    Route::delete('items/{item}', [ItemController::class, 'destroy'])->name('items.destroy');

    // Routes Categories
    Route::resource('categories', CategoryController::class)->except(['index', 'show']);

    // Routes Loans
    Route::resource('loans', LoanController::class)->only(['index', 'store', 'show']);
    Route::patch('loans/{loan}/approve', [LoanController::class, 'approve'])->name('loans.approve');
    Route::patch('loans/{loan}/reject', [LoanController::class, 'reject'])->name('loans.reject');
    Route::patch('loans/{loan}/complete', [LoanController::class, 'complete'])->name('loans.complete');
    Route::patch('loans/{loan}/cancel', [LoanController::class, 'cancel'])->name('loans.cancel');

    // Routes Likes
    Route::post('/like/toggle', [LikeController::class, 'toggle'])->name('like.toggle');

    // Routes Favorites
    Route::get('favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('items/{item}/favorite', [FavoriteController::class, 'toggle'])->name('favorites.toggle');

    // Routes Comments
    Route::post('comments', [CommentController::class, 'store'])->name('comments.store');
    Route::patch('comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    // Routes ItemMedia
    Route::post('/items/{item}/media', [ItemMediaController::class, 'store'])->name('items.media.store');
    Route::delete('/media/{itemMedia}', [ItemMediaController::class, 'destroy'])->name('items.media.destroy');

    // Routes Item Reviews
    Route::post('item-reviews', [ItemReviewController::class, 'store'])->name('item-reviews.store');
    Route::patch('item-reviews/{itemReview}', [ItemReviewController::class, 'update'])->name('item-reviews.update');
    Route::delete('item-reviews/{itemReview}', [ItemReviewController::class, 'destroy'])->name('item-reviews.destroy');

    // Routes User Reviews
    Route::post('user-reviews', [UserReviewController::class, 'store'])->name('user-reviews.store');
    Route::patch('user-reviews/{userReview}', [UserReviewController::class, 'update'])->name('user-reviews.update');
    Route::delete('user-reviews/{userReview}', [UserReviewController::class, 'destroy'])->name('user-reviews.destroy');

    Route::middleware(['admin'])->name('admin.')->prefix('admin')->group(function () {
        Route::resource('categories', AdminCategoryController::class); // ✅ CORRECT
    });
});

// ============================================================
// ROUTES PUBLIQUES AVEC PARAMÈTRES DYNAMIQUES (À LA FIN !)
// ============================================================

// ⚠️ Ces routes DOIVENT être après items/create et items/{item}/edit
Route::get('items/{item}', [ItemController::class, 'show'])
    ->name('items.show')
    ->where('item', '[0-9]+'); // Accepte uniquement des chiffres

Route::get('categories/{category}', [CategoryController::class, 'show'])
    ->name('categories.show');

require __DIR__ . '/settings.php';
