<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Database\Eloquent\Casts\Attribute;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'pseudo',
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'avatar',
        'bio',
        'rating',
        'total_ratings',
        'is_admin'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];



    protected $appends = ['name'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'rating' => 'decimal:2',
            'total_ratings' => 'integer',
            'is_admin' => 'boolean',
        ];
    }

    protected function name(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->pseudo ?? ($this->first_name . ' ' . $this->last_name)
        );
    }

    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }
    public function ownedLoans(): HasMany
    {
        return $this->hasMany(Loan::class, 'owner_id');
    }
    public function borrowedLoans(): HasMany
    {
        return $this->hasMany(Loan::class, 'borrower_id');
    }
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }
    public function givenReviews(): HasMany
    {
        return $this->hasMany(UserReview::class, 'reviewer_id');
    }
    public function receivedReviews(): HasMany
    {
        return $this->hasMany(UserReview::class, 'reviewee_id');
    }
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function consents()
    {
        return $this->hasMany(UserConsent::class);
    }

    // Vérifier si l'utilisateur a donné un consentement
    public function hasConsent(string $type): bool
    {
        return $this->consents()
            ->where('consent_type', $type)
            ->where('accepted', true)
            ->exists();
    }

    // Accesseurs pour la localisation publique
    public function getPublicLocationAttribute(): string
    {
        if (!$this->city) {
            return 'Non renseignée';
        }

        $department = substr($this->postal_code ?? '', 0, 2);
        return $this->city . ($department ? " ({$department})" : '');
    }

    public function getFullAddressAttribute(): ?string
    {
        if (!$this->city || !$this->postal_code) {
            return null;
        }

        $parts = array_filter([
            $this->street_address ?? null,
            $this->postal_code,
            $this->city
        ]);

        return implode(', ', $parts);
    }
}
