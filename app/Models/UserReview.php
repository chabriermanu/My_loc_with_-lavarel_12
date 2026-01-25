<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserReview extends Model
{
    use HasFactory;

    protected $fillable = [

        'reviewer_id',
        'reviewee_id',
        'loan_id',
        'type',
        'rating',
        'comment',
        'punctuality_rating',
        'communication_rating',
        'condition_respect_rating'
    ];

    protected $casts = [

        'rating' => 'integer',
        'punctuality_rating' => 'integer',
        'communication_rating' => 'integer',
        'condition_respect_rating' => 'integer'

    ];

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function reviewee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewee_id');
    }

    public function loan(): BelongsTo
    {
        return $this->belongsTo(Loan::class);
    }
}
