<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Category;
use App\Models\Loan;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        return Inertia::render('Dashboard', [
            // Statistiques globales
            'totalItems' => Item::count(),
            'categoriesCount' => Category::count(),
            
            // Statistiques personnelles
            'myItemsCount' => Item::where('user_id', $userId)->count(),
            'myLoansCount' => Loan::where('owner_id', $userId)->count(),
            'myBorrowsCount' => Loan::where('borrower_id', $userId)->count(),
        ]);
    }
}