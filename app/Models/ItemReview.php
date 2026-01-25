<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemReview extends Model
{
    use HasFactory;

    protected $fillable = [

        'item_id',
        'user_id',
        'loan_id',
        'rating',
        'comment'

    ];

    protected $casts = [

        'rating' => 'integer'
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }
}
