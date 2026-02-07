# 🗺️ MyLoc 2.0 - Roadmap de développement

## ✅ Phase 1 : Base de données et Modèles (TERMINÉ)

### Ce qui a été fait :

- ✅ **27 migrations** créées et exécutées
- ✅ **12 modèles Eloquent** avec relations complètes
- ✅ Architecture documentée (Architecture.md)
- ✅ Migration système de consentement RGPD
- ✅ Migration géolocalisation utilisateurs
- ✅ Relations polymorphiques (Likes)
- ✅ Relations bidirectionnelles (UserReviews)
- ✅ Relations parent/enfant (Categories, Comments)

---

## ✅ Phase 2 : Backend - Controllers (TERMINÉ)

### 14 Controllers complets (60+ méthodes) :

#### CategoryController ✅
- index, show (pages publiques)
- Routes : `/categories`

#### AdminCategoryController ✅
- index, create, store, edit, update, destroy
- Réservé aux administrateurs
- Routes : `/admin/categories`

#### ItemController ✅
- index (avec pagination), create, store, show, edit, update, destroy
- Upload photo/vidéo
- Géolocalisation des items
- Système de popularité
- Routes : `/items`

#### LoanController ✅
- index, store, show
- approve, reject, complete, cancel (méthodes personnalisées)
- Matching par proximité géographique
- Routes : `/loans`

#### FavoriteController ✅
- index, toggle
- Gestion compteur favorites_count
- Routes : `/favorites`

#### LikeController ✅
- toggle (like/unlike polymorphique)
- Routes : `/like/toggle`

#### CommentController ✅
- store, update, destroy
- Système de réponses imbriquées (parent_id)
- Routes : `/comments`

#### ItemMediaController ✅
- store, destroy
- Upload médias additionnels
- Suppression fichiers storage
- Routes : `/items/{item}/media`

#### ItemReviewController ✅
- store, update, destroy
- Recalcul moyennes items
- Routes : `/item-reviews`

#### UserReviewController ✅
- store, update, destroy
- Système bidirectionnel (as_owner / as_borrower)
- 4 critères de notation
- Recalcul moyennes users
- Routes : `/user-reviews`

#### LocationController ✅
- update : Mise à jour localisation utilisateur
- Routes : `/settings/location`

#### DashboardController ✅
- index : Dashboard personnalisé
- Routes : `/dashboard`

#### Settings Controllers ✅ (3 controllers)
- ProfileController : Gestion profil
- PasswordController : Changement mot de passe
- TwoFactorAuthenticationController : Gestion 2FA
- Routes : `/settings/*`

#### Api/ConsentController ✅
- store : Enregistrement consentement
- revoke : Révocation consentement
- Routes : `/api/consent`

### Services Backend ✅

- ✅ **GeocodingService** : Géolocalisation via API externe
- ✅ **CreateNewUser** : Géolocalisation automatique à l'inscription

### Traits ✅

- ✅ **Likable** : Trait polymorphique pour système de likes

### Notifications ✅ (5 notifications)

- ✅ **LoanApproved** : Notification prêt accepté
- ✅ **LoanRejected** : Notification prêt refusé
- ✅ **ContactRequested** : Demande de coordonnées
- ✅ **ContactShared** : Partage de coordonnées
- ✅ **NewMessage** : Nouveau message reçu

### 14+ Form Requests avec validation ✅

- StoreCategoryRequest / UpdateCategoryRequest
- StoreItemRequest / UpdateItemRequest
- StoreLoanRequest / UpdateLoanRequest
- StoreCommentRequest / UpdateCommentRequest
- StoreItemReviewRequest / UpdateItemReviewRequest
- StoreUserReviewRequest / UpdateUserReviewRequest
- Settings/ProfileUpdateRequest
- Settings/PasswordUpdateRequest
- (+ validations consentement et localisation)

### 160+ Routes déclarées ✅

- Routes web (Inertia.js)
- Routes API (Sanctum)
- Routes générées automatiquement (Wayfinder)

---

## 🚧 Phase 3 : Frontend - Pages React/Inertia (EN COURS - 75%)

### ✅ Pages principales implémentées

#### 1. Items (Pages publiques et CRUD)

- ✅ `Items/Index.tsx` - Liste des items (pagination, filtres)
- ✅ `Items/Show.tsx` - Détails item (photos, avis, commentaires, emprunter)
- ✅ `Items/Create.tsx` - Formulaire création item
- ✅ `Items/Edit.tsx` - Formulaire édition item
- ✅ `Items/MyItems.tsx` - Mes annonces

#### 2. Categories

- ✅ `Categories/Index.tsx` - Liste catégories (77 catégories avec icônes)
- ✅ `Categories/Show.tsx` - Items d'une catégorie
- ✅ `Admin/Categories/Index.tsx` - Liste admin
- ✅ `Admin/Categories/Create.tsx` - Formulaire admin
- ✅ `Admin/Categories/Edit.tsx` - Formulaire admin

#### 3. Loans (Gestion prêts)

- ✅ `Loans/Borrows.tsx` - Mes emprunts
- ✅ `Loans/Lends.tsx` - Mes prêts
- ✅ `Loans/Show.tsx` - Détails prêt avec actions
- ✅ `Loans/Create.tsx` - Demande de prêt

#### 4. Favorites

- ✅ `Favorites/Index.tsx` - Mes favoris (grille items)

#### 5. Pages légales & Settings

- ✅ `Legal/PrivacyPolicy.tsx` - Politique de confidentialité
- ✅ `Legal/Terms.tsx` - Conditions générales d'utilisation
- ✅ `settings/Location.tsx` - Gestion localisation utilisateur
- ✅ `settings/profile.tsx` - Édition profil
- ✅ `settings/password.tsx` - Changement mot de passe
- ✅ `settings/two-factor.tsx` - Configuration 2FA
- ✅ `settings/appearance.tsx` - Préférences d'apparence

#### 6. Authentification (7 pages)

- ✅ `auth/login.tsx` - Connexion
- ✅ `auth/register.tsx` - Inscription
- ✅ `auth/forgot-password.tsx` - Mot de passe oublié
- ✅ `auth/reset-password.tsx` - Réinitialisation
- ✅ `auth/verify-email.tsx` - Vérification email
- ✅ `auth/confirm-password.tsx` - Confirmation mot de passe
- ✅ `auth/two-factor-challenge.tsx` - Challenge 2FA

#### 7. Dashboard

- ✅ `Dashboard.tsx` - Tableau de bord personnalisé

### ✅ Composants réutilisables implémentés

#### Composants Items

- ✅ `ItemCard.tsx` - Carte item (photo, titre, catégorie, note, favori, like)
- ✅ `ItemMediaCarousel.tsx` - Galerie photos/vidéos avec navigation
- [ ] `ItemReviewForm.tsx` - Formulaire avis item
- [ ] `ItemReviewList.tsx` - Liste avis avec pagination

#### Composants Prêts

- ✅ `LoanCard.tsx` - Carte prêt (item, dates, statut, actions)
- [ ] `UserReviewForm.tsx` - Formulaire avis utilisateur (4 critères)

#### Composants Commentaires

- ✅ `CommentSection.tsx` - Section commentaires complète (18K)
- [ ] `CommentList.tsx` - Liste commentaires avec réponses
- [ ] `CommentItem.tsx` - Composant commentaire individuel

#### Composants Reviews

- ✅ `ReviewSection.tsx` - Section avis (3.8K)

#### Composants RGPD

- ✅ `Consent/FirstLoginConsentModal.tsx` - Modale consentement premier login

#### Composants Navigation

- ✅ `Nav.tsx` - Navigation principale (20K)
- ✅ `Breadcrumbs.tsx` - Fil d'Ariane
- ✅ `nav-main.tsx` - Menu principal
- ✅ `nav-footer.tsx` - Footer navigation
- ✅ `nav-user.tsx` - Menu utilisateur

#### Composants Génériques

- [ ] `Pagination.tsx` - Composant pagination Inertia
- [ ] `StarRating.tsx` - Affichage et saisie notes étoiles
- [ ] `ImageUpload.tsx` - Upload photo avec preview
- [ ] `VideoUpload.tsx` - Upload vidéo avec preview

#### Composants UI (shadcn/ui) - 25+ composants

- ✅ `ui/button.tsx`
- ✅ `ui/card.tsx`
- ✅ `ui/input.tsx`
- ✅ `ui/textarea.tsx`
- ✅ `ui/select.tsx`
- ✅ `ui/dialog.tsx`
- ✅ `ui/sheet.tsx`
- ✅ `ui/dropdown-menu.tsx`
- ✅ `ui/avatar.tsx`
- ✅ `ui/badge.tsx`
- ✅ `ui/checkbox.tsx`
- ✅ `ui/label.tsx`
- ✅ `ui/separator.tsx`
- ✅ `ui/tooltip.tsx`
- ✅ `ui/alert.tsx`
- ✅ `ui/skeleton.tsx`
- ✅ `ui/spinner.tsx`
- ✅ `ui/carousel.tsx`
- ✅ `ui/collapsible.tsx`
- ✅ `ui/breadcrumb.tsx`
- ✅ `ui/sidebar.tsx`
- ✅ `ui/navigation-menu.tsx`
- ✅ `ui/toggle.tsx`
- ✅ `ui/toggle-group.tsx`
- ✅ `ui/input-otp.tsx` (pour 2FA)

#### Composants Settings

- ✅ `appearance-tabs.tsx`
- ✅ `two-factor-setup-modal.tsx`
- ✅ `two-factor-recovery-codes.tsx`
- ✅ `delete-user.tsx`

#### Composants Helpers

- ✅ `app-header.tsx`
- ✅ `app-content.tsx`
- ✅ `app-logo.tsx`
- ✅ `app-logo-icon.tsx`
- ✅ `alert-error.tsx`
- ✅ `input-error.tsx`
- ✅ `heading.tsx`
- ✅ `text-link.tsx`
- ✅ `user-info.tsx`
- ✅ `user-menu-content.tsx`

### ✅ Layouts

- ✅ `app-layout.tsx` - Layout principal
- ✅ `auth-layout.tsx` - Layout authentification
- ✅ `auth/auth-card-layout.tsx` - Card layout
- ✅ `auth/auth-simple-layout.tsx` - Simple layout
- ✅ `auth/auth-split-layout.tsx` - Split layout
- ✅ `settings/layout.tsx` - Layout settings

### ✅ Hooks personnalisés (8+)

- ✅ `use-appearance.tsx`
- ✅ `use-clipboard.ts`
- ✅ `use-current-url.ts`
- ✅ `use-initials.tsx`
- ✅ `use-mobile-navigation.ts`
- ✅ `use-mobile.tsx`
- ✅ `use-two-factor-auth.ts`

### ✅ Navigation et Layout

- ✅ Navbar avec liens (Items, Catégories, Mes Prêts, Favoris)
- ✅ Footer
- ✅ Page d'accueil (Hero + catégories + items populaires)
- ✅ Breadcrumbs
- ✅ Messages flash (succès/erreur)
- ✅ Sidebar responsive
- ✅ Mobile navigation (Sheet)

### 🚧 Fonctionnalités avancées (EN COURS)

#### Recherche et Filtres

- ✅ Filtres items (catégorie, type objet/service)
- [ ] Barre de recherche globale
- [ ] Filtres condition et disponibilité
- [ ] Tri (date, popularité, note)

#### Géolocalisation

- ✅ Calcul de distance entre utilisateurs
- ✅ Affichage distance sur les items
- ✅ Matching prêts par proximité
- ✅ Gestion paramètres localisation

#### Profil utilisateur

- [ ] Page profil public (items, avis reçus, note globale)
- ✅ Page paramètres localisation
- ✅ Édition profil complète

#### Notifications

- [ ] Badge compteur notifications
- [ ] Liste notifications (demandes prêt, approbations, etc.)

---

## 🔓 Architecture Routes Publiques vs Privées

### ✅ Pages PUBLIQUES (accessibles sans connexion)

- ✅ Welcome (page d'accueil)
- ✅ Items/Index (liste des items)
- ✅ Items/Show (détails item)
- ✅ Categories/Index (liste catégories)
- ✅ Categories/Show (items par catégorie)
- ✅ Legal/PrivacyPolicy
- ✅ Legal/Terms

### ✅ Pages PRIVÉES (connexion requise)

- ✅ Dashboard
- ✅ Items/Create, Edit, MyItems
- ✅ Loans/* (mes prêts)
- ✅ Favorites/* (mes favoris)
- ✅ Settings/* (tous les settings)
- ✅ Admin/Categories/* (admin uniquement)
- ✅ Tous les commentaires, reviews, etc.

### ✅ Masquage données sensibles (IMPLÉMENTÉ)

- ✅ Coordonnées géographiques masquées pour non-connectés
- ✅ Contact utilisateur conditionné à l'authentification
- ✅ Système de consentement RGPD pour partage données

---

## 🎯 Prochaines étapes prioritaires

### Semaine en cours (Frontend)

1. **Composants Commentaires restants** (1 jour)
   - [ ] CommentList avec affichage hiérarchique
   - [ ] CommentItem (édition/suppression)

2. **Système d'avis** (1 jour)
   - [ ] StarRating component (affichage + saisie)
   - [ ] ItemReviewForm avec notes
   - [ ] UserReviewForm (4 critères)
   - [ ] Affichage moyennes et statistiques

3. **Composants génériques** (1 jour)
   - [ ] Pagination Inertia réutilisable
   - [ ] ImageUpload avec preview et drag & drop
   - [ ] VideoUpload avec preview

### Semaine suivante (Seeders et Tests)

4. **Phase 4 : Seeders et données de test** (2 jours)
   - [ ] CategorySeeder (77 catégories avec icônes)
   - [ ] UserSeeder (10 utilisateurs de test avec géolocalisation)
   - [ ] ItemSeeder (50 items répartis objets/services)
   - [ ] LoanSeeder (prêts de test avec statuts variés)
   - [ ] ReviewSeeder (avis items et users)
   - [ ] ConsentSeeder (consentements RGPD)
   - [ ] LikeSeeder (likes sur items)
   - [ ] CommentSeeder (commentaires + réponses)

5. **Phase 5 : Tests et optimisations** (2 jours)
   - [ ] 10 tests Feature (Item, Loan, Favorite, Comment, etc.)
   - [ ] 5 tests Unit (GeocodingService, Likable trait, etc.)
   - [ ] Tests flux utilisateur complets
   - [ ] Responsive design (mobile, tablette)
   - [ ] Optimisation images (lazy loading)
   - [ ] Validation formulaires côté client
   - [ ] Tests géolocalisation

### Dernière semaine (Sécurité et Polish)

6. **Phase 6 : Sécurité et permissions** (1 jour)
   - [ ] Policies complètes pour items/comments/reviews
   - [ ] Middleware admin pour categories
   - [ ] Validation fichiers uploadés renforcée
   - [ ] Tests sécurité RGPD
   - [ ] Rate limiting sur routes sensibles

7. **Documentation et préparation ECF** (2 jours)
   - [ ] PHPDoc sur méthodes importantes
   - [ ] Screenshots pour README
   - [ ] Vidéo démo (3-5 min)
   - [ ] PowerPoint présentation
   - [ ] Guide installation complet
   - [ ] Répétition pitch

---

## 📊 Progression globale

```
Phase 1 : Base de données       ████████████████████ 100% ✅
Phase 2 : Backend               ████████████████████ 100% ✅
Phase 3 : Frontend              ███████████████░░░░░  75% 🚧
Phase 4 : Seeders               ░░░░░░░░░░░░░░░░░░░░   0%
Phase 5 : Tests                 ░░░░░░░░░░░░░░░░░░░░   0%
Phase 6 : Sécurité              ████░░░░░░░░░░░░░░░░  20% 🚧
```

**Projet global : 72% complété**

---

## 🎨 Design et UI

### Stack technique frontend :

- ✅ React 19 + TypeScript 5
- ✅ Inertia.js 2 (configuré avec Laravel Fortify)
- ✅ Tailwind CSS 4
- ✅ shadcn/ui (25+ composants)
- ✅ Lucide React (icônes)
- ✅ Embla Carousel

### Palette de couleurs :

- Primaire : #3B82F6 (bleu)
- Secondaire : #10B981 (vert)
- Erreur : #EF4444 (rouge)
- Warning : #F59E0B (orange)
- Neutre : Tailwind gray scale

---

## 📦 Fonctionnalités implémentées

### ✅ Système complet

- [x] Authentification (Laravel Fortify)
- [x] Authentification à deux facteurs (2FA)
- [x] CRUD complet des annonces (objets + services)
- [x] CRUD admin des catégories
- [x] Upload et gestion d'images multiples
- [x] Système de catégories hiérarchiques (77 catégories)
- [x] Système de likes polymorphique (Likable trait)
- [x] Système de favoris avec compteurs
- [x] Commentaires avec réponses imbriquées
- [x] Système de prêts/emprunts complet
- [x] Composants LoanCard et badges de statut
- [x] Géolocalisation utilisateurs
- [x] Calcul de distance et matching
- [x] Système de consentement RGPD
- [x] Pages légales (CGU, Confidentialité)
- [x] Gestion paramètres localisation
- [x] Breadcrumbs navigation
- [x] Table messages (messagerie)
- [x] 5 Notifications email

### 🚧 En cours de développement

- [ ] Affichage des commentaires (CommentList/CommentItem)
- [ ] Système de notation items/utilisateurs (StarRating)
- [ ] Profil utilisateur public complet
- [ ] Recherche globale avancée
- [ ] Pagination réutilisable

### 💡 Features bonus (backlog)

- [ ] Messagerie temps réel (Pusher/Laravel Reverb)
- [ ] Notifications temps réel
- [ ] Mode sombre
- [ ] Export PDF des prêts
- [ ] Carte interactive (localisation items)
- [ ] Multi-langues (FR/EN)
- [ ] PWA (Progressive Web App)
- [ ] Application mobile (React Native)
- [ ] Recherche full-text (Laravel Scout)
- [ ] Paiement en ligne (Stripe)

---

## 🛠️ Stack technique complète

### Backend

- Laravel 12
- PHP 8.2+
- MySQL 8.0+
- Laravel Fortify (Auth + 2FA)
- Laravel Sanctum (API tokens)
- Pusher (notifications)
- API Géocodage externe

### Frontend

- React 19
- TypeScript 5
- Inertia.js 2
- Tailwind CSS 4
- shadcn/ui (Radix UI)
- Lucide React
- Embla Carousel

### DevOps

- Vite 5
- Docker (docker-compose.yaml)
- Laravel Wayfinder (routes TS)
- Laravel Pint (PSR-12)
- ESLint
- Git

---

## 📝 Conseils pour la suite

1. **Priorité Seeders** : Créer données de test réalistes pour demo ECF (URGENT)
2. **Composants manquants** : StarRating, CommentList, Pagination
3. **Tests** : Au moins 10 tests Feature + 5 Unit
4. **Documentation** : Tenir à jour README.md et Architecture.md
5. **Performance** : Optimiser requêtes N+1, lazy loading images
6. **Préparation ECF** : Vidéo démo + PowerPoint + répétition pitch

---

## 📚 Ressources utiles

- Documentation Inertia.js : https://inertiajs.com/
- Tailwind CSS : https://tailwindcss.com/
- shadcn/ui : https://ui.shadcn.com/
- Lucide Icons : https://lucide.dev/
- Laravel Docs : https://laravel.com/docs
- Laravel Fortify : https://laravel.com/docs/fortify
- TypeScript : https://www.typescriptlang.org/

---

**Dernière mise à jour** : 7 février 2026  
**Développeur** : Emmanuel Chabrier  
**Formation** : AFPA Saint-Jean-de-Védas - Développeur Web et Web Mobile  
**ECF** : MyLoc 2.0 - Plateforme de partage d'objets et services

---

**Progression : 72% | Backend : 100% | Frontend : 75% | Tests : 0%**

**Estimation temps restant : 30 heures (3 semaines à 10h/semaine)**