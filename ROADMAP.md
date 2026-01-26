# ��� MyLoc 2.0 - Roadmap de développement

## ✅ Phase 1 : Base de données et Modèles (TERMINÉ)

### Ce qui a été fait :
- ✅ 9 migrations créées et exécutées
- ✅ 9 modèles Eloquent avec relations complètes
- ✅ Architecture documentée (Architecture.md)

---

## ✅ Phase 2 : Backend - Controllers (TERMINÉ)

### 8 Controllers complets (43 méthodes) :

#### CategoryController ✅
- index, create, store, show, edit, update, destroy
- Routes : `/categories`

#### ItemController ✅
- index (avec pagination), create, store, show, edit, update, destroy
- Upload photo/vidéo
- Routes : `/items`

#### LoanController ✅
- index, store, show
- approve, reject, complete, cancel (méthodes personnalisées)
- Routes : `/loans`

#### FavoriteController ✅
- index, toggle
- Gestion compteur favorites_count
- Routes : `/favorites`

#### CommentController ✅
- store, update, destroy
- Système de réponses (parent_id)
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

### 12 Form Requests avec validation ✅
- StoreCategoryRequest / UpdateCategoryRequest
- StoreItemRequest / UpdateItemRequest
- StoreLoanRequest
- StoreCommentRequest / UpdateCommentRequest
- StoreItemReviewRequest / UpdateItemReviewRequest
- StoreUserReviewRequest / UpdateUserReviewRequest

### 50+ Routes déclarées ✅

---

## ��� Phase 3 : Frontend - Pages React/Inertia (À FAIRE)

### Priorité 1 : Pages principales (2-3 jours)

#### 1. Items (Pages publiques et CRUD)
- [ ] `Items/Index.tsx` - Liste des items (avec pagination, filtres)
- [ ] `Items/Show.tsx` - Détails item (photos, avis, bouton emprunter)
- [ ] `Items/Create.tsx` - Formulaire création item
- [ ] `Items/Edit.tsx` - Formulaire édition item

#### 2. Categories
- [ ] `Categories/Index.tsx` - Liste catégories (grille avec icônes)
- [ ] `Categories/Show.tsx` - Items d'une catégorie
- [ ] `Categories/Create.tsx` - Formulaire admin
- [ ] `Categories/Edit.tsx` - Formulaire admin

#### 3. Loans (Gestion prêts)
- [ ] `Loans/Index.tsx` - Mes prêts (onglets : en tant que propriétaire / emprunteur)
- [ ] `Loans/Show.tsx` - Détails prêt (avec actions : approuver, refuser, compléter)

#### 4. Favorites
- [ ] `Favorites/Index.tsx` - Mes favoris (grille items)

### Priorité 2 : Composants réutilisables (1 jour)

#### Composants Items
- [ ] `ItemCard.tsx` - Carte item (photo, titre, catégorie, note, favori)
- [ ] `ItemGallery.tsx` - Galerie photos/vidéos
- [ ] `ItemReviewForm.tsx` - Formulaire avis item
- [ ] `ItemReviewList.tsx` - Liste avis avec pagination

#### Composants Prêts
- [ ] `LoanCard.tsx` - Carte prêt (item, dates, statut, actions)
- [ ] `LoanStatusBadge.tsx` - Badge coloré selon statut
- [ ] `UserReviewForm.tsx` - Formulaire avis utilisateur (4 critères)

#### Composants Commentaires
- [ ] `CommentForm.tsx` - Formulaire commentaire/réponse
- [ ] `CommentList.tsx` - Liste commentaires avec réponses
- [ ] `CommentItem.tsx` - Composant commentaire individuel

#### Composants Génériques
- [ ] `Pagination.tsx` - Composant pagination Inertia
- [ ] `StarRating.tsx` - Affichage et saisie notes étoiles
- [ ] `ImageUpload.tsx` - Upload photo avec preview
- [ ] `VideoUpload.tsx` - Upload vidéo avec preview

### Priorité 3 : Navigation et Layout (1 jour)

- [ ] Navbar avec liens (Items, Catégories, Mes Prêts, Favoris)
- [ ] Footer
- [ ] Page d'accueil (Hero + catégories + items populaires)
- [ ] Breadcrumbs
- [ ] Messages flash (succès/erreur)

### Priorité 4 : Fonctionnalités avancées (2 jours)

#### Recherche et Filtres
- [ ] Barre de recherche globale
- [ ] Filtres items (catégorie, condition, disponibilité)
- [ ] Tri (date, popularité, note)

#### Profil utilisateur
- [ ] Page profil public (items, avis reçus, note globale)
- [ ] Page paramètres (édition profil)

#### Notifications
- [ ] Badge compteur notifications
- [ ] Liste notifications (demandes prêt, approbations, etc.)

---

## ��� Plan d'action pour demain (AFPA)

### Matin (2h30)

1. **Créer les fichiers .tsx minimaux** (30min)
```bash
   # Créer la structure de dossiers
   mkdir -p resources/js/Pages/{Items,Categories,Loans,Favorites}
```
   
   Pour chaque page, créer un fichier minimal :
```tsx
   export default function Index({ data }) {
       return <div>Page en construction</div>;
   }
```

2. **Commencer par Items/Index.tsx** (2h)
   - Afficher la liste des items en grille
   - Pagination avec Inertia
   - Composant ItemCard basique

### Après-midi (3h)

3. **Items/Show.tsx** (2h)
   - Affichage détails item
   - Galerie photos
   - Bouton Favoris (toggle)
   - Bouton "Emprunter"

4. **ItemCard.tsx** composant réutilisable (1h)
   - Photo, titre, catégorie
   - Note étoiles
   - Icône favori
   - Badge disponibilité

---

## ��� Design et UI

### Stack technique frontend :
- React + TypeScript
- Inertia.js (déjà configuré avec Breeze)
- Tailwind CSS (déjà installé)
- Lucide React (icônes)

### Palette de couleurs (à définir) :
- Primaire : #3B82F6 (bleu)
- Secondaire : #10B981 (vert)
- Erreur : #EF4444 (rouge)
- Warning : #F59E0B (orange)

---

## ��� Phase 4 : Seeders et données de test (1 jour)

- [ ] CategorySeeder (10 catégories avec icônes)
- [ ] UserSeeder (5 utilisateurs de test)
- [ ] ItemSeeder (30 items répartis dans les catégories)
- [ ] LoanSeeder (quelques prêts de test)
- [ ] ReviewSeeder (avis items et users)

---

## ��� Phase 5 : Tests et optimisations (2 jours)

- [ ] Tester tous les flux utilisateur
- [ ] Responsive design (mobile, tablette)
- [ ] Optimisation images (lazy loading)
- [ ] Validation formulaires côté client
- [ ] Messages d'erreur clairs

---

## ��� Phase 6 : Sécurité et permissions (1 jour)

- [ ] Middleware admin pour CategoryController
- [ ] Policy pour vérifier propriété items/comments/reviews
- [ ] Protection CSRF (déjà géré par Inertia)
- [ ] Validation fichiers uploadés (taille, type)

---

## ��� Progression globale
```
Phase 1 : Base de données       ████████████████████ 100% ✅
Phase 2 : Backend               ████████████████████ 100% ✅
Phase 3 : Frontend              ░░░░░░░░░░░░░░░░░░░░   0%
Phase 4 : Seeders               ░░░░░░░░░░░░░░░░░░░░   0%
Phase 5 : Tests                 ░░░░░░░░░░░░░░░░░░░░   0%
Phase 6 : Sécurité              ░░░░░░░░░░░░░░░░░░░░   0%
```

**Projet global : 33% complété**

---

## ��� Conseils pour le développement frontend

1. **Commence par les pages simples** (Index) avant les complexes (Show avec toutes les features)
2. **Teste régulièrement** avec `npm run dev` et `php artisan serve`
3. **Utilise les composants Breeze existants** comme base (Button, Input, etc.)
4. **Console du navigateur** pour débugger les erreurs React
5. **Inertia DevTools** (extension Chrome) pour voir les props passées aux pages

---

## ��� Ressources utiles

- Documentation Inertia.js : https://inertiajs.com/
- Tailwind CSS : https://tailwindcss.com/
- Lucide Icons : https://lucide.dev/
- Laravel Docs : https://laravel.com/docs

---

## ✨ Features bonus (si le temps le permet)

- [ ] Mode sombre
- [ ] Système de messagerie entre users
- [ ] Notifications temps réel (Pusher/Echo)
- [ ] Historique modifications profil
- [ ] Export PDF des prêts
- [ ] Carte interactive (localisation items)
- [ ] Multi-langues (FR/EN)

---

**Dernière mise à jour** : 26 janvier 2026  
**Développeur** : Emmanuel  
**Formation** : AFPA Saint-Jean-de-Védas - Développeur Web et Mobile# ��� MyLoc 2.0 - Roadmap de développement

## ✅ Phase 1 : Base de données et Modèles (TERMINÉ)

### Ce qui a été fait :
- ✅ 9 migrations créées et exécutées
- ✅ 9 modèles Eloquent avec relations complètes
- ✅ Architecture documentée (Architecture.md)

---

## ✅ Phase 2 : Backend - Controllers (TERMINÉ)

### 8 Controllers complets (43 méthodes) :

#### CategoryController ✅
- index, create, store, show, edit, update, destroy
- Routes : `/categories`

#### ItemController ✅
- index (avec pagination), create, store, show, edit, update, destroy
- Upload photo/vidéo
- Routes : `/items`

#### LoanController ✅
- index, store, show
- approve, reject, complete, cancel (méthodes personnalisées)
- Routes : `/loans`

#### FavoriteController ✅
- index, toggle
- Gestion compteur favorites_count
- Routes : `/favorites`

#### CommentController ✅
- store, update, destroy
- Système de réponses (parent_id)
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

### 12 Form Requests avec validation ✅
- StoreCategoryRequest / UpdateCategoryRequest
- StoreItemRequest / UpdateItemRequest
- StoreLoanRequest
- StoreCommentRequest / UpdateCommentRequest
- StoreItemReviewRequest / UpdateItemReviewRequest
- StoreUserReviewRequest / UpdateUserReviewRequest

### 50+ Routes déclarées ✅

---

## ��� Phase 3 : Frontend - Pages React/Inertia (À FAIRE)

### Priorité 1 : Pages principales (2-3 jours)

#### 1. Items (Pages publiques et CRUD)
- [ ] `Items/Index.tsx` - Liste des items (avec pagination, filtres)
- [ ] `Items/Show.tsx` - Détails item (photos, avis, bouton emprunter)
- [ ] `Items/Create.tsx` - Formulaire création item
- [ ] `Items/Edit.tsx` - Formulaire édition item

#### 2. Categories
- [ ] `Categories/Index.tsx` - Liste catégories (grille avec icônes)
- [ ] `Categories/Show.tsx` - Items d'une catégorie
- [ ] `Categories/Create.tsx` - Formulaire admin
- [ ] `Categories/Edit.tsx` - Formulaire admin

#### 3. Loans (Gestion prêts)
- [ ] `Loans/Index.tsx` - Mes prêts (onglets : en tant que propriétaire / emprunteur)
- [ ] `Loans/Show.tsx` - Détails prêt (avec actions : approuver, refuser, compléter)

#### 4. Favorites
- [ ] `Favorites/Index.tsx` - Mes favoris (grille items)

### Priorité 2 : Composants réutilisables (1 jour)

#### Composants Items
- [ ] `ItemCard.tsx` - Carte item (photo, titre, catégorie, note, favori)
- [ ] `ItemGallery.tsx` - Galerie photos/vidéos
- [ ] `ItemReviewForm.tsx` - Formulaire avis item
- [ ] `ItemReviewList.tsx` - Liste avis avec pagination

#### Composants Prêts
- [ ] `LoanCard.tsx` - Carte prêt (item, dates, statut, actions)
- [ ] `LoanStatusBadge.tsx` - Badge coloré selon statut
- [ ] `UserReviewForm.tsx` - Formulaire avis utilisateur (4 critères)

#### Composants Commentaires
- [ ] `CommentForm.tsx` - Formulaire commentaire/réponse
- [ ] `CommentList.tsx` - Liste commentaires avec réponses
- [ ] `CommentItem.tsx` - Composant commentaire individuel

#### Composants Génériques
- [ ] `Pagination.tsx` - Composant pagination Inertia
- [ ] `StarRating.tsx` - Affichage et saisie notes étoiles
- [ ] `ImageUpload.tsx` - Upload photo avec preview
- [ ] `VideoUpload.tsx` - Upload vidéo avec preview

### Priorité 3 : Navigation et Layout (1 jour)

- [ ] Navbar avec liens (Items, Catégories, Mes Prêts, Favoris)
- [ ] Footer
- [ ] Page d'accueil (Hero + catégories + items populaires)
- [ ] Breadcrumbs
- [ ] Messages flash (succès/erreur)

### Priorité 4 : Fonctionnalités avancées (2 jours)

#### Recherche et Filtres
- [ ] Barre de recherche globale
- [ ] Filtres items (catégorie, condition, disponibilité)
- [ ] Tri (date, popularité, note)

#### Profil utilisateur
- [ ] Page profil public (items, avis reçus, note globale)
- [ ] Page paramètres (édition profil)

#### Notifications
- [ ] Badge compteur notifications
- [ ] Liste notifications (demandes prêt, approbations, etc.)

---

## ��� Plan d'action pour demain (AFPA)

### Matin (2h30)

1. **Créer les fichiers .tsx minimaux** (30min)
```bash
   # Créer la structure de dossiers
   mkdir -p resources/js/Pages/{Items,Categories,Loans,Favorites}
```
   
   Pour chaque page, créer un fichier minimal :
```tsx
   export default function Index({ data }) {
       return <div>Page en construction</div>;
   }
```

2. **Commencer par Items/Index.tsx** (2h)
   - Afficher la liste des items en grille
   - Pagination avec Inertia
   - Composant ItemCard basique

### Après-midi (3h)

3. **Items/Show.tsx** (2h)
   - Affichage détails item
   - Galerie photos
   - Bouton Favoris (toggle)
   - Bouton "Emprunter"

4. **ItemCard.tsx** composant réutilisable (1h)
   - Photo, titre, catégorie
   - Note étoiles
   - Icône favori
   - Badge disponibilité

---

## ��� Design et UI

### Stack technique frontend :
- React + TypeScript
- Inertia.js (déjà configuré avec Breeze)
- Tailwind CSS (déjà installé)
- Lucide React (icônes)

### Palette de couleurs (à définir) :
- Primaire : #3B82F6 (bleu)
- Secondaire : #10B981 (vert)
- Erreur : #EF4444 (rouge)
- Warning : #F59E0B (orange)

---

## ��� Phase 4 : Seeders et données de test (1 jour)

- [ ] CategorySeeder (10 catégories avec icônes)
- [ ] UserSeeder (5 utilisateurs de test)
- [ ] ItemSeeder (30 items répartis dans les catégories)
- [ ] LoanSeeder (quelques prêts de test)
- [ ] ReviewSeeder (avis items et users)

---

## ��� Phase 5 : Tests et optimisations (2 jours)

- [ ] Tester tous les flux utilisateur
- [ ] Responsive design (mobile, tablette)
- [ ] Optimisation images (lazy loading)
- [ ] Validation formulaires côté client
- [ ] Messages d'erreur clairs

---

## ��� Phase 6 : Sécurité et permissions (1 jour)

- [ ] Middleware admin pour CategoryController
- [ ] Policy pour vérifier propriété items/comments/reviews
- [ ] Protection CSRF (déjà géré par Inertia)
- [ ] Validation fichiers uploadés (taille, type)

---

## ��� Progression globale
```
Phase 1 : Base de données       ████████████████████ 100% ✅
Phase 2 : Backend               ████████████████████ 100% ✅
Phase 3 : Frontend              ░░░░░░░░░░░░░░░░░░░░   0%
Phase 4 : Seeders               ░░░░░░░░░░░░░░░░░░░░   0%
Phase 5 : Tests                 ░░░░░░░░░░░░░░░░░░░░   0%
Phase 6 : Sécurité              ░░░░░░░░░░░░░░░░░░░░   0%
```

**Projet global : 33% complété**

---

## ��� Conseils pour le développement frontend

1. **Commence par les pages simples** (Index) avant les complexes (Show avec toutes les features)
2. **Teste régulièrement** avec `npm run dev` et `php artisan serve`
3. **Utilise les composants Breeze existants** comme base (Button, Input, etc.)
4. **Console du navigateur** pour débugger les erreurs React
5. **Inertia DevTools** (extension Chrome) pour voir les props passées aux pages

---

## ��� Ressources utiles

- Documentation Inertia.js : https://inertiajs.com/
- Tailwind CSS : https://tailwindcss.com/
- Lucide Icons : https://lucide.dev/
- Laravel Docs : https://laravel.com/docs

---

## ✨ Features bonus (si le temps le permet)

- [ ] Mode sombre
- [ ] Système de messagerie entre users
- [ ] Notifications temps réel (Pusher/Echo)
- [ ] Historique modifications profil
- [ ] Export PDF des prêts
- [ ] Carte interactive (localisation items)
- [ ] Multi-langues (FR/EN)

---

**Dernière mise à jour** : 26 janvier 2026  
**Développeur** : Emmanuel  
**Formation** : AFPA Saint-Jean-de-Védas - Développeur Web et Mobile


