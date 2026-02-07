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
- ❤️ Liker et favoriser les annonces
- ⭐ Noter les items et les utilisateurs
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
| **Laravel Sanctum** | - | API tokens pour requêtes asynchrones |
| **Inertia.js Laravel** | 2.x | Bridge Laravel ↔ React (SSR-like SPA) |
| **Pusher** | - | Notifications temps réel (prêt) |

### Frontend

| Technologie | Version | Usage |
|------------|---------|-------|
| **React** | 19 | Bibliothèque UI |
| **TypeScript** | 5 | Typage statique JavaScript |
| **Inertia.js React** | 2.x | Client Inertia pour React |
| **Tailwind CSS** | 4 | Framework CSS utility-first |
| **shadcn/ui** | - | Composants UI accessibles (Radix UI) |
| **Lucide React** | - | Icônes SVG |
| **Embla Carousel** | - | Carousel pour galeries |
| **Vite** | 5 | Build tool et dev server |

### DevOps & Tooling

| Outil | Usage |
|-------|-------|
| **Git** | Versioning |
| **Docker** | Containerisation (docker-compose.yaml) |
| **Composer** | Gestionnaire de dépendances PHP |
| **npm** | Gestionnaire de dépendances JS |
| **Laravel Pint** | Code style PHP (PSR-12) |
| **ESLint** | Linting TypeScript/React |
| **Laravel Wayfinder** | Génération routes TypeScript |

---

## 3. Architecture de la base de données

### Vue d'ensemble

- **27 migrations** - Structure complète de la base de données
- **12 tables principales** - Modélisation métier
- **Relations complexes** - Parent/enfant, polymorphiques, bidirectionnelles
- **Index optimisés** - Performance des requêtes

*Pour le schéma détaillé des tables et les relations complètes, voir le fichier ROADMAP.md ou consulter les migrations dans `database/migrations/`.*

---

## 4. Structure du projet

*Voir le fichier README.md pour la structure complète et détaillée du projet avec les 27 migrations, 12 modèles, 14 controllers, 31 pages React, et 40+ composants.*

---

## 5. Modèles et Relations

### 12 Modèles Eloquent

1. **User** - Utilisateurs (avec géolocalisation et 2FA)
2. **Item** - Annonces (objets et services) avec trait Likable
3. **Category** - Catégories hiérarchiques (77 catégories)
4. **Loan** - Prêts/réservations avec partage coordonnées
5. **Favorite** - Favoris utilisateurs
6. **Like** - Likes polymorphiques
7. **Comment** - Commentaires avec réponses imbriquées
8. **ItemMedia** - Photos/vidéos des items
9. **ItemReview** - Avis sur les items
10. **UserReview** - Avis sur les utilisateurs (4 critères)
11. **UserConsent** - Consentements RGPD
12. **Message** - Messagerie interne

### Trait Likable

```php
// app/Traits/Likable.php

trait Likable
{
    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }
    
    public function isLikedBy(User $user): bool
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }
}
```

---

## 6. Controllers et Routes

### 14 Controllers

**Publics :**
- CategoryController
- ItemController

**Admin :**
- AdminCategoryController

**Gestion :**
- LoanController
- FavoriteController
- LikeController
- CommentController
- ItemMediaController
- ItemReviewController
- UserReviewController

**User :**
- DashboardController
- LocationController

**Settings (3) :**
- Settings\ProfileController
- Settings\PasswordController
- Settings\TwoFactorAuthenticationController

**API :**
- Api\ConsentController

### Notifications (5)

- LoanApproved
- LoanRejected
- ContactRequested
- ContactShared
- NewMessage

---

## 7. Frontend Inertia.js + React

### Vue d'ensemble

- **31 pages** Inertia.js
- **40+ composants** réutilisables
- **8+ hooks** personnalisés
- **25+ composants** shadcn/ui
- **~2800 lignes** TypeScript
- **160+ routes** auto-générées (Wayfinder)

### Principe Inertia.js

Inertia.js permet de créer des SPAs sans API REST :
- Routage côté serveur (Laravel)
- Props envoyées au lieu de JSON
- Navigation sans rechargement
- Expérience SPA complète

### Exemple de code

```tsx
// Page Inertia
import { Head, Link, router } from '@inertiajs/react';

export default function ItemShow({ item, auth }) {
    const handleLike = () => {
        router.post('/like/toggle', { 
            likeable_type: 'Item', 
            likeable_id: item.id 
        }, {
            preserveScroll: true
        });
    };

    return (
        <>
            <Head title={item.name} />
            <h1>{item.name}</h1>
            <button onClick={handleLike}>
                {item.is_liked ? '❤️' : '🤍'}
            </button>
        </>
    );
}
```

---

## 8. Services et Helpers

### GeocodingService

Service de géolocalisation avec :
- Géocodage d'adresses (API externe)
- Calcul de distance (formule Haversine)
- Matching par proximité

### Helpers TypeScript

```typescript
// resources/js/lib/utils.ts

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistance(km: number): string {
    return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('fr-FR');
}
```

---

## 9. Sécurité et RGPD

### Système de consentement

- ✅ Modale au premier login
- ✅ Types multiples (geolocation, marketing, terms)
- ✅ Révocation possible
- ✅ Tracking IP et timestamps

### Partage de coordonnées

Workflow sécurisé :
1. Demande de contact (borrower)
2. Choix granulaire (email/phone/address)
3. Partage conditionné
4. Accès contrôlé via Policies

### Authentification

- Laravel Fortify (login, register)
- Two-Factor Authentication (2FA)
- Email verification
- Password reset

### Policies

- ItemPolicy
- LoanPolicy
- CommentPolicy
- MessagePolicy

---

## 10. Performance et Optimisations

### Eager Loading

```php
// ✅ Bon
$items = Item::with('owner', 'category')->get();

// ❌ Mauvais (N+1)
$items = Item::all();
foreach ($items as $item) {
    echo $item->owner->name; // +1 requête par item
}
```

### Cache

```php
// Catégories (changent rarement)
Cache::remember('categories.all', 3600, fn() => 
    Category::with('children')->whereNull('parent_id')->get()
);
```

### Images

```tsx
<img 
    src={item.picture} 
    loading="lazy"
    className="w-full h-48 object-cover"
/>
```

---

## Conclusion

Architecture moderne combinant :
- ✅ Laravel 12 + Inertia.js 2 + React 19 + TypeScript 5
- ✅ 27 migrations, 12 modèles, 14 controllers
- ✅ 31 pages, 40+ composants
- ✅ RGPD natif, 2FA, Policies
- ✅ Géolocalisation, système de likes polymorphique
- ✅ 5 notifications email

**Évolutions possibles :**
- Messagerie temps réel (Laravel Reverb)
- Recherche avancée (Laravel Scout)
- App mobile (React Native)
- PWA

---

**Dernière mise à jour** : 7 février 2026  
**Auteur** : Emmanuel Chabrier  
**Formation** : AFPA Saint-Jean-de-Védas - Développeur Web et Web Mobile  
**Projet** : MyLoc 2.0 - Plateforme de partage d'objets et services