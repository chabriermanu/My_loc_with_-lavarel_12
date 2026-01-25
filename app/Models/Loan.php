<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Loan extends Model
{
    /** @use HasFactory<\Database\Factories\LoanFactory> */
    use HasFactory;

    protected $fillable = [

        'item_id',
        'owner_id',
        'borrower_id',
        'start_date',
        'end_date',
        'status',
        'returned_at',
        'notes'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'returned_at' => 'datetime'
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function borrower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'borrower_id');
    }

    public function userReviews(): HasMany
    {
        return $this->hasMany(UserReview::class);
    }
}
