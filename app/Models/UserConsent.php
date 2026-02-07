<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserConsent extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'consent_type',
        'accepted',
        'accepted_at',
        'revoked_at',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'accepted' => 'boolean',
        'accepted_at' => 'datetime',
        'revoked_at' => 'datetime',
    ];

    // Relation avec User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes utiles
    public function scopeAccepted($query)
    {
        return $query->where('accepted', true)->whereNull('revoked_at');
    }

    public function scopeRevoked($query)
    {
        return $query->whereNotNull('revoked_at');
    }

    public function scopeOfType($query, string $type)
    {
        return $query->where('consent_type', $type);
    }
}
