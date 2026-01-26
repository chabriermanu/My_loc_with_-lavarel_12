<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\LoanController;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Routes Categories
    Route::resource('categories', CategoryController::class);

    // Routes Items
    Route::resource('items', ItemController::class);

    // Routes Loans
    Route::resource('loans', LoanController::class)->only(['index', 'store', 'show']);

    // Routes personnalisées pour les actions sur les prêts
    Route::patch('loans/{loan}/approve', [LoanController::class, 'approve'])->name('loans.approve');
    Route::patch('loans/{loan}/reject', [LoanController::class, 'reject'])->name('loans.reject');
    Route::patch('loans/{loan}/complete', [LoanController::class, 'complete'])->name('loans.complete');
    Route::patch('loans/{loan}/cancel', [LoanController::class, 'cancel'])->name('loans.cancel');
});

require __DIR__ . '/settings.php';
