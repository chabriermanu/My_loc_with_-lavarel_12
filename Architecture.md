# 🏗️ MyLoc 2.0 - Architecture Complète

## 📊 Schéma de Base de Données

### Tables Principales

#### 1. **users** (Laravel par défaut + extensions)

```php
id
first_name
last_name
email
password
email_verified_at
phone
avatar
bio (text)
rating (decimal) // Moyenne des notes reçues
total_ratings (int) // Nombre total d'avis
created_at
updated_at
```

#### 2. **categories**

```php
id
name
slug
description
icon // Lucide icon name
points
color // Pour UI
created_at
updated_at
```

#### 3. **items** (Objets à prêter)

```php
id
name
slug
description (text)
picture // Image principale
video // Vidéo de démo (optionnel)
media_type (enum: 'image', 'video', 'both')
user_id // Propriétaire
category_id
condition (enum: 'new', 'like_new', 'good', 'fair', 'poor')
value (decimal) // Valeur estimée
is_available (boolean)
rating (decimal) // Moyenne des notes de l'objet
total_ratings (int)
views_count (int) // Nombre de vues
favorites_count (int) // Nombre de favoris
created_at
updated_at
```

#### 4. **item_media** (Table pour plusieurs photos/vidéos)

```php
id
item_id
media_path
media_type (enum: 'image', 'video')
order (int) // Pour trier
created_at
```

#### 5. **loans** (Prêts)

```php
id
item_id
owner_id // Propriétaire de l'objet
borrower_id // Emprunteur
start_date
end_date
status (enum: 'pending', 'approved', 'in_progress', 'completed', 'cancelled', 'overdue')
returned_at (timestamp nullable)
notes (text) // Notes additionnelles
created_at
updated_at
```

#### 6. **favorites** (Favoris)

```php
id
user_id
item_id
created_at
```

#### 7. **item_reviews** (Avis sur les objets)

```php
id
item_id
user_id // Qui a laissé l'avis
loan_id // Lié au prêt (optionnel, pour vérifier qu'il a emprunté)
rating (int 1-5)
comment (text)
created_at
updated_at
```

#### 8. **user_reviews** (Avis sur les utilisateurs)

```php
id
reviewer_id // Qui laisse l'avis
reviewee_id // Qui reçoit l'avis
loan_id // Lié au prêt
type (enum: 'as_owner', 'as_borrower') // Type d'avis
rating (int 1-5)
comment (text)
punctuality_rating (int 1-5) // Ponctualité
communication_rating (int 1-5) // Communication
condition_respect_rating (int 1-5) // Respect de l'état de l'objet
created_at
updated_at
```

#### 9. **comments** (Commentaires sur les items)

```php
id
item_id
user_id
parent_id (nullable) // Pour les réponses
content (text)
created_at
updated_at
```

#### 10. **notifications** (Notifications)

```php
id
user_id
type (enum: 'loan_request', 'loan_approved', 'loan_returned', 'new_review', 'new_comment')
data (json) // Données de la notification
read_at (timestamp nullable)
created_at
```

---

## 🔗 Relations Eloquent

### User Model

```php
// Items possédés
hasMany(Item::class, 'user_id')

// Prêts en tant que propriétaire
hasMany(Loan::class, 'owner_id')

// Prêts en tant qu'emprunteur
hasMany(Loan::class, 'borrower_id')

// Favoris
hasMany(Favorite::class)
belongsToMany(Item::class, 'favorites')

// Avis donnés
hasMany(UserReview::class, 'reviewer_id')

// Avis reçus
hasMany(UserReview::class, 'reviewee_id')

// Commentaires
hasMany(Comment::class)

// Notifications
hasMany(Notification::class)
```

### Item Model

```php
// Propriétaire
belongsTo(User::class, 'user_id')

// Catégorie
belongsTo(Category::class)

// Médias additionnels
hasMany(ItemMedia::class)

// Prêts
hasMany(Loan::class)

// Favoris
hasMany(Favorite::class)
belongsToMany(User::class, 'favorites')

// Avis
hasMany(ItemReview::class)

// Commentaires
hasMany(Comment::class)
```

### Loan Model

```php
// Item
belongsTo(Item::class)

// Propriétaire
belongsTo(User::class, 'owner_id')

// Emprunteur
belongsTo(User::class, 'borrower_id')

// Avis utilisateurs liés
hasMany(UserReview::class)
```

---

## 📝 Types TypeScript

```typescript
// types/index.d.ts

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    avatar?: string;
    bio?: string;
    rating: number;
    total_ratings: number;
    created_at: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    points: number;
    color?: string;
}

export interface ItemMedia {
    id: number;
    media_path: string;
    media_type: 'image' | 'video';
    order: number;
}

export interface Item {
    id: number;
    name: string;
    slug: string;
    description: string;
    picture?: string;
    video?: string;
    media_type: 'image' | 'video' | 'both';
    condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
    value?: number;
    is_available: boolean;
    rating: number;
    total_ratings: number;
    views_count: number;
    favorites_count: number;
    owner: User;
    category: Category;
    media?: ItemMedia[];
    is_favorited?: boolean; // Computed
    created_at: string;
}

export interface Loan {
    id: number;
    item: Item;
    owner: User;
    borrower: User;
    start_date: string;
    end_date: string;
    status:
        | 'pending'
        | 'approved'
        | 'in_progress'
        | 'completed'
        | 'cancelled'
        | 'overdue';
    returned_at?: string;
    notes?: string;
    created_at: string;
}

export interface Favorite {
    id: number;
    user_id: number;
    item: Item;
    created_at: string;
}

export interface ItemReview {
    id: number;
    item: Item;
    user: User;
    loan?: Loan;
    rating: number;
    comment: string;
    created_at: string;
}

export interface UserReview {
    id: number;
    reviewer: User;
    reviewee: User;
    loan: Loan;
    type: 'as_owner' | 'as_borrower';
    rating: number;
    comment: string;
    punctuality_rating: number;
    communication_rating: number;
    condition_respect_rating: number;
    created_at: string;
}

export interface Comment {
    id: number;
    item_id: number;
    user: User;
    parent?: Comment;
    content: string;
    replies?: Comment[];
    created_at: string;
}

export interface Notification {
    id: number;
    type: string;
    data: any;
    read_at?: string;
    created_at: string;
}
```

---

## 🎯 Fonctionnalités par Module

### 📦 Module Items

- [x] CRUD items
- [x] Upload photos multiples
- [x] Upload vidéo de démo
- [x] Galerie média
- [x] Gestion état/condition
- [x] Statistiques (vues, favoris)

### ⭐ Module Favoris

- [x] Ajouter/retirer des favoris
- [x] Liste de mes favoris
- [x] Compteur de favoris par item

### 💬 Module Commentaires

- [x] Commenter un item
- [x] Répondre à un commentaire
- [x] Modifier/supprimer ses commentaires
- [x] Notifications

### ⭐ Module Notations Items

- [x] Noter un item après l'avoir emprunté
- [x] Moyenne des notes
- [x] Historique des avis
- [x] Filtrer par note

### 🤝 Module Prêts

- [x] Demander un prêt
- [x] Approuver/refuser une demande
- [x] Suivre statut
- [x] Marquer comme retourné
- [x] Gestion des retards

### 👥 Module Avis Utilisateurs

- [x] Prêteur note l'emprunteur
- [x] Emprunteur note le prêteur
- [x] Notes multi-critères
- [x] Profil avec moyenne

### 🔔 Module Notifications

- [x] Nouvelle demande de prêt
- [x] Prêt approuvé/refusé
- [x] Rappel de retour
- [x] Nouvel avis reçu
- [x] Nouveau commentaire

---

## 🚀 Plan de Développement

### Phase 1 - Setup & Base (Semaine 1)

- [x] Laravel 12 + Breeze
- [x] Migrations de base
- [x] Modèles avec relations
- [x] Types TypeScript
- [x] Shadcn UI components

### Phase 2 - Items & Médias (Semaine 2)

- [ ] CRUD items
- [ ] Upload photos/vidéos
- [ ] Galerie média
- [ ] Affichage items

### Phase 3 - Système Favoris & Commentaires (Semaine 3)

- [ ] Toggle favoris
- [ ] Page mes favoris
- [ ] Commentaires sur items
- [ ] Réponses commentaires

### Phase 4 - Prêts (Semaine 3-4)

- [ ] Demander un prêt
- [ ] Approuver/refuser
- [ ] Gestion statuts
- [ ] Retours

### Phase 5 - Notations (Semaine 4)

- [ ] Noter un item
- [ ] Noter utilisateur (bidirectionnel)
- [ ] Calcul moyennes
- [ ] Affichage profils

### Phase 6 - Notifications & Polish (Semaine 5)

- [ ] Système notifications
- [ ] Dashboard analytics
- [ ] Recherche avancée
- [ ] Interface admin

---

## 📦 Packages Nécessaires

### Backend

```bash
composer require intervention/image          # Images
composer require pbmedia/laravel-ffmpeg     # Vidéos
composer require spatie/laravel-sluggable   # Slugs
composer require spatie/laravel-medialibrary # Gestion médias (optionnel)
```

### Frontend

```bash
npm install lucide-react                    # Icons
npm install zod                             # Validation
npm install react-dropzone                  # Upload files
npm install @tanstack/react-query          # Data fetching
npm install date-fns                        # Dates
npm install react-player                    # Vidéo player
```

---

## 🎨 Composants UI Nécessaires

```bash
# Shadcn components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add tabs
npx shadcn@latest add select
npx shadcn@latest add calendar
npx shadcn@latest add popover
npx shadcn@latest add toast
npx shadcn@latest add alert
npx shadcn@latest add pagination
npx shadcn@latest add separator
```

---

## 📄 Structure des Routes

```php
// routes/web.php

Route::middleware('auth')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Items
    Route::resource('items', ItemController::class);
    Route::post('items/{item}/media', [ItemController::class, 'uploadMedia']);
    Route::delete('items/media/{media}', [ItemController::class, 'deleteMedia']);

    // Favoris
    Route::post('items/{item}/favorite', [FavoriteController::class, 'toggle']);
    Route::get('favorites', [FavoriteController::class, 'index'])->name('favorites.index');

    // Commentaires
    Route::post('items/{item}/comments', [CommentController::class, 'store']);
    Route::patch('comments/{comment}', [CommentController::class, 'update']);
    Route::delete('comments/{comment}', [CommentController::class, 'destroy']);

    // Avis sur items
    Route::post('items/{item}/reviews', [ItemReviewController::class, 'store']);

    // Prêts
    Route::resource('loans', LoanController::class);
    Route::patch('loans/{loan}/approve', [LoanController::class, 'approve']);
    Route::patch('loans/{loan}/reject', [LoanController::class, 'reject']);
    Route::patch('loans/{loan}/complete', [LoanController::class, 'complete']);

    // Avis utilisateurs
    Route::post('loans/{loan}/review', [UserReviewController::class, 'store']);

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::patch('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::patch('notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // Profil
    Route::get('users/{user}', [UserController::class, 'show'])->name('users.show');
});
```

---

## 🎯 Priorisation des Fonctionnalités

### MVP (Minimum Viable Product) - 2 semaines

1. ✅ Auth (Breeze)
2. ✅ CRUD Items avec photos
3. ✅ Système de prêts basique
4. ✅ Favoris
5. ✅ Profil utilisateur

### Version 1.0 - 4 semaines

6. ✅ Upload vidéos
7. ✅ Commentaires
8. ✅ Notations items
9. ✅ Avis utilisateurs bidirectionnels
10. ✅ Notifications

### Version 1.5 - 5 semaines

11. ✅ Recherche avancée
12. ✅ Filtres par catégorie/note
13. ✅ Dashboard analytics
14. ✅ Interface admin

---

C'est l'architecture complète ! Prêt à commencer ? 🚀
