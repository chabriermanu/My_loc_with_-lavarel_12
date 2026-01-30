<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier si l'utilisateur est connecté ET admin
        if (!$request->user() || !$request->user()->is_admin) {
            abort(403, 'Accès réservé aux administrateurs');
        }

        return $next($request);
    }
}
