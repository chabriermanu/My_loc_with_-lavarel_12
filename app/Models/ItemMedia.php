<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemMedia extends Model
{
    use HasFactory;

    protected $fillable = [

        'item_id',
        'media_path',
        'media_type',
        'order',
    ];

    protected $casts = [

        'order' => 'integer',

    ];

    public function item(): BelongsTo

    {
        return $this->belongsTo(Item::class);
    }
}
