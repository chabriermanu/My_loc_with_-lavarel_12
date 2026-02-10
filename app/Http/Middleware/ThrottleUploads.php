<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class ThrottleUploads
{
    /**
     * Injection du rate limiter
     */
    public function __construct(
        private RateLimiter $limiter
    ) {}

    /**
     * Limiter les uploads pour éviter les abus
     * 
     * Règles:
     * - Max 10 uploads par heure par utilisateur
     * - S'applique uniquement aux requêtes avec fichiers
     * 
     * @param \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Ne s'applique que si la requête contient des fichiers
        if (!$request->hasFile('picture') && !$request->hasFile('video') && !$request->hasFile('media')) {
            return $next($request);
        }

        // Clé unique par utilisateur
        $key = 'upload:' . $request->user()->id;

        // Vérifier si l'utilisateur a dépassé la limite
        if ($this->limiter->tooManyAttempts($key, 10)) {
            $seconds = $this->limiter->availableIn($key);
            $minutes = ceil($seconds / 60);

            return back()
                ->with('error', "Trop d'uploads. Vous pourrez uploader à nouveau dans {$minutes} minute(s).")
                ->withInput();
        }

        // Incrémenter le compteur (expire dans 1 heure = 3600 secondes)
        $this->limiter->hit($key, 3600);

        return $next($request);
    }
}
