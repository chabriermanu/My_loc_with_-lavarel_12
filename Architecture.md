# Guide d'implémentation - Système de Prêt avec Messagerie Interne
## My Loc 2.0

---

## 📋 Table des matières

1. Architecture de la base de données
2. Migrations Laravel
3. Models et Relations
4. Policies et Permissions
5. Controllers
6. Routes API
7. Messagerie interne
8. Frontend (exemples Vue.js)
9. Notifications
10. RGPD et Sécurité

---

## 1. Architecture de la base de données

### Schéma des tables

```
users
├── id
├── name
├── email
├── phone (nullable)
├── city (nullable)
├── postal_code (nullable)
├── latitude (nullable)
├── longitude (nullable)
├── created_at
└── updated_at

items
├── id
├── user_id (foreign → users)
├── category_id (foreign → categories)
├── name
├── description
├── available (boolean)
├── created_at
└── updated_at

loan_requests
├── id
├── item_id (foreign → items)
├── borrower_id (foreign → users)
├── lender_id (foreign → users)
├── status (enum: pending, accepted, refused, completed, cancelled)
├── start_date (nullable)
├── end_date (nullable)
├── accepted_at (nullable)
├── refused_at (nullable)
├── contact_requested (boolean, default: false)
├── contact_requested_at (nullable)
├── contact_shared (boolean, default: false)
├── contact_shared_at (nullable)
├── share_email (boolean, default: false)
├── share_phone (boolean, default: false)
├── share_address (boolean, default: false)
├── created_at
└── updated_at

messages
├── id
├── loan_request_id (foreign → loan_requests)
├── sender_id (foreign → users)
├── receiver_id (foreign → users)
├── content (text)
├── read_at (nullable)
├── created_at
└── updated_at

user_consents
├── id
├── user_id (foreign → users)
├── consent_type (string: geolocation, marketing, terms)
├── accepted (boolean)
├── accepted_at (nullable)
├── ip_address (nullable)
├── created_at
└── updated_at
```

---

## 2. Migrations Laravel

### Migration: Ajout colonnes localisation dans users

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('email');
            $table->string('city', 100)->nullable()->after('phone');
            $table->string('postal_code', 10)->nullable()->after('city');
            $table->decimal('latitude', 10, 7)->nullable()->after('postal_code');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone', 
                'city', 
                'postal_code', 
                'latitude', 
                'longitude'
            ]);
        });
    }
};
```

### Migration: Table loan_requests

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loan_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained()->onDelete('cascade');
            $table->foreignId('borrower_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('lender_id')->constrained('users')->onDelete('cascade');
            
            $table->enum('status', [
                'pending', 
                'accepted', 
                'refused', 
                'completed', 
                'cancelled'
            ])->default('pending');
            
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('refused_at')->nullable();
            
            // Partage de coordonnées
            $table->boolean('contact_requested')->default(false);
            $table->timestamp('contact_requested_at')->nullable();
            $table->boolean('contact_shared')->default(false);
            $table->timestamp('contact_shared_at')->nullable();
            
            // Choix de ce qui est partagé
            $table->boolean('share_email')->default(false);
            $table->boolean('share_phone')->default(false);
            $table->boolean('share_address')->default(false);
            
            $table->timestamps();
            
            // Index pour performance
            $table->index(['borrower_id', 'status']);
            $table->index(['lender_id', 'status']);
            $table->index('item_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loan_requests');
    }
};
```

### Migration: Table messages

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_request_id')->constrained()->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');
            $table->text('content');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            
            // Index pour performance
            $table->index(['loan_request_id', 'created_at']);
            $table->index(['receiver_id', 'read_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
```

### Migration: Table user_consents (RGPD)

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_consents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('consent_type'); // geolocation, marketing, terms
            $table->boolean('accepted');
            $table->timestamp('accepted_at')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->timestamps();
            
            // Un user ne peut avoir qu'un seul consentement par type
            $table->unique(['user_id', 'consent_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_consents');
    }
};
```

---

## 3. Models et Relations

### Model: User

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'city',
        'postal_code',
        'latitude',
        'longitude',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
        ];
    }

    // Relations
    public function items()
    {
        return $this->hasMany(Item::class);
    }

    public function loanRequestsAsBorrower()
    {
        return $this->hasMany(LoanRequest::class, 'borrower_id');
    }

    public function loanRequestsAsLender()
    {
        return $this->hasMany(LoanRequest::class, 'lender_id');
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

    // Accessors pour la localisation
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
        
        return trim(
            ($this->street_address ?? '') . ', ' . 
            $this->postal_code . ' ' . 
            $this->city
        );
    }

    // Vérifier si l'utilisateur a donné un consentement
    public function hasConsent(string $type): bool
    {
        return $this->consents()
            ->where('consent_type', $type)
            ->where('accepted', true)
            ->exists();
    }
}
```

### Model: LoanRequest

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LoanRequest extends Model
{
    protected $fillable = [
        'item_id',
        'borrower_id',
        'lender_id',
        'status',
        'start_date',
        'end_date',
        'accepted_at',
        'refused_at',
        'contact_requested',
        'contact_requested_at',
        'contact_shared',
        'contact_shared_at',
        'share_email',
        'share_phone',
        'share_address',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'accepted_at' => 'datetime',
            'refused_at' => 'datetime',
            'contact_requested_at' => 'datetime',
            'contact_shared_at' => 'datetime',
            'contact_requested' => 'boolean',
            'contact_shared' => 'boolean',
            'share_email' => 'boolean',
            'share_phone' => 'boolean',
            'share_address' => 'boolean',
        ];
    }

    // Relations
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function borrower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'borrower_id');
    }

    public function lender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lender_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeForUser($query, User $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('borrower_id', $user->id)
              ->orWhere('lender_id', $user->id);
        });
    }

    // Méthodes métier
    public function accept(): void
    {
        $this->update([
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);
    }

    public function refuse(): void
    {
        $this->update([
            'status' => 'refused',
            'refused_at' => now(),
        ]);
    }

    public function requestContact(): void
    {
        if ($this->status !== 'accepted') {
            throw new \Exception('Can only request contact for accepted loans');
        }

        $this->update([
            'contact_requested' => true,
            'contact_requested_at' => now(),
        ]);
    }

    public function shareContact(array $shareOptions): void
    {
        if (!$this->contact_requested) {
            throw new \Exception('Contact must be requested first');
        }

        $this->update([
            'contact_shared' => true,
            'contact_shared_at' => now(),
            'share_email' => $shareOptions['email'] ?? false,
            'share_phone' => $shareOptions['phone'] ?? false,
            'share_address' => $shareOptions['address'] ?? false,
        ]);
    }

    public function canViewContactInfo(User $user): bool
    {
        return $this->status === 'accepted' 
            && $this->contact_shared 
            && $this->borrower_id === $user->id;
    }

    public function getSharedContactInfo(): array
    {
        if (!$this->contact_shared) {
            return [];
        }

        $info = [];

        if ($this->share_email) {
            $info['email'] = $this->lender->email;
        }

        if ($this->share_phone && $this->lender->phone) {
            $info['phone'] = $this->lender->phone;
        }

        if ($this->share_address && $this->lender->full_address) {
            $info['address'] = $this->lender->full_address;
        }

        return $info;
    }
}
```

### Model: Message

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    protected $fillable = [
        'loan_request_id',
        'sender_id',
        'receiver_id',
        'content',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    // Relations
    public function loanRequest(): BelongsTo
    {
        return $this->belongsTo(LoanRequest::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    // Scopes
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

    public function scopeForConversation($query, int $loanRequestId)
    {
        return $query->where('loan_request_id', $loanRequestId)
                     ->orderBy('created_at', 'asc');
    }

    // Méthodes métier
    public function markAsRead(): void
    {
        if (!$this->read_at) {
            $this->update(['read_at' => now()]);
        }
    }

    public function isUnread(): bool
    {
        return $this->read_at === null;
    }
}
```

### Model: UserConsent

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserConsent extends Model
{
    protected $fillable = [
        'user_id',
        'consent_type',
        'accepted',
        'accepted_at',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'accepted' => 'boolean',
            'accepted_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

---

## 4. Policies et Permissions

### Policy: LoanRequestPolicy

```php
<?php

namespace App\Policies;

use App\Models\LoanRequest;
use App\Models\User;

class LoanRequestPolicy
{
    /**
     * Voir une demande de prêt
     */
    public function view(User $user, LoanRequest $loanRequest): bool
    {
        return $loanRequest->borrower_id === $user->id 
            || $loanRequest->lender_id === $user->id;
    }

    /**
     * Créer une demande de prêt
     */
    public function create(User $user): bool
    {
        // L'utilisateur ne peut pas emprunter son propre item (vérifié au niveau controller)
        return true;
    }

    /**
     * Accepter une demande
     */
    public function accept(User $user, LoanRequest $loanRequest): bool
    {
        return $loanRequest->lender_id === $user->id 
            && $loanRequest->status === 'pending';
    }

    /**
     * Refuser une demande
     */
    public function refuse(User $user, LoanRequest $loanRequest): bool
    {
        return $loanRequest->lender_id === $user->id 
            && $loanRequest->status === 'pending';
    }

    /**
     * Annuler une demande
     */
    public function cancel(User $user, LoanRequest $loanRequest): bool
    {
        return $loanRequest->borrower_id === $user->id 
            && $loanRequest->status === 'pending';
    }

    /**
     * Demander les coordonnées
     */
    public function requestContact(User $user, LoanRequest $loanRequest): bool
    {
        return $loanRequest->borrower_id === $user->id 
            && $loanRequest->status === 'accepted'
            && !$loanRequest->contact_requested;
    }

    /**
     * Partager les coordonnées
     */
    public function shareContact(User $user, LoanRequest $loanRequest): bool
    {
        return $loanRequest->lender_id === $user->id 
            && $loanRequest->contact_requested
            && !$loanRequest->contact_shared;
    }

    /**
     * Voir les coordonnées complètes
     */
    public function viewContactInfo(User $user, LoanRequest $loanRequest): bool
    {
        return $loanRequest->borrower_id === $user->id 
            && $loanRequest->status === 'accepted'
            && $loanRequest->contact_shared;
    }

    /**
     * Envoyer un message
     */
    public function sendMessage(User $user, LoanRequest $loanRequest): bool
    {
        return $loanRequest->borrower_id === $user->id 
            || $loanRequest->lender_id === $user->id;
    }
}
```

### Policy: MessagePolicy

```php
<?php

namespace App\Policies;

use App\Models\Message;
use App\Models\User;

class MessagePolicy
{
    /**
     * Voir un message
     */
    public function view(User $user, Message $message): bool
    {
        return $message->sender_id === $user->id 
            || $message->receiver_id === $user->id;
    }

    /**
     * Marquer comme lu
     */
    public function markAsRead(User $user, Message $message): bool
    {
        return $message->receiver_id === $user->id;
    }
}
```

---

## 5. Controllers

### Controller: LoanRequestController

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoanRequest;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class LoanRequestController extends Controller
{
    /**
     * Liste des demandes pour l'utilisateur connecté
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $loanRequests = LoanRequest::forUser($user)
            ->with(['item', 'borrower', 'lender'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($loanRequests);
    }

    /**
     * Créer une nouvelle demande de prêt
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'start_date' => 'nullable|date|after:today',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $item = Item::findOrFail($validated['item_id']);
        
        // Vérifier que l'utilisateur n'emprunte pas son propre item
        if ($item->user_id === $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas emprunter votre propre objet'
            ], 422);
        }

        // Vérifier que l'item est disponible
        if (!$item->available) {
            return response()->json([
                'message' => 'Cet objet n\'est plus disponible'
            ], 422);
        }

        // Vérifier qu'il n'y a pas déjà une demande en cours
        $existingRequest = LoanRequest::where('item_id', $item->id)
            ->where('borrower_id', $request->user()->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->first();

        if ($existingRequest) {
            return response()->json([
                'message' => 'Vous avez déjà une demande en cours pour cet objet'
            ], 422);
        }

        $loanRequest = LoanRequest::create([
            'item_id' => $item->id,
            'borrower_id' => $request->user()->id,
            'lender_id' => $item->user_id,
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
        ]);

        // TODO: Envoyer notification au prêteur

        return response()->json($loanRequest->load(['item', 'borrower']), 201);
    }

    /**
     * Voir une demande
     */
    public function show(LoanRequest $loanRequest): JsonResponse
    {
        Gate::authorize('view', $loanRequest);

        return response()->json(
            $loanRequest->load(['item', 'borrower', 'lender', 'messages'])
        );
    }

    /**
     * Accepter une demande
     */
    public function accept(LoanRequest $loanRequest): JsonResponse
    {
        Gate::authorize('accept', $loanRequest);

        $loanRequest->accept();

        // TODO: Envoyer notification à l'emprunteur

        return response()->json([
            'message' => 'Demande acceptée',
            'loan_request' => $loanRequest->fresh()
        ]);
    }

    /**
     * Refuser une demande
     */
    public function refuse(LoanRequest $loanRequest): JsonResponse
    {
        Gate::authorize('refuse', $loanRequest);

        $loanRequest->refuse();

        // TODO: Envoyer notification à l'emprunteur

        return response()->json([
            'message' => 'Demande refusée',
            'loan_request' => $loanRequest->fresh()
        ]);
    }

    /**
     * Annuler une demande (côté emprunteur)
     */
    public function cancel(LoanRequest $loanRequest): JsonResponse
    {
        Gate::authorize('cancel', $loanRequest);

        $loanRequest->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Demande annulée'
        ]);
    }

    /**
     * Demander les coordonnées
     */
    public function requestContact(LoanRequest $loanRequest): JsonResponse
    {
        Gate::authorize('requestContact', $loanRequest);

        $loanRequest->requestContact();

        // TODO: Envoyer notification au prêteur

        return response()->json([
            'message' => 'Demande de coordonnées envoyée',
            'loan_request' => $loanRequest->fresh()
        ]);
    }

    /**
     * Partager les coordonnées
     */
    public function shareContact(Request $request, LoanRequest $loanRequest): JsonResponse
    {
        Gate::authorize('shareContact', $loanRequest);

        $validated = $request->validate([
            'share_email' => 'required|boolean',
            'share_phone' => 'required|boolean',
            'share_address' => 'required|boolean',
        ]);

        // Au moins une info doit être partagée
        if (!$validated['share_email'] && !$validated['share_phone'] && !$validated['share_address']) {
            return response()->json([
                'message' => 'Vous devez partager au moins une information'
            ], 422);
        }

        $loanRequest->shareContact([
            'email' => $validated['share_email'],
            'phone' => $validated['share_phone'],
            'address' => $validated['share_address'],
        ]);

        // TODO: Envoyer notification à l'emprunteur

        return response()->json([
            'message' => 'Coordonnées partagées',
            'loan_request' => $loanRequest->fresh()
        ]);
    }

    /**
     * Voir les coordonnées partagées
     */
    public function viewContactInfo(LoanRequest $loanRequest): JsonResponse
    {
        Gate::authorize('viewContactInfo', $loanRequest);

        return response()->json([
            'contact_info' => $loanRequest->getSharedContactInfo()
        ]);
    }
}
```

### Controller: MessageController

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoanRequest;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class MessageController extends Controller
{
    /**
     * Liste des messages pour une conversation
     */
    public function index(LoanRequest $loanRequest): JsonResponse
    {
        Gate::authorize('view', $loanRequest);

        $messages = Message::forConversation($loanRequest->id)
            ->with(['sender', 'receiver'])
            ->get();

        // Marquer les messages non lus comme lus
        $messages->where('receiver_id', auth()->id())
                 ->where('read_at', null)
                 ->each->markAsRead();

        return response()->json($messages);
    }

    /**
     * Envoyer un message
     */
    public function store(Request $request, LoanRequest $loanRequest): JsonResponse
    {
        Gate::authorize('sendMessage', $loanRequest);

        $validated = $request->validate([
            'content' => 'required|string|max:2000',
        ]);

        $user = $request->user();
        
        // Déterminer le destinataire
        $receiverId = $loanRequest->borrower_id === $user->id 
            ? $loanRequest->lender_id 
            : $loanRequest->borrower_id;

        $message = Message::create([
            'loan_request_id' => $loanRequest->id,
            'sender_id' => $user->id,
            'receiver_id' => $receiverId,
            'content' => $validated['content'],
        ]);

        // TODO: Envoyer notification temps réel (Pusher/Echo)

        return response()->json($message->load(['sender', 'receiver']), 201);
    }

    /**
     * Marquer un message comme lu
     */
    public function markAsRead(Message $message): JsonResponse
    {
        Gate::authorize('markAsRead', $message);

        $message->markAsRead();

        return response()->json(['message' => 'Message marqué comme lu']);
    }

    /**
     * Nombre de messages non lus
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = Message::where('receiver_id', $request->user()->id)
            ->unread()
            ->count();

        return response()->json(['unread_count' => $count]);
    }
}
```

---

## 6. Routes API

### Fichier: routes/api.php

```php
<?php

use App\Http\Controllers\Api\LoanRequestController;
use App\Http\Controllers\Api\MessageController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    
    // Demandes de prêt
    Route::prefix('loan-requests')->group(function () {
        Route::get('/', [LoanRequestController::class, 'index']);
        Route::post('/', [LoanRequestController::class, 'store']);
        Route::get('/{loanRequest}', [LoanRequestController::class, 'show']);
        
        // Actions sur les demandes
        Route::post('/{loanRequest}/accept', [LoanRequestController::class, 'accept']);
        Route::post('/{loanRequest}/refuse', [LoanRequestController::class, 'refuse']);
        Route::post('/{loanRequest}/cancel', [LoanRequestController::class, 'cancel']);
        
        // Partage de coordonnées
        Route::post('/{loanRequest}/request-contact', [LoanRequestController::class, 'requestContact']);
        Route::post('/{loanRequest}/share-contact', [LoanRequestController::class, 'shareContact']);
        Route::get('/{loanRequest}/contact-info', [LoanRequestController::class, 'viewContactInfo']);
        
        // Messages
        Route::get('/{loanRequest}/messages', [MessageController::class, 'index']);
        Route::post('/{loanRequest}/messages', [MessageController::class, 'store']);
    });
    
    // Messages
    Route::prefix('messages')->group(function () {
        Route::get('/unread-count', [MessageController::class, 'unreadCount']);
        Route::post('/{message}/mark-as-read', [MessageController::class, 'markAsRead']);
    });
});
```

---

## 7. Messagerie interne - Implémentation Frontend

### Composant Vue.js: LoanRequestChat.vue

```vue
<template>
  <div class="chat-container">
    <!-- En-tête -->
    <div class="chat-header">
      <h3>Conversation avec {{ otherUser.name }}</h3>
      <span class="status-badge" :class="statusClass">
        {{ loanRequest.status }}
      </span>
    </div>

    <!-- Liste des messages -->
    <div class="messages-list" ref="messagesList">
      <div 
        v-for="message in messages" 
        :key="message.id"
        :class="['message', message.sender_id === currentUser.id ? 'sent' : 'received']"
      >
        <div class="message-avatar">
          {{ message.sender.name[0] }}
        </div>
        <div class="message-content">
          <div class="message-author">{{ message.sender.name }}</div>
          <div class="message-text">{{ message.content }}</div>
          <div class="message-time">
            {{ formatTime(message.created_at) }}
            <span v-if="message.sender_id === currentUser.id && message.read_at" class="read-indicator">
              ✓✓
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulaire d'envoi -->
    <form @submit.prevent="sendMessage" class="message-form">
      <textarea 
        v-model="newMessage"
        placeholder="Écrivez votre message..."
        rows="3"
        maxlength="2000"
        required
      ></textarea>
      <button type="submit" :disabled="!newMessage.trim() || sending">
        {{ sending ? 'Envoi...' : 'Envoyer' }}
      </button>
    </form>

    <!-- Zone de partage de coordonnées -->
    <div v-if="showContactSection" class="contact-section">
      <!-- Demande de coordonnées (emprunteur) -->
      <div v-if="canRequestContact" class="contact-request">
        <p>La demande a été acceptée ! Vous pouvez demander les coordonnées du prêteur.</p>
        <button @click="requestContact" :disabled="requesting">
          {{ requesting ? 'Envoi...' : 'Demander les coordonnées' }}
        </button>
      </div>

      <!-- Attente de partage (emprunteur) -->
      <div v-else-if="isWaitingForContact" class="contact-waiting">
        <p>⏳ Demande de coordonnées envoyée. En attente de la réponse du prêteur...</p>
      </div>

      <!-- Partage de coordonnées (prêteur) -->
      <div v-else-if="canShareContact" class="contact-share">
        <h4>L'emprunteur demande vos coordonnées</h4>
        <p>Choisissez les informations que vous souhaitez partager :</p>
        
        <div class="share-options">
          <label>
            <input type="checkbox" v-model="shareOptions.email">
            Email ({{ currentUser.email }})
          </label>
          <label v-if="currentUser.phone">
            <input type="checkbox" v-model="shareOptions.phone">
            Téléphone ({{ currentUser.phone }})
          </label>
          <label v-if="currentUser.full_address">
            <input type="checkbox" v-model="shareOptions.address">
            Adresse ({{ currentUser.full_address }})
          </label>
        </div>

        <button 
          @click="shareContact" 
          :disabled="!hasSelectedOption || sharing"
        >
          {{ sharing ? 'Envoi...' : 'Partager les coordonnées' }}
        </button>
      </div>

      <!-- Affichage des coordonnées (emprunteur) -->
      <div v-else-if="contactShared" class="contact-display">
        <h4>✅ Coordonnées du prêteur :</h4>
        <div v-if="contactInfo.email" class="contact-item">
          <strong>Email :</strong> 
          <a :href="`mailto:${contactInfo.email}`">{{ contactInfo.email }}</a>
        </div>
        <div v-if="contactInfo.phone" class="contact-item">
          <strong>Téléphone :</strong> 
          <a :href="`tel:${contactInfo.phone}`">{{ contactInfo.phone }}</a>
        </div>
        <div v-if="contactInfo.address" class="contact-item">
          <strong>Adresse :</strong> {{ contactInfo.address }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted, nextTick } from 'vue';

export default {
  name: 'LoanRequestChat',
  props: {
    loanRequestId: {
      type: Number,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const loanRequest = ref(null);
    const messages = ref([]);
    const newMessage = ref('');
    const sending = ref(false);
    const requesting = ref(false);
    const sharing = ref(false);
    const contactInfo = ref({});
    const shareOptions = ref({
      email: false,
      phone: false,
      address: false
    });
    const messagesList = ref(null);

    // Computed
    const otherUser = computed(() => {
      if (!loanRequest.value) return {};
      return loanRequest.value.borrower_id === props.currentUser.id
        ? loanRequest.value.lender
        : loanRequest.value.borrower;
    });

    const statusClass = computed(() => {
      const statusMap = {
        pending: 'status-pending',
        accepted: 'status-accepted',
        refused: 'status-refused',
        completed: 'status-completed'
      };
      return statusMap[loanRequest.value?.status] || '';
    });

    const showContactSection = computed(() => {
      return loanRequest.value?.status === 'accepted';
    });

    const canRequestContact = computed(() => {
      return loanRequest.value?.borrower_id === props.currentUser.id
        && loanRequest.value?.status === 'accepted'
        && !loanRequest.value?.contact_requested;
    });

    const isWaitingForContact = computed(() => {
      return loanRequest.value?.contact_requested 
        && !loanRequest.value?.contact_shared
        && loanRequest.value?.borrower_id === props.currentUser.id;
    });

    const canShareContact = computed(() => {
      return loanRequest.value?.lender_id === props.currentUser.id
        && loanRequest.value?.contact_requested
        && !loanRequest.value?.contact_shared;
    });

    const contactShared = computed(() => {
      return loanRequest.value?.contact_shared 
        && loanRequest.value?.borrower_id === props.currentUser.id;
    });

    const hasSelectedOption = computed(() => {
      return shareOptions.value.email 
        || shareOptions.value.phone 
        || shareOptions.value.address;
    });

    // Methods
    async function loadLoanRequest() {
      try {
        const response = await axios.get(`/api/loan-requests/${props.loanRequestId}`);
        loanRequest.value = response.data;
      } catch (error) {
        console.error('Erreur chargement demande:', error);
      }
    }

    async function loadMessages() {
      try {
        const response = await axios.get(`/api/loan-requests/${props.loanRequestId}/messages`);
        messages.value = response.data;
        await nextTick();
        scrollToBottom();
      } catch (error) {
        console.error('Erreur chargement messages:', error);
      }
    }

    async function sendMessage() {
      if (!newMessage.value.trim() || sending.value) return;

      sending.value = true;
      try {
        const response = await axios.post(
          `/api/loan-requests/${props.loanRequestId}/messages`,
          { content: newMessage.value }
        );
        messages.value.push(response.data);
        newMessage.value = '';
        await nextTick();
        scrollToBottom();
      } catch (error) {
        console.error('Erreur envoi message:', error);
        alert('Erreur lors de l\'envoi du message');
      } finally {
        sending.value = false;
      }
    }

    async function requestContact() {
      requesting.value = true;
      try {
        await axios.post(`/api/loan-requests/${props.loanRequestId}/request-contact`);
        await loadLoanRequest();
        alert('Demande de coordonnées envoyée !');
      } catch (error) {
        console.error('Erreur demande coordonnées:', error);
        alert('Erreur lors de la demande');
      } finally {
        requesting.value = false;
      }
    }

    async function shareContact() {
      if (!hasSelectedOption.value || sharing.value) return;

      sharing.value = true;
      try {
        await axios.post(
          `/api/loan-requests/${props.loanRequestId}/share-contact`,
          {
            share_email: shareOptions.value.email,
            share_phone: shareOptions.value.phone,
            share_address: shareOptions.value.address
          }
        );
        await loadLoanRequest();
        alert('Coordonnées partagées !');
      } catch (error) {
        console.error('Erreur partage coordonnées:', error);
        alert('Erreur lors du partage');
      } finally {
        sharing.value = false;
      }
    }

    async function loadContactInfo() {
      if (!contactShared.value) return;

      try {
        const response = await axios.get(
          `/api/loan-requests/${props.loanRequestId}/contact-info`
        );
        contactInfo.value = response.data.contact_info;
      } catch (error) {
        console.error('Erreur chargement coordonnées:', error);
      }
    }

    function scrollToBottom() {
      if (messagesList.value) {
        messagesList.value.scrollTop = messagesList.value.scrollHeight;
      }
    }

    function formatTime(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      
      if (diff < 60000) return 'À l\'instant';
      if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
      if (diff < 86400000) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }

    // Lifecycle
    onMounted(async () => {
      await loadLoanRequest();
      await loadMessages();
      if (contactShared.value) {
        await loadContactInfo();
      }
      
      // Polling pour nouveaux messages (à remplacer par WebSocket/Pusher en prod)
      setInterval(loadMessages, 10000);
    });

    return {
      loanRequest,
      messages,
      newMessage,
      sending,
      requesting,
      sharing,
      contactInfo,
      shareOptions,
      messagesList,
      otherUser,
      statusClass,
      showContactSection,
      canRequestContact,
      isWaitingForContact,
      canShareContact,
      contactShared,
      hasSelectedOption,
      sendMessage,
      requestContact,
      shareContact,
      formatTime
    };
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  padding: 1rem;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-pending { background: #fef3cd; color: #856404; }
.status-accepted { background: #d4edda; color: #155724; }
.status-refused { background: #f8d7da; color: #721c24; }
.status-completed { background: #d1ecf1; color: #0c5460; }

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #fafafa;
}

.message {
  display: flex;
  margin-bottom: 1rem;
  gap: 0.5rem;
}

.message.sent {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.message.sent .message-avatar {
  background: #28a745;
}

.message-content {
  max-width: 70%;
  background: white;
  padding: 0.75rem;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.message.sent .message-content {
  background: #dcf8c6;
}

.message-author {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.message-text {
  margin-bottom: 0.25rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-time {
  font-size: 0.75rem;
  color: #666;
  text-align: right;
}

.read-indicator {
  color: #4CAF50;
  margin-left: 0.25rem;
}

.message-form {
  padding: 1rem;
  background: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 0.5rem;
}

.message-form textarea {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  font-family: inherit;
}

.message-form button {
  padding: 0.5rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.message-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.contact-section {
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.contact-request,
.contact-waiting,
.contact-share,
.contact-display {
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.contact-request button,
.contact-share button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.share-options {
  margin: 1rem 0;
}

.share-options label {
  display: block;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.share-options input {
  margin-right: 0.5rem;
}

.contact-display h4 {
  color: #28a745;
  margin-bottom: 1rem;
}

.contact-item {
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.contact-item a {
  color: #007bff;
  text-decoration: none;
}

.contact-item a:hover {
  text-decoration: underline;
}
</style>
```

---

## 8. Notifications

### Notification: LoanRequestCreated

```php
<?php

namespace App\Notifications;

use App\Models\LoanRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\BroadcastMessage;

class LoanRequestCreated extends Notification
{
    use Queueable;

    public function __construct(
        public LoanRequest $loanRequest
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nouvelle demande de prêt')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line($this->loanRequest->borrower->name . ' souhaite emprunter votre objet : ' . $this->loanRequest->item->name)
            ->action('Voir la demande', url('/loan-requests/' . $this->loanRequest->id))
            ->line('Vous pouvez accepter ou refuser cette demande.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'loan_request_id' => $this->loanRequest->id,
            'borrower_name' => $this->loanRequest->borrower->name,
            'item_name' => $this->loanRequest->item->name,
            'type' => 'loan_request_created',
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'loan_request_id' => $this->loanRequest->id,
            'message' => $this->loanRequest->borrower->name . ' veut emprunter ' . $this->loanRequest->item->name,
        ]);
    }
}
```

### Notification: LoanRequestAccepted

```php
<?php

namespace App\Notifications;

use App\Models\LoanRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class LoanRequestAccepted extends Notification
{
    use Queueable;

    public function __construct(
        public LoanRequest $loanRequest
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Demande de prêt acceptée !')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line($this->loanRequest->lender->name . ' a accepté votre demande de prêt pour : ' . $this->loanRequest->item->name)
            ->line('Vous pouvez maintenant demander ses coordonnées pour organiser le prêt.')
            ->action('Voir les détails', url('/loan-requests/' . $this->loanRequest->id));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'loan_request_id' => $this->loanRequest->id,
            'lender_name' => $this->loanRequest->lender->name,
            'item_name' => $this->loanRequest->item->name,
            'type' => 'loan_request_accepted',
        ];
    }
}
```

---

## 9. RGPD et Sécurité

### Controller: UserDataController (Export RGPD)

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserDataController extends Controller
{
    /**
     * Exporter toutes les données de l'utilisateur
     */
    public function export(Request $request)
    {
        $user = $request->user();

        $data = [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'city' => $user->city,
                'postal_code' => $user->postal_code,
                'created_at' => $user->created_at,
            ],
            'items' => $user->items->map(fn($item) => [
                'name' => $item->name,
                'description' => $item->description,
                'category' => $item->category->name,
                'created_at' => $item->created_at,
            ]),
            'loan_requests_as_borrower' => $user->loanRequestsAsBorrower->map(fn($lr) => [
                'item' => $lr->item->name,
                'lender' => $lr->lender->name,
                'status' => $lr->status,
                'created_at' => $lr->created_at,
            ]),
            'loan_requests_as_lender' => $user->loanRequestsAsLender->map(fn($lr) => [
                'item' => $lr->item->name,
                'borrower' => $lr->borrower->name,
                'status' => $lr->status,
                'created_at' => $lr->created_at,
            ]),
            'messages' => $user->sentMessages->concat($user->receivedMessages)->map(fn($msg) => [
                'content' => $msg->content,
                'sender' => $msg->sender->name,
                'receiver' => $msg->receiver->name,
                'created_at' => $msg->created_at,
            ]),
            'consents' => $user->consents->map(fn($consent) => [
                'type' => $consent->consent_type,
                'accepted' => $consent->accepted,
                'accepted_at' => $consent->accepted_at,
            ]),
        ];

        // Générer le fichier JSON
        $filename = 'user_data_' . $user->id . '_' . now()->format('Y-m-d') . '.json';
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
        Storage::put('exports/' . $filename, $json);

        return response()->download(
            Storage::path('exports/' . $filename),
            $filename,
            ['Content-Type' => 'application/json']
        )->deleteFileAfterSend();
    }

    /**
     * Supprimer le compte et toutes les données
     */
    public function destroy(Request $request)
    {
        $user = $request->user();

        // Vérifier qu'il n'y a pas de prêts en cours
        $activeLoanRequests = $user->loanRequestsAsLender()
            ->whereIn('status', ['pending', 'accepted'])
            ->count();

        if ($activeLoanRequests > 0) {
            return response()->json([
                'message' => 'Vous avez des prêts en cours. Veuillez d\'abord les terminer.'
            ], 422);
        }

        // Anonymiser au lieu de supprimer (meilleure pratique RGPD)
        $user->update([
            'name' => 'Utilisateur supprimé',
            'email' => 'deleted_' . $user->id . '@example.com',
            'phone' => null,
            'city' => null,
            'postal_code' => null,
            'latitude' => null,
            'longitude' => null,
        ]);

        // Ou suppression complète (cascade configuré dans les migrations)
        // $user->delete();

        return response()->json([
            'message' => 'Votre compte a été supprimé avec succès.'
        ]);
    }
}
```

### Middleware: CheckGeolocationConsent

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckGeolocationConsent
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Vérifier que l'utilisateur a accepté le partage de localisation
        if (!$user->hasConsent('geolocation')) {
            return response()->json([
                'message' => 'Vous devez accepter le partage de localisation pour utiliser cette fonctionnalité.'
            ], 403);
        }

        return $next($request);
    }
}
```

---

## 10. Tests unitaires

### Test: LoanRequestTest

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Item;
use App\Models\LoanRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoanRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_loan_request()
    {
        $lender = User::factory()->create();
        $borrower = User::factory()->create();
        $item = Item::factory()->create(['user_id' => $lender->id]);

        $response = $this->actingAs($borrower)
            ->postJson('/api/loan-requests', [
                'item_id' => $item->id,
                'start_date' => now()->addDays(1)->toDateString(),
                'end_date' => now()->addDays(7)->toDateString(),
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('loan_requests', [
            'item_id' => $item->id,
            'borrower_id' => $borrower->id,
            'lender_id' => $lender->id,
            'status' => 'pending',
        ]);
    }

    public function test_user_cannot_borrow_own_item()
    {
        $user = User::factory()->create();
        $item = Item::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->postJson('/api/loan-requests', [
                'item_id' => $item->id,
            ]);

        $response->assertStatus(422);
    }

    public function test_lender_can_accept_loan_request()
    {
        $loanRequest = LoanRequest::factory()->create(['status' => 'pending']);

        $response = $this->actingAs($loanRequest->lender)
            ->postJson("/api/loan-requests/{$loanRequest->id}/accept");

        $response->assertStatus(200);
        $this->assertEquals('accepted', $loanRequest->fresh()->status);
    }

    public function test_borrower_can_request_contact_after_acceptance()
    {
        $loanRequest = LoanRequest::factory()->create(['status' => 'accepted']);

        $response = $this->actingAs($loanRequest->borrower)
            ->postJson("/api/loan-requests/{$loanRequest->id}/request-contact");

        $response->assertStatus(200);
        $this->assertTrue($loanRequest->fresh()->contact_requested);
    }

    public function test_lender_can_share_contact_info()
    {
        $loanRequest = LoanRequest::factory()->create([
            'status' => 'accepted',
            'contact_requested' => true,
        ]);

        $response = $this->actingAs($loanRequest->lender)
            ->postJson("/api/loan-requests/{$loanRequest->id}/share-contact", [
                'share_email' => true,
                'share_phone' => true,
                'share_address' => false,
            ]);

        $response->assertStatus(200);
        $loanRequest->refresh();
        
        $this->assertTrue($loanRequest->contact_shared);
        $this->assertTrue($loanRequest->share_email);
        $this->assertTrue($loanRequest->share_phone);
        $this->assertFalse($loanRequest->share_address);
    }
}
```

---

## Conclusion

Ce guide couvre l'intégralité du système de prêt avec messagerie pour My Loc 2.0 :

✅ Base de données avec double consentement
✅ Gestion des permissions granulaires
✅ Messagerie interne sécurisée
✅ Partage contrôlé des coordonnées
✅ Respect de la RGPD
✅ Tests unitaires
✅ Composants frontend Vue.js

**Prochaines étapes recommandées :**

1. Implémenter Laravel Scout + Meilisearch pour la recherche
2. Ajouter Laravel Socialite (Google, Facebook)
3. Configurer Laravel Echo + Pusher pour les notifications temps réel
4. Déployer avec Laravel Sail ou Docker personnalisé
5. Mettre en place les sauvegardes automatiques
6. Configurer un CDN pour les images

Bonne chance avec My Loc 2.0 ! 🚀