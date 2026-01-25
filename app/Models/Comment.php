<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [

        'item_id',
        'user_id',
        'parent_id',
        'content'

    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }
    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id');
    }
}
