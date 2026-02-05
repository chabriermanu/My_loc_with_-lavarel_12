<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'owner_id',
        'borrower_id',
        'start_date',
        'start_time',
        'end_date',
        'end_time',
        'status',
        'returned_at',
        'notes',
        // Nouvelles colonnes
        'contact_requested',
        'contact_requested_at',
        'contact_shared',
        'contact_shared_at',
        'share_email',
        'share_phone',
        'share_address',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',

        // IMPORTANT : ne surtout pas caster en datetime
        'start_time' => 'string',
        'end_time' => 'string',

        'returned_at' => 'datetime',
        'contact_requested_at' => 'datetime',
        'contact_shared_at' => 'datetime',
        'contact_requested' => 'boolean',
        'contact_shared' => 'boolean',
        'share_email' => 'boolean',
        'share_phone' => 'boolean',
        'share_address' => 'boolean',
    ];


    // Relations existantes
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

    // NOUVELLE relation : messages
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    // ===== NOUVELLES MÉTHODES =====

    /**
     * L'emprunteur demande les coordonnées du propriétaire
     */
    public function requestContact(): void
    {
        if ($this->status !== 'approved' && $this->status !== 'in_progress') {
            throw new \Exception('Les coordonnées ne peuvent être demandées que pour un prêt approuvé ou en cours');
        }

        $this->update([
            'contact_requested' => true,
            'contact_requested_at' => now(),
        ]);
    }

    /**
     * Le propriétaire partage ses coordonnées
     */
    public function shareContact(array $shareOptions): void
    {
        if (!$this->contact_requested) {
            throw new \Exception('Les coordonnées doivent d\'abord être demandées');
        }

        $this->update([
            'contact_shared' => true,
            'contact_shared_at' => now(),
            'share_email' => $shareOptions['email'] ?? false,
            'share_phone' => $shareOptions['phone'] ?? false,
            'share_address' => $shareOptions['address'] ?? false,
        ]);
    }

    /**
     * Vérifier si l'utilisateur peut voir les coordonnées
     */
    public function canViewContactInfo(User $user): bool
    {
        return in_array($this->status, ['approved', 'in_progress', 'completed'])
            && $this->contact_shared
            && $this->borrower_id === $user->id;
    }

    /**
     * Récupérer les coordonnées partagées
     */
    public function getSharedContactInfo(): array
    {
        if (!$this->contact_shared) {
            return [];
        }

        $info = [];

        if ($this->share_email) {
            $info['email'] = $this->owner->email;
        }

        if ($this->share_phone && $this->owner->phone) {
            $info['phone'] = $this->owner->phone;
        }

        if ($this->share_address) {
            $address = [];
            if ($this->owner->street_address) $address[] = $this->owner->street_address;
            if ($this->owner->postal_code) $address[] = $this->owner->postal_code;
            if ($this->owner->city) $address[] = $this->owner->city;

            $info['address'] = implode(', ', array_filter($address));
        }

        return $info;
    }
}
