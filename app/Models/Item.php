<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    /** @use HasFactory<\Database\Factories\ItemFactory> */
    use HasFactory;

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
        'favorites_count',

    ];

    protected $casts = [

        "value" => "decimal:2",
        'rating' => "decimal:2",
        'is_available' => 'boolean',
        'total_ratings' => "integer",
        'views_count' => 'integer',
        'favorites_count' => 'integer'

    ];

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
}
