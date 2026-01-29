<?php

namespace App\Models;

use App\Traits\Likable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Auth;

class Comment extends Model
{
    use HasFactory;
    use Likable;

    protected $fillable = [
        'item_id',
        'user_id',
        'parent_id',
        'content',
    ];

    /**
     * Likes polymorphiques
     */
    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    /**
     * Le commentaire appartient à un item
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    /**
     * Le commentaire appartient à un utilisateur
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Commentaire parent (si réponse)
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    /**
     * Réponses du commentaire
     */
    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }
    protected $appends = ['is_liked'];
    protected $withCount = ['likes'];

    public function getIsLikedAttribute(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        return $this->likes()->where('user_id', Auth::id())->exists();
    }
}
