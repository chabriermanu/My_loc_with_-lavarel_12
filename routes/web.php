<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ItemMediaController;
use App\Http\Controllers\ItemReviewController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\UserReviewController;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Routes Pucliques (sans auth)

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');
Route::get('items', [ItemController::class, 'index']);
Route::get('items/{item}', [ItemController::class, 'show']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{category}', [CategoryController::class, 'show']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Routes Categories
    Route::resource('categories', CategoryController::class)->except(['index', 'show']);

    // Routes Items
    Route::resource('items', ItemController::class)->except(['index', 'show']);

    // Routes Loans
    Route::resource('loans', LoanController::class)->only(['index', 'store', 'show']);

    // Routes personnalisées pour les actions sur les prêts
    Route::patch('loans/{loan}/approve', [LoanController::class, 'approve'])->name('loans.approve');
    Route::patch('loans/{loan}/reject', [LoanController::class, 'reject'])->name('loans.reject');
    Route::patch('loans/{loan}/complete', [LoanController::class, 'complete'])->name('loans.complete');
    Route::patch('loans/{loan}/cancel', [LoanController::class, 'cancel'])->name('loans.cancel');

    // Routes Favorites
    Route::get('favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('items/{item}/favorite', [FavoriteController::class, 'toggle'])->name('favorites.toggle');

    // Routes Comments
    Route::post('comments', [CommentController::class, 'store'])->name('comments.store');
    Route::patch('comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');

    //Routes ItemMedia
    Route::post('/items/{item}/media', [ItemMediaController::class, 'store'])->name('items.media.store');
    Route::delete('/media/{itemMedia}', [ItemMediaController::class, 'destroy'])->name('items.media.destroy');

    // Routes Item Reviews
    Route::post('item-reviews', [ItemReviewController::class, 'store'])->name('item-reviews.store');
    Route::patch('item-reviews/{itemReview}', [ItemReviewController::class, 'update'])->name('item-reviews.update');
    Route::delete('item-reviews/{itemReview}', [ItemReviewController::class, 'destroy'])->name('item-reviews.destroy');

    //Routes User Reviews
    Route::post('user-reviews', [UserReviewController::class, 'store'])->name('user-reviews.store');
    Route::patch('user-reviews/{userReview}', [UserReviewController::class, 'update'])->name('user-reviews.update');
    Route::delete('user-reviews/{userReview}', [UserReviewController::class, 'destroy'])->name('user-reviews.destroy');
});

require __DIR__ . '/settings.php';
