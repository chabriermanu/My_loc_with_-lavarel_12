# 🏠 MyLoc 2.0

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2-9553E9?style=for-the-badge&logo=inertia&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Plateforme hybride de partage et location d'objets avec système de réservation de services**

[📋 Voir le ROADMAP](./ROADMAP.md) • [🏗️ Architecture](./Architecture.md) • [🐛 Signaler un bug](https://github.com/chabriermanu/My_loc_with_-lavarel_12/issues)

</div>

---

## 📖 À propos du projet

**MyLoc 2.0** est une refonte complète du projet initial Symfony vers **Laravel 12**, développée dans le cadre de ma formation de Développeur Web Full Stack à l'AFPA. Cette plateforme permet aux utilisateurs de :

- 🎁 **Partager et emprunter** des objets entre particuliers
- 🛠️ **Proposer et réserver** des services
- 📍 **Géolocaliser** les annonces avec calcul de distance
- ❤️ **Favoriser, liker et commenter** les annonces
- 🔒 **Respecter le RGPD** avec système de consentement
- ⭐ **Noter** les items et les utilisateurs

---

## ✨ Fonctionnalités principales

### 🎯 Gestion des annonces
- ✅ Création d'annonces (objets ou services)
- 📂 Catégorisation avancée (77 catégories hiérarchiques)
- 🖼️ Upload multiple d'images avec carousel
- 🔍 Recherche et filtres par catégorie/type
- 💬 Système de commentaires avec réponses imbriquées
- ❤️ Likes et favoris avec compteurs
- ⭐ Système de notation (items et utilisateurs)

### 📍 Géolocalisation
- 🗺️ Localisation automatique via API externe
- 📏 Calcul de distance entre utilisateurs (formule Haversine)
- 🎯 Matching par proximité géographique
- 🔐 Partage RGPD-compliant des coordonnées

### 👤 Gestion utilisateur
- 🔐 Authentification sécurisée (Laravel Fortify)
- 🔑 Authentification à deux facteurs (2FA)
- 📧 Vérification email
- 📋 Profil utilisateur complet
- 🌐 Géolocalisation du profil
- ⚙️ Gestion des préférences (localisation, apparence)
- ✅ Modale de consentement RGPD au premier login

### 📝 Système de prêt/réservation
- 📅 Demandes de prêt avec statuts (pending, accepted, refused, completed, cancelled)
- 📍 Matching géographique automatique
- 💬 Messagerie interne par prêt
- 🔐 Partage sécurisé des coordonnées (email/téléphone/adresse)
- ✉️ Notifications par email
- 📊 Historique complet des emprunts
- ⭐ Système d'avis bidirectionnel (emprunteur/prêteur)

### 👑 Administration
- 🗂️ Gestion complète des catégories (CRUD)
- 📊 Système de popularité des items
- 🔧 Interface d'administration dédiée

### 📄 Conformité légale
- 📜 Conditions Générales d'Utilisation (CGU)
- 🔒 Politique de confidentialité
- ✅ Système de consentement utilisateur multi-types
- 🗑️ Révocation de consentement
- 📥 Export des données personnelles (RGPD)

---

## 🛠️ Stack technique

### Backend
- **Laravel 12** - Framework PHP
- **MySQL** - Base de données relationnelle
- **Laravel Fortify** - Authentification complète (login, 2FA, email verification)
- **Laravel Sanctum** - Authentification API
- **Pusher** - Notifications temps réel (prêt)
- **API Géocodage** - Service de localisation externe

### Frontend
- **React 19** - Bibliothèque UI
- **TypeScript 5** - Typage statique
- **Inertia.js 2** - Bridge Laravel/React (SPA moderne)
- **Tailwind CSS 4** - Framework CSS utility-first
- **shadcn/ui** - Composants UI accessibles (Radix UI)
- **Lucide React** - Bibliothèque d'icônes
- **Embla Carousel** - Carousel pour galeries photos

### DevOps & Tooling
- **Vite 5** - Build tool ultra-rapide
- **Docker** - Containerisation
- **Laravel Wayfinder** - Génération automatique de routes TypeScript
- **Laravel Pint** - Code style PHP (PSR-12)
- **ESLint** - Linting TypeScript
- **Git** - Versioning

---

## 📊 Statistiques du projet

### Backend
- **27 migrations** - Base de données complète
- **12 modèles Eloquent** - Relations complexes
- **14 controllers** - Architecture RESTful
- **14+ Form Requests** - Validation centralisée
- **4+ Policies** - Autorisation granulaire
- **5 Notifications** - Système d'alertes email
- **1 Service** - GeocodingService
- **1 Trait** - Likable (polymorphisme)

### Frontend
- **31 pages Inertia.js** - Navigation SPA fluide
- **40+ composants** - Réutilisabilité maximale
- **~2800 lignes TypeScript** - Code typé et robuste
- **8+ hooks personnalisés** - Logique réutilisable
- **160+ routes auto-générées** - Wayfinder

### Base de données
- **12 tables principales** - Modélisation complète
- **Relations complexes** - Parent/enfant, polymorphiques, bidirectionnelles
- **Index optimisés** - Performance des requêtes

---

## 📦 Installation

### Prérequis
- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL >= 8.0
- Git

### Étapes d'installation

```bash
# 1. Cloner le repository
git clone https://github.com/chabriermanu/My_loc_with_-lavarel_12.git
cd My_loc_with_-lavarel_12

# 2. Installer les dépendances PHP
composer install

# 3. Installer les dépendances JavaScript
npm install

# 4. Copier le fichier d'environnement
cp .env.example .env

# 5. Générer la clé d'application
php artisan key:generate

# 6. Configurer la base de données dans .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=myloc
# DB_USERNAME=root
# DB_PASSWORD=

# 7. Lancer les migrations
php artisan migrate

# 8. (Optionnel) Remplir avec des données de test
php artisan db:seed

# 9. Créer le lien symbolique pour le storage
php artisan storage:link

# 10. Compiler les assets
npm run dev
```

### Lancement

```bash
# Terminal 1 - Serveur Laravel
php artisan serve

# Terminal 2 - Serveur Vite (dev)
npm run dev

# Accéder à l'application
# http://localhost:8000
```

---

## 🗂️ Structure du projet

```
My_loc_with_-lavarel_12/
├── app/
│   ├── Console/Commands/          # Commandes Artisan
│   │   └── GeolocateExistingUsers.php
│   ├── Http/
│   │   ├── Controllers/           # Contrôleurs
│   │   │   ├── AdminCategoryController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── ItemController.php
│   │   │   ├── LoanController.php
│   │   │   ├── FavoriteController.php
│   │   │   ├── LikeController.php
│   │   │   ├── CommentController.php
│   │   │   ├── ItemMediaController.php
│   │   │   ├── ItemReviewController.php
│   │   │   ├── UserReviewController.php
│   │   │   ├── LocationController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── Settings/          # Controllers settings
│   │   │   └── Api/               # API Controllers
│   │   │       └── ConsentController.php
│   │   ├── Middleware/
│   │   │   ├── HandleInertiaRequests.php
│   │   │   ├── HandleAppearance.php
│   │   │   └── EnsureIsAdmin.php
│   │   └── Requests/              # Form Requests (14+)
│   ├── Models/                    # 12 Modèles Eloquent
│   │   ├── User.php
│   │   ├── Item.php
│   │   ├── Category.php
│   │   ├── Loan.php
│   │   ├── Favorite.php
│   │   ├── Like.php
│   │   ├── Comment.php
│   │   ├── ItemMedia.php
│   │   ├── ItemReview.php
│   │   ├── UserReview.php
│   │   ├── Message.php
│   │   └── UserConsent.php
│   ├── Notifications/             # 5 Notifications
│   │   ├── LoanApproved.php
│   │   ├── LoanRejected.php
│   │   ├── ContactRequested.php
│   │   ├── ContactShared.php
│   │   └── NewMessage.php
│   ├── Policies/                  # Policies d'autorisation
│   ├── Services/
│   │   └── GeocodingService.php   # Service géolocalisation
│   └── Traits/
│       └── Likable.php            # Trait polymorphique
├── database/
│   ├── migrations/                # 27 migrations
│   └── seeders/                   # Seeders
├── resources/
│   ├── js/
│   │   ├── Pages/                 # 31 Pages Inertia
│   │   │   ├── Welcome.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Items/             # CRUD Items
│   │   │   ├── Categories/        # CRUD Categories
│   │   │   ├── Loans/             # Gestion prêts
│   │   │   ├── Favorites/         # Favoris
│   │   │   ├── Admin/Categories/  # Admin
│   │   │   ├── Legal/             # CGU, Confidentialité
│   │   │   ├── settings/          # Settings utilisateur
│   │   │   └── auth/              # Authentification
│   │   ├── components/            # 40+ Composants
│   │   │   ├── Items/
│   │   │   │   ├── ItemCard.tsx
│   │   │   │   └── ItemMediaCarousel.tsx
│   │   │   ├── Loans/
│   │   │   │   └── LoanCard.tsx
│   │   │   ├── Consent/
│   │   │   │   └── FirstLoginConsentModal.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   ├── ReviewSection.tsx
│   │   │   ├── Nav.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   └── ui/                # shadcn/ui (25+)
│   │   ├── layouts/
│   │   │   ├── app-layout.tsx
│   │   │   ├── auth-layout.tsx
│   │   │   └── settings/layout.tsx
│   │   ├── hooks/                 # 8+ hooks
│   │   ├── types/                 # Types TypeScript
│   │   │   ├── model.ts           # Types modèles
│   │   │   ├── auth.ts
│   │   │   ├── page.ts
│   │   │   └── ui.ts
│   │   └── lib/
│   │       └── utils.ts           # Helpers
│   └── views/
│       └── app.blade.php          # Template racine
├── routes/
│   ├── web.php                    # Routes Inertia
│   └── api.php                    # Routes API
└── public/
    └── storage/                   # Symlink vers storage
```

---

## 🚀 Commandes utiles

```bash
# Développement
npm run dev              # Lancer Vite en mode dev
php artisan serve        # Lancer le serveur Laravel

# Production
npm run build            # Compiler les assets pour production

# Base de données
php artisan migrate           # Lancer les migrations
php artisan migrate:fresh     # Reset + migrations
php artisan db:seed          # Lancer les seeders

# Cache
php artisan cache:clear      # Vider le cache
php artisan config:clear     # Vider le cache de config
php artisan route:clear      # Vider le cache des routes

# Code quality
composer pint                # Formater le code PHP (PSR-12)
npm run lint                 # Linter le code TypeScript

# Wayfinder (routes TypeScript)
php artisan wayfinder:generate  # Générer les routes TS
```

---

## 📝 Fonctionnalités en cours de développement

Consultez le [ROADMAP.md](./ROADMAP.md) pour voir les fonctionnalités planifiées.

### ✅ Complété (72%)
- [x] Système d'authentification complet (login, register, 2FA)
- [x] CRUD complet des annonces (objets + services)
- [x] CRUD admin des catégories
- [x] Upload et gestion de médias multiples
- [x] Système de catégories hiérarchiques (77 catégories)
- [x] Géolocalisation utilisateurs avec calcul de distance
- [x] Système de likes polymorphique (Likable trait)
- [x] Système de favoris avec compteurs
- [x] Commentaires avec réponses imbriquées
- [x] Système de consentement RGPD complet
- [x] Pages légales (CGU, Politique de confidentialité)
- [x] Système de prêts/emprunts avec statuts
- [x] Partage sécurisé des coordonnées
- [x] Table messages (messagerie interne)
- [x] 5 Notifications email
- [x] Breadcrumbs navigation
- [x] Composants LoanCard et badges statut

### 🚧 En cours (25%)
- [ ] Affichage des commentaires (CommentList/CommentItem)
- [ ] Système de notation étoiles (StarRating component)
- [ ] Formulaires de reviews (ItemReviewForm, UserReviewForm)
- [ ] Composants génériques (Pagination, ImageUpload)
- [ ] Seeders pour données de test
- [ ] Tests unitaires et feature

### 💡 À venir (3%)
- [ ] Messagerie temps réel (Pusher/Laravel Reverb)
- [ ] Recherche avancée full-text (Laravel Scout)
- [ ] Application mobile (React Native)
- [ ] Paiement en ligne (Stripe)
- [ ] Mode sombre
- [ ] Système de badges/gamification
- [ ] PWA (Progressive Web App)

---

## 👨‍💻 Auteur

**Emmanuel Chabrier**

💻 Développeur Web Full Stack Junior  
🎓 Formation AFPA Saint-Jean-de-Védas - Diplôme prévu février 2026  
📍 Saint-Géniès-de-Fontedit, Hérault (34)

- GitHub: [@chabriermanu](https://github.com/chabriermanu)
- LinkedIn: [emmanuel-chabrier](https://www.linkedin.com/in/emmanuel-chabrier-160b68197)

---

## 📄 Licence

Ce projet a été développé dans un cadre pédagogique pour l'obtention du titre professionnel de **Développeur Web et Web Mobile**.

---

## 🙏 Remerciements

- **AFPA Saint-Jean-de-Védas** - Formation et accompagnement
- **Laravel** - Framework PHP exceptionnel
- **React & Inertia.js** - Stack moderne et efficace
- **shadcn/ui** - Bibliothèque de composants accessibles
- **Tailwind CSS** - Framework CSS utility-first

---

<div align="center">

**⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**

Made with ❤️ by Emmanuel Chabrier

**Projet MyLoc 2.0** - Plateforme de partage collaborative

</div>