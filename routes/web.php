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
use App\Http\Controllers\LocationController;
use App\Http\Controllers\UserReviewController;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Api\ConsentController;

// ============================================================
// ROUTES PUBLIQUES (sans paramètres dynamiques)
// ============================================================

Route::get('/', function () {
    // Items les plus favoris (pour le scroll horizontal)
    $topRatedItems = Item::with(['category', 'owner'])
        ->withCount(['likes', 'favorites', 'comments'])
        ->where('is_available', true)
        ->orderByDesc('favorites_count')
        ->orderByDesc('likes_count')
        ->take(20)
        ->get();

    // Items récents (pour une autre section)
    $recentItems = Item::with(['category', 'owner'])
        ->withCount(['likes', 'favorites', 'comments'])
        ->where('is_available', true)
        ->latest()
        ->take(8)
        ->get();

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

// Routes catégories par type (AVANT la route générique)
Route::get('categories/objets', [CategoryController::class, 'indexObjects'])->name('categories.objects');
Route::get('categories/services', [CategoryController::class, 'indexServices'])->name('categories.services');
Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');

// Routes RGPD - Pages légales
Route::get('/terms', function () {
    return Inertia::render('Legal/Terms');
})->name('terms');

Route::get('/privacy-policy', function () {
    return Inertia::render('Legal/PrivacyPolicy');
})->name('privacy-policy');

// ============================================================
// 🛡️ ROUTES SÉCURISÉES POUR SERVIR LES FICHIERS (NOUVEAU)
// ============================================================

// Servir les images d'items de manière sécurisée
Route::get('items/{item}/picture', [ItemController::class, 'showPicture'])
    ->name('items.picture')
    ->where('item', '[0-9]+');

// Servir les vidéos d'items de manière sécurisée
Route::get('items/{item}/video', [ItemController::class, 'showVideo'])
    ->name('items.video')
    ->where('item', '[0-9]+');

// Servir les médias additionnels de manière sécurisée
Route::get('media/{itemMedia}/file', [ItemMediaController::class, 'showFile'])
    ->name('media.file')
    ->where('itemMedia', '[0-9]+');

// ============================================================
// ROUTES PRIVÉES (authentification requise)
// ============================================================

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Mes Items
    Route::get('my-items', [ItemController::class, 'myItems'])->name('items.my');

    // ============================================================
    // ROUTES RGPD - CONSENTEMENTS
    // ============================================================
    Route::prefix('consents')->name('consents.')->group(function () {
        Route::get('/', [ConsentController::class, 'index'])->name('index');
        Route::post('/', [ConsentController::class, 'store'])->name('store');
        Route::get('/check/{consentType}', [ConsentController::class, 'check'])->name('check');
        Route::delete('/{consentType}', [ConsentController::class, 'revoke'])->name('revoke');
    });

    // Suppression des données personnelles (RGPD)
    Route::delete('/user/data', [ConsentController::class, 'deleteAllData'])->name('user.delete-data');

    // ROUTES ITEMS
    Route::get('items/create', [ItemController::class, 'create'])->name('items.create');

    // Routes avec uploads → Ajouter ThrottleUploads middleware
    Route::middleware([\App\Http\Middleware\ThrottleUploads::class])->group(function () {
        Route::post('items', [ItemController::class, 'store'])->name('items.store');
        Route::put('items/{item}', [ItemController::class, 'update'])->name('items.update');
        Route::post('/items/{item}/media', [ItemMediaController::class, 'store'])->name('items.media.store');
    });

    Route::get('items/{item}/edit', [ItemController::class, 'edit'])->name('items.edit');
    Route::delete('items/{item}', [ItemController::class, 'destroy'])->name('items.destroy');

    // Routes Categories
    Route::resource('categories', CategoryController::class)->except(['index', 'show']);

    // ============================================================
    // ROUTES LOANS
    // ============================================================
    Route::resource('loans', LoanController::class)->only(['create', 'store', 'show']);
    Route::get('borrows', [LoanController::class, 'borrows'])->name('loans.borrows');
    Route::get('lends', [LoanController::class, 'lends'])->name('loans.lends');

    // Actions sur les prêts
    Route::patch('loans/{loan}', [LoanController::class, 'update'])->name('loans.update');
    Route::patch('loans/{loan}/approve', [LoanController::class, 'approve'])->name('loans.approve');
    Route::patch('loans/{loan}/reject', [LoanController::class, 'reject'])->name('loans.reject');
    Route::patch('loans/{loan}/complete', [LoanController::class, 'complete'])->name('loans.complete');
    Route::patch('loans/{loan}/cancel', [LoanController::class, 'cancel'])->name('loans.cancel');

    // Partage de coordonnées
    Route::post('loans/{loan}/request-contact', [LoanController::class, 'requestContact'])->name('loans.request-contact');
    Route::post('loans/{loan}/share-contact', [LoanController::class, 'shareContact'])->name('loans.share-contact');
    Route::get('loans/{loan}/contact-info', [LoanController::class, 'viewContactInfo'])->name('loans.contact-info');

    // Messagerie
    Route::post('loans/{loan}/messages', [LoanController::class, 'sendMessage'])->name('loans.send-message');
    Route::get('messages/unread-count', [LoanController::class, 'unreadMessagesCount'])->name('messages.unread-count');

    // Routes Likes
    Route::post('/like/toggle', [LikeController::class, 'toggle'])->name('like.toggle');

    // Routes Favorites
    Route::get('favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('items/{item}/favorite', [FavoriteController::class, 'toggle'])->name('favorites.toggle');

    // Routes Comments
    Route::post('comments', [CommentController::class, 'store'])->name('comments.store');
    Route::patch('comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    // Routes ItemMedia - Suppression uniquement (pas d'upload)
    Route::delete('/media/{itemMedia}', [ItemMediaController::class, 'destroy'])->name('items.media.destroy');

    // Routes Item Reviews
    Route::post('item-reviews', [ItemReviewController::class, 'store'])->name('item-reviews.store');
    Route::patch('item-reviews/{itemReview}', [ItemReviewController::class, 'update'])->name('item-reviews.update');
    Route::delete('item-reviews/{itemReview}', [ItemReviewController::class, 'destroy'])->name('item-reviews.destroy');

    // Routes User Reviews
    Route::post('items/{item}/reviews', [ItemReviewController::class, 'store'])
        ->name('items.reviews.store');
    Route::patch('items/{item}/reviews/{itemReview}', [ItemReviewController::class, 'update'])->name('items.reviews.update');
    Route::delete('items/{item}/reviews/{itemReview}', [ItemReviewController::class, 'destroy'])->name('items.reviews.destroy');

    // ============================================================
    // ROUTES LOCATION
    // ============================================================
    Route::get('settings/location', [LocationController::class, 'edit'])->name('location.edit');
    Route::post('settings/location/search', [LocationController::class, 'searchCommunes'])->name('location.search-communes');
    Route::post('settings/location', [LocationController::class, 'update'])->name('location.update');
    Route::delete('settings/location', [LocationController::class, 'destroy'])->name('location.destroy');

    // Routes Admin
    Route::middleware(['admin'])->name('admin.')->prefix('admin')->group(function () {
        Route::resource('categories', AdminCategoryController::class);
    });
});

// ============================================================
// ROUTES PUBLIQUES AVEC PARAMÈTRES DYNAMIQUES (À LA FIN !)
// ============================================================

Route::get('items/{item}', [ItemController::class, 'show'])
    ->name('items.show')
    ->where('item', '[0-9]+');

Route::get('categories/{category}', [CategoryController::class, 'show'])
    ->name('categories.show')
    ->where('category', '[0-9]+');

require __DIR__ . '/settings.php';
