<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Models\Comment;
use App\Models\Like;
use App\Traits\Likable;
use Illuminate\Support\Facades\Auth;

class Item extends Model
{
    use HasFactory;
    use Likable;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'picture',
        'video',
        'media_type',
        'user_id',
        'category_id',
        'condition',
        'value',
        'is_available',
        'rating',
        'total_ratings',
        'views_count',
        'type',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'rating' => 'decimal:2',
        'is_available' => 'boolean',
        'total_ratings' => 'integer',
        'views_count' => 'integer',
    ];

    // ✅ Ajouter automatiquement is_liked et is_favorited à chaque item
    protected $appends = ['is_liked', 'is_favorited'];

    // ============================================================
    // RELATIONS
    // ============================================================

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(ItemMedia::class);
    }

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ItemReview::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    // ============================================================
    // ACCESSEURS (ATTRIBUTS CALCULÉS)
    // ============================================================

    /**
     * Vérifier si l'utilisateur connecté a liké cet item
     */
    public function getIsLikedAttribute(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        return $this->likes()->where('user_id', Auth::id())->exists();
    }

    /**
     * Vérifier si l'utilisateur connecté a mis cet item en favori
     */
    public function getIsFavoritedAttribute(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        return $this->favorites()->where('user_id', Auth::id())->exists();
    }

    // ============================================================
    // SCOPES (FILTRES)
    // ============================================================

    /**
     * Filtrer uniquement les objets
     */
    public function scopeObjects($query)
    {
        return $query->where('type', 'object');
    }

    /**
     * Filtrer uniquement les services
     */
    public function scopeServices($query)
    {
        return $query->where('type', 'service');
    }

    /**
     * Filtrer les items disponibles
     */
    public function scopeAvailable($query)
    {
        return $query->where('is_available', true);
    }

    /**
     * Trier par popularité (nombre de favoris)
     */
    public function scopePopular($query)
    {
        return $query->withCount('favorites')
            ->orderBy('favorites_count', 'desc');
    }
}
