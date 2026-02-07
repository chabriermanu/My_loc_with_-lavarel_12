# 🏗️ Architecture MyLoc 2.0
## Plateforme de partage d'objets et services

---

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Stack technique](#stack-technique)
3. [Architecture de la base de données](#architecture-de-la-base-de-données)
4. [Structure du projet](#structure-du-projet)
5. [Modèles et Relations](#modèles-et-relations)
6. [Controllers et Routes](#controllers-et-routes)
7. [Frontend Inertia.js + React](#frontend-inertiajs--react)
8. [Services et Helpers](#services-et-helpers)
9. [Sécurité et RGPD](#sécurité-et-rgpd)
10. [Performance et Optimisations](#performance-et-optimisations)

---

## 1. Vue d'ensemble

### Concept

**MyLoc 2.0** est une plateforme hybride permettant aux utilisateurs de :
- 📦 Partager et emprunter des **objets** entre particuliers
- 🛠️ Proposer et réserver des **services**
- 📍 Géolocaliser les annonces avec calcul de distance
- 💬 Communiquer via un système de commentaires
- ⭐ Noter et favoriser les annonces
- 🔒 Respecter le RGPD avec consentement utilisateur

### Philosophie technique

- **SPA moderne** : Inertia.js pour le routing côté serveur avec expérience SPA
- **Type safety** : TypeScript pour réduire les erreurs
- **Component-based** : Architecture React modulaire et réutilisable
- **API-first** : Endpoints REST pour les actions asynchrones
- **RGPD compliant** : Système de consentement granulaire

---

## 2. Stack technique

### Backend

| Technologie | Version | Usage |
|------------|---------|-------|
| **Laravel** | 12 | Framework PHP principal |
| **PHP** | 8.2+ | Langage backend |
| **MySQL** | 8.0+ | Base de données relationnelle |
| **Laravel Fortify** | - | Authentification (login, register, 2FA) |
| **Inertia.js** | 1.x | Bridge Laravel ↔ React (SSR-like SPA) |
| **Laravel Sanctum** | - | API tokens pour requêtes asynchrones |

### Frontend

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 18 | Bibliothèque UI |
| **TypeScript** | 5 | Typage statique JavaScript |
| **Tailwind CSS** | 3 | Framework CSS utility-first |
| **shadcn/ui** | - | Composants UI pré-stylisés |
| **Lucide React** | - | Icônes SVG |
| **Vite** | 5 | Build tool et dev server |

### DevOps

| Outil | Usage |
|-------|-------|
| **Git** | Versioning |
| **Docker** | Containerisation (docker-compose.yaml) |
| **Composer** | Gestionnaire de dépendances PHP |
| **npm** | Gestionnaire de dépendances JS |
| **Laravel Pint** | Code style PHP (PSR-12) |
| **ESLint** | Linting TypeScript/React |

---

## 3. Architecture de la base de données

### Schéma des tables

```
┌─────────────────────────────────────────────────────────────┐
│                      USERS (Utilisateurs)                    │
├─────────────────────────────────────────────────────────────┤
│ id, name, email, password, email_verified_at                │
│ phone, city, postal_code, latitude, longitude               │
│ created_at, updated_at                                      │
└──────────────┬──────────────────────────────────────────────┘
               │
               ├───────────────────────────────────────┐
               │                                       │
               ▼                                       ▼
┌──────────────────────────┐              ┌─────────────────────────┐
│   ITEMS (Annonces)       │              │ USER_CONSENTS (RGPD)    │
├──────────────────────────┤              ├─────────────────────────┤
│ id, user_id (FK)         │              │ id, user_id (FK)        │
│ category_id (FK)         │              │ consent_type (enum)     │
│ name, description        │              │ accepted (bool)         │
│ condition, type          │              │ accepted_at, revoked_at │
│ available (bool)         │              │ ip_address              │
│ favorites_count          │              │ created_at, updated_at  │
│ latitude, longitude      │              └─────────────────────────┘
│ created_at, updated_at   │
└──────┬───────────────────┘
       │
       ├──────────────┬──────────────┬──────────────┐
       │              │              │              │
       ▼              ▼              ▼              ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────────┐
│ ITEM_MEDIA  │ │ COMMENTS │ │FAVORITES │ │ ITEM_REVIEWS    │
├─────────────┤ ├──────────┤ ├──────────┤ ├─────────────────┤
│ id          │ │ id       │ │ id       │ │ id              │
│ item_id(FK) │ │ item_id  │ │ user_id  │ │ item_id (FK)    │
│ file_path   │ │ user_id  │ │ item_id  │ │ user_id (FK)    │
│ type (enum) │ │ parent_id│ │ created  │ │ rating (1-5)    │
│ order       │ │ content  │ └──────────┘ │ comment         │
└─────────────┘ │ created  │              │ created_at      │
                └──────────┘              └─────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              CATEGORIES (77 catégories)                      │
├─────────────────────────────────────────────────────────────┤
│ id, parent_id, name, slug, icon, type                       │
│ popularity_score, view_count, created_at, updated_at        │
└──────────────┬──────────────────────────────────────────────┘
               │
               └──► ITEMS.category_id (FK)

┌─────────────────────────────────────────────────────────────┐
│           LOANS (Demandes de prêt/réservation)              │
├─────────────────────────────────────────────────────────────┤
│ id, item_id (FK), borrower_id (FK), lender_id (FK)         │
│ status (enum: pending, accepted, refused, completed)        │
│ start_date, end_date                                        │
│ accepted_at, refused_at, completed_at, cancelled_at         │
│ contact_requested (bool), contact_requested_at              │
│ contact_shared (bool), contact_shared_at                    │
│ share_email, share_phone, share_address (bool)              │
│ created_at, updated_at                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    MESSAGES (Messagerie)                     │
├─────────────────────────────────────────────────────────────┤
│ id, loan_id (FK), sender_id (FK), receiver_id (FK)         │
│ content (text), read_at (nullable)                          │
│ created_at, updated_at                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              USER_REVIEWS (Avis utilisateurs)                │
├─────────────────────────────────────────────────────────────┤
│ id, reviewer_id (FK), reviewed_id (FK)                      │
│ loan_id (FK), role (as_owner / as_borrower)                 │
│ communication_rating (1-5)                                   │
│ punctuality_rating (1-5)                                     │
│ respect_rating (1-5)                                         │
│ overall_rating (1-5)                                         │
│ comment (text)                                               │
│ created_at, updated_at                                      │
└─────────────────────────────────────────────────────────────┘
```

### Relations principales

```
User (1) ──────── (*) Items
User (1) ──────── (*) Favorites
User (1) ──────── (*) Comments
User (1) ──────── (*) UserConsents
User (1) ──────── (*) Loans (as borrower)
User (1) ──────── (*) Loans (as lender)

Item (1) ──────── (*) ItemMedia
Item (1) ──────── (*) Comments
Item (1) ──────── (*) Favorites
Item (1) ──────── (*) ItemReviews
Item (1) ──────── (*) Loans
Item (*) ──────── (1) Category

Category (1) ──── (*) Items
Category (1) ──── (*) Categories (self-reference parent/enfant)

Loan (1) ──────── (*) Messages

Comment (1) ───── (*) Comments (self-reference parent/réponse)
```

---

## 4. Structure du projet

```
My_loc_with_-lavarel_12/
│
├── app/
│   ├── Console/
│   │   └── Commands/
│   │       └── GeolocateExistingUsers.php       # Commande Artisan géoloc
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── CategoryController.php           # CRUD catégories (admin)
│   │   │   ├── ItemController.php               # CRUD items
│   │   │   ├── LoanController.php               # Gestion prêts
│   │   │   ├── FavoriteController.php           # Toggle favoris
│   │   │   ├── CommentController.php            # CRUD commentaires
│   │   │   ├── ItemMediaController.php          # Upload médias
│   │   │   ├── ItemReviewController.php         # Avis items
│   │   │   ├── UserReviewController.php         # Avis utilisateurs
│   │   │   ├── LocationController.php           # Géoloc utilisateur
│   │   │   └── Api/
│   │   │       └── ConsentController.php        # API consentement RGPD
│   │   │
│   │   ├── Middleware/
│   │   │   ├── HandleInertiaRequests.php        # Props globales Inertia
│   │   │   └── CheckGeolocationConsent.php      # Vérif consentement
│   │   │
│   │   └── Requests/
│   │       ├── StoreCategoryRequest.php
│   │       ├── StoreItemRequest.php
│   │       ├── StoreLoanRequest.php
│   │       ├── StoreCommentRequest.php
│   │       └── ... (14 Form Requests total)
│   │
│   ├── Models/
│   │   ├── User.php                             # + géolocalisation
│   │   ├── Item.php                             # + popularité
│   │   ├── Category.php                         # + hiérarchie
│   │   ├── Loan.php                             # + partage contact
│   │   ├── Favorite.php
│   │   ├── Comment.php                          # + réponses imbriquées
│   │   ├── ItemMedia.php
│   │   ├── ItemReview.php
│   │   ├── UserReview.php                       # + 4 critères
│   │   ├── UserConsent.php                      # RGPD
│   │   └── Message.php
│   │
│   ├── Policies/
│   │   ├── ItemPolicy.php
│   │   ├── LoanPolicy.php
│   │   ├── CommentPolicy.php
│   │   └── MessagePolicy.php
│   │
│   ├── Services/
│   │   └── GeocodingService.php                 # Service géocodage externe
│   │
│   └── Actions/
│       └── Fortify/
│           └── CreateNewUser.php                # + géoloc auto à l'inscription
│
├── database/
│   ├── migrations/
│   │   ├── 2014_10_12_000000_create_users_table.php
│   │   ├── 2024_xx_xx_create_categories_table.php
│   │   ├── 2024_xx_xx_create_items_table.php
│   │   ├── 2024_xx_xx_create_loans_table.php
│   │   ├── 2024_xx_xx_create_favorites_table.php
│   │   ├── 2024_xx_xx_create_comments_table.php
│   │   ├── 2024_xx_xx_create_item_media_table.php
│   │   ├── 2024_xx_xx_create_item_reviews_table.php
│   │   ├── 2024_xx_xx_create_user_reviews_table.php
│   │   ├── 2026_02_02_create_user_consents_table.php
│   │   └── 2026_02_06_add_revoked_at_to_user_consents_table.php
│   │
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── CategorySeeder.php                   # 77 catégories
│   │   ├── UserSeeder.php
│   │   └── ItemSeeder.php
│   │
│   └── factories/
│       ├── UserFactory.php
│       ├── ItemFactory.php
│       └── LoanFactory.php
│
├── resources/
│   ├── js/
│   │   ├── app.tsx                              # Point d'entrée React
│   │   │
│   │   ├── Pages/                               # Pages Inertia
│   │   │   ├── Welcome.tsx                      # Page d'accueil
│   │   │   ├── Dashboard.tsx
│   │   │   │
│   │   │   ├── Items/
│   │   │   │   ├── Index.tsx                    # Liste items (public)
│   │   │   │   ├── Show.tsx                     # Détails item (public)
│   │   │   │   ├── Create.tsx                   # Créer item (privé)
│   │   │   │   └── Edit.tsx                     # Éditer item (privé)
│   │   │   │
│   │   │   ├── Categories/
│   │   │   │   ├── Index.tsx                    # Grille catégories (public)
│   │   │   │   ├── Show.tsx                     # Items par catégorie (public)
│   │   │   │   ├── Create.tsx                   # Admin uniquement
│   │   │   │   └── Edit.tsx                     # Admin uniquement
│   │   │   │
│   │   │   ├── Loans/
│   │   │   │   ├── Index.tsx                    # Mes prêts (onglets)
│   │   │   │   └── Show.tsx                     # Détails prêt + messagerie
│   │   │   │
│   │   │   ├── Favorites/
│   │   │   │   └── Index.tsx                    # Mes favoris
│   │   │   │
│   │   │   ├── Legal/
│   │   │   │   ├── PrivacyPolicy.tsx            # Politique confidentialité
│   │   │   │   └── Terms.tsx                    # CGU
│   │   │   │
│   │   │   └── settings/
│   │   │       └── Location.tsx                 # Gestion localisation
│   │   │
│   │   ├── components/
│   │   │   ├── Items/
│   │   │   │   ├── ItemCard.tsx                 # Carte item (réutilisable)
│   │   │   │   └── ItemMediaCarousel.tsx        # Galerie photos/vidéos
│   │   │   │
│   │   │   ├── Consent/
│   │   │   │   └── FirstLoginConsentModal.tsx   # Modale RGPD
│   │   │   │
│   │   │   └── ui/                              # Composants shadcn/ui
│   │   │       ├── button.tsx
│   │   │       ├── input.tsx
│   │   │       ├── card.tsx
│   │   │       └── ... (25+ composants)
│   │   │
│   │   ├── layouts/
│   │   │   └── app-layout.tsx                   # Layout principal (navbar, footer)
│   │   │
│   │   ├── types/
│   │   │   ├── model.ts                         # Types TypeScript des modèles
│   │   │   └── index.d.ts                       # Types globaux
│   │   │
│   │   └── lib/
│   │       └── utils.ts                         # Helpers (cn, formatDate...)
│   │
│   └── views/
│       └── app.blade.php                        # Template racine Inertia
│
├── routes/
│   ├── web.php                                  # Routes Inertia (SSR-like)
│   └── api.php                                  # Routes API (async requests)
│
├── public/
│   └── storage/                                 # Symlink vers storage/app/public
│       └── items/                               # Photos items
│
├── storage/
│   └── app/
│       └── public/
│           └── items/                           # Stockage photos
│
├── tests/
│   ├── Feature/
│   │   ├── ItemTest.php
│   │   ├── LoanTest.php
│   │   └── AuthTest.php
│   └── Unit/
│       ├── GeocodingServiceTest.php
│       └── UserConsentTest.php
│
├── .env.example                                 # Variables d'environnement
├── composer.json                                # Dépendances PHP
├── package.json                                 # Dépendances JS
├── docker-compose.yaml                          # Configuration Docker
├── vite.config.ts                               # Configuration Vite
├── tsconfig.json                                # Configuration TypeScript
├── tailwind.config.js                           # Configuration Tailwind
├── README.md                                    # Documentation projet
├── ROADMAP.md                                   # Plan de développement
└── Architecture.md                              # Ce fichier
```

---

## 5. Modèles et Relations

### User (Utilisateur)

```php
class User extends Authenticatable
{
    // Relations
    public function items() // Items créés
    public function favorites() // Items favoris
    public function comments() // Commentaires postés
    public function consents() // Consentements RGPD
    public function loanRequestsAsBorrower() // Prêts empruntés
    public function loanRequestsAsLender() // Prêts prêtés
    public function sentMessages() // Messages envoyés
    public function receivedMessages() // Messages reçus
    public function reviewsGiven() // Avis donnés
    public function reviewsReceived() // Avis reçus
    
    // Accessors
    public function getPublicLocationAttribute(): string // "Montpellier (34)"
    public function getFullAddressAttribute(): ?string // Adresse complète
    
    // Méthodes
    public function hasConsent(string $type): bool
}
```

### Item (Annonce)

```php
class Item extends Model
{
    // Relations
    public function owner() // Propriétaire (User)
    public function category() // Catégorie
    public function media() // Photos/vidéos
    public function comments() // Commentaires
    public function favorites() // Favoris (pivot)
    public function reviews() // Avis
    public function loans() // Prêts
    
    // Scopes
    public function scopeAvailable($query) // Disponibles
    public function scopeNearby($query, $lat, $lng, $radius) // À proximité
    public function scopeWithinDistance($query, User $user, int $maxKm)
    
    // Méthodes
    public function isFavoritedBy(User $user): bool
    public function getDistanceFrom(float $lat, float $lng): float // km
    public function incrementPopularity(): void
}
```

### Category (Catégorie)

```php
class Category extends Model
{
    // Relations
    public function parent() // Catégorie parente
    public function children() // Sous-catégories
    public function items() // Items de cette catégorie
    
    // Scopes
    public function scopeParents($query) // Catégories racines
    public function scopePopular($query) // Par popularité
    
    // Méthodes
    public function isParent(): bool
    public function hasChildren(): bool
}
```

### Loan (Prêt/Réservation)

```php
class Loan extends Model
{
    // Relations
    public function item() // Item emprunté
    public function borrower() // Emprunteur (User)
    public function lender() // Prêteur (User)
    public function messages() // Messagerie interne
    
    // Scopes
    public function scopePending($query)
    public function scopeAccepted($query)
    public function scopeForUser($query, User $user)
    
    // Méthodes
    public function accept(): void
    public function refuse(): void
    public function complete(): void
    public function cancel(): void
    public function requestContact(): void
    public function shareContact(array $options): void
    public function canViewContactInfo(User $user): bool
    public function getSharedContactInfo(): array
}
```

### UserConsent (Consentement RGPD)

```php
class UserConsent extends Model
{
    // Types de consentement
    const TYPE_GEOLOCATION = 'geolocation';
    const TYPE_MARKETING = 'marketing';
    const TYPE_TERMS = 'terms';
    
    // Relations
    public function user()
    
    // Méthodes
    public function isActive(): bool
    public function revoke(): void
}
```

---

## 6. Controllers et Routes

### Inertia Routes (SSR-like SPA)

```php
// routes/web.php

// Pages publiques (sans auth)
Route::get('/', [WelcomeController::class, 'index'])->name('welcome');
Route::get('/items', [ItemController::class, 'index'])->name('items.index');
Route::get('/items/{item}', [ItemController::class, 'show'])->name('items.show');
Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
Route::get('/legal/privacy', [LegalController::class, 'privacy'])->name('legal.privacy');
Route::get('/legal/terms', [LegalController::class, 'terms'])->name('legal.terms');

// Pages privées (auth required)
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Items (CRUD)
    Route::get('/items/create', [ItemController::class, 'create'])->name('items.create');
    Route::post('/items', [ItemController::class, 'store'])->name('items.store');
    Route::get('/items/{item}/edit', [ItemController::class, 'edit'])->name('items.edit');
    Route::put('/items/{item}', [ItemController::class, 'update'])->name('items.update');
    Route::delete('/items/{item}', [ItemController::class, 'destroy'])->name('items.destroy');
    
    // Favoris
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites.index');
    Route::post('/favorites/toggle', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
    
    // Prêts
    Route::get('/loans', [LoanController::class, 'index'])->name('loans.index');
    Route::post('/loans', [LoanController::class, 'store'])->name('loans.store');
    Route::get('/loans/{loan}', [LoanController::class, 'show'])->name('loans.show');
    Route::post('/loans/{loan}/approve', [LoanController::class, 'approve'])->name('loans.approve');
    Route::post('/loans/{loan}/reject', [LoanController::class, 'reject'])->name('loans.reject');
    Route::post('/loans/{loan}/complete', [LoanController::class, 'complete'])->name('loans.complete');
    Route::post('/loans/{loan}/cancel', [LoanController::class, 'cancel'])->name('loans.cancel');
    
    // Commentaires
    Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::put('/comments/{comment}', [CommentController::class, 'update'])->name('comments.update');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    
    // Localisation
    Route::get('/settings/location', [LocationController::class, 'edit'])->name('settings.location');
    Route::put('/settings/location', [LocationController::class, 'update'])->name('settings.location.update');
    
    // Admin uniquement
    Route::middleware('admin')->group(function () {
        Route::resource('categories', CategoryController::class)->except(['index', 'show']);
    });
});
```

### API Routes (requêtes asynchrones)

```php
// routes/api.php

Route::middleware('auth:sanctum')->group(function () {
    // Consentement RGPD
    Route::post('/consent', [ConsentController::class, 'store']);
    Route::post('/consent/revoke', [ConsentController::class, 'revoke']);
    
    // Messagerie (si implémentée)
    Route::get('/loans/{loan}/messages', [MessageController::class, 'index']);
    Route::post('/loans/{loan}/messages', [MessageController::class, 'store']);
    Route::get('/messages/unread-count', [MessageController::class, 'unreadCount']);
});
```

---

## 7. Frontend Inertia.js + React

### Principe Inertia.js

**Inertia.js** permet de créer des SPAs sans API REST classique :
- Le serveur Laravel renvoie des **props** (données) au lieu de JSON
- Le routage reste **côté serveur** (routes/web.php)
- React consomme les props via le hook `usePage()`
- Navigation sans rechargement avec `router.visit()` ou `<Link>`

### Flux de données

```
┌──────────────┐
│  User click  │
└──────┬───────┘
       │
       ▼
┌────────────────────────────┐
│  <Link href="/items/123">  │  ◄─── Composant React
└────────────┬───────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│  Inertia.js intercepte + envoie requête XHR  │
└────────────┬─────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│  Route Laravel: /items/{item}            │
│  ItemController@show                      │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│  return Inertia::render('Items/Show', [  │
│      'item' => $item,                     │
│      'comments' => $comments,             │
│  ]);                                      │
└────────────┬─────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────┐
│  React reçoit les props et re-render     │
│  Sans rechargement de page !             │
└──────────────────────────────────────────┘
```

### Exemple de page Inertia

```tsx
// resources/js/Pages/Items/Show.tsx

import { Head, Link, router } from '@inertiajs/react';
import { Item, User, Comment } from '@/types/model';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

interface Props {
    item: Item & { owner: User };
    comments: Comment[];
    auth: { user: User | null };
}

export default function Show({ item, comments, auth }: Props) {
    const handleBorrow = () => {
        router.post('/loans', { item_id: item.id });
    };

    return (
        <AppLayout>
            <Head title={item.name} />
            
            <div className="max-w-7xl mx-auto py-6">
                <h1 className="text-3xl font-bold">{item.name}</h1>
                <p>{item.description}</p>
                
                {auth.user && auth.user.id !== item.owner.id && (
                    <Button onClick={handleBorrow}>
                        Demander à emprunter
                    </Button>
                )}
                
                {/* Liste des commentaires */}
                <div className="mt-8">
                    {comments.map(comment => (
                        <div key={comment.id}>{comment.content}</div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
```

### Props globales (middleware)

```php
// app/Http/Middleware/HandleInertiaRequests.php

public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user(),
        ],
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
        ],
        'unreadMessagesCount' => fn () => $request->user()?->unreadMessages()->count() ?? 0,
    ];
}
```

### Formulaires Inertia

```tsx
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
});

const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/items');
};

return (
    <form onSubmit={submit}>
        <input 
            value={data.name}
            onChange={e => setData('name', e.target.value)}
        />
        {errors.name && <span>{errors.name}</span>}
        
        <button disabled={processing}>Créer</button>
    </form>
);
```

---

## 8. Services et Helpers

### GeocodingService

```php
// app/Services/GeocodingService.php

class GeocodingService
{
    public function geocode(string $address): ?array
    {
        // API externe (OpenStreetMap Nominatim, Google Maps, etc.)
        // Retourne ['latitude' => float, 'longitude' => float]
    }
    
    public function getDistanceBetween(
        float $lat1, float $lng1,
        float $lat2, float $lng2
    ): float {
        // Formule Haversine pour distance en km
    }
}
```

### Helpers frontend

```typescript
// resources/js/lib/utils.ts

export function formatDistance(km: number): string {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR');
}

export function cn(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}
```

---

## 9. Sécurité et RGPD

### Système de consentement

1. **Modale au premier login** : `FirstLoginConsentModal.tsx`
2. **Enregistrement** : API `/api/consent`
3. **Révocation** : Page settings + `/api/consent/revoke`
4. **Vérification** : Middleware `CheckGeolocationConsent`

### Partage de coordonnées

Flux pour un prêt accepté :
1. Emprunteur demande contact → `loan.contact_requested = true`
2. Prêteur choisit quoi partager (email/phone/adresse)
3. Prêteur confirme → `loan.contact_shared = true`
4. Emprunteur accède aux infos via `loan.getSharedContactInfo()`

### Policies

```php
// app/Policies/ItemPolicy.php

public function update(User $user, Item $item): bool
{
    return $user->id === $item->user_id;
}

public function delete(User $user, Item $item): bool
{
    // Vérifier qu'il n'y a pas de prêts en cours
    return $user->id === $item->user_id 
        && !$item->loans()->whereIn('status', ['pending', 'accepted'])->exists();
}
```

---

## 10. Performance et Optimisations

### Eager loading (N+1 queries)

```php
// ❌ N+1 problème
$items = Item::all();
foreach ($items as $item) {
    echo $item->owner->name; // 1 requête par item !
}

// ✅ Solution
$items = Item::with('owner', 'category')->get();
```

### Pagination Inertia

```php
return Inertia::render('Items/Index', [
    'items' => Item::with('owner')
        ->latest()
        ->paginate(12)
        ->through(fn($item) => [
            'id' => $item->id,
            'name' => $item->name,
            // ... seulement les champs nécessaires
        ]),
]);
```

### Cache des catégories

```php
$categories = Cache::remember('categories.all', 3600, function () {
    return Category::with('children')->whereNull('parent_id')->get();
});
```

### Images optimisées

- **Intervention Image** pour resize automatique
- **Lazy loading** avec `loading="lazy"` sur `<img>`
- **WebP conversion** pour poids réduit

---

## Conclusion

Cette architecture combine :
- ✅ **SPA moderne** avec Inertia.js (pas de duplication backend/frontend)
- ✅ **Type safety** avec TypeScript
- ✅ **Performance** avec eager loading et pagination
- ✅ **Sécurité** avec Policies et RGPD
- ✅ **UX fluide** sans rechargement de page

**Prochaines évolutions possibles :**
- WebSockets (Laravel Reverb) pour messagerie temps réel
- Laravel Scout + Meilisearch pour recherche avancée
- PWA pour notifications push
- API REST externe (pour app mobile React Native)

---

**Dernière mise à jour** : 7 février 2026  
**Auteur** : Emmanuel Chabrier  
**Formation** : AFPA Saint-Jean-de-Védas - Développeur Web et Web Mobile