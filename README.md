# 🏠 MyLoc 2.0

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-1-9553E9?style=for-the-badge&logo=inertia&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Plateforme hybride de partage et location d'objets avec système de réservation de services**

[📋 Voir le ROADMAP](./ROADMAP.md) • [🏗️ Architecture](./Architecture.md) • [🐛 Signaler un bug](https://github.com/chabriermanu/My_loc_with_-lavarel_12/issues)

</div>

---

## 📖 À propos du projet

**MyLoc 2.0** est une refonte complète du projet initial Symfony vers **Laravel 12**, développée dans le cadre de ma formation de Développeur Web Full Stack à l'AFPA. Cette plateforme permet aux utilisateurs de :

- 🎁 **Partager et emprunter** des objets entre particuliers
- 🛠️ **Proposer et réserver** des services
- 📍 **Géolocaliser** les annonces avec calcul de distance
- ❤️ **Favoriser** et **commenter** les annonces
- 🔒 **Respecter le RGPD** avec système de consentement

---

## ✨ Fonctionnalités principales

### 🎯 Gestion des annonces
- ✅ Création d'annonces (objets ou services)
- 📂 Catégorisation avancée (77 catégories)
- 🖼️ Upload multiple d'images avec carousel
- 🔍 Recherche et filtres par catégorie/type
- 💬 Système de commentaires avec réponses imbriquées
- ⭐ Likes et favoris

### 📍 Géolocalisation
- 🗺️ Localisation automatique via API
- 📏 Calcul de distance entre utilisateurs
- 🎯 Matching par proximité géographique
- 🔐 Partage RGPD-compliant des coordonnées

### 👤 Gestion utilisateur
- 🔐 Authentification sécurisée (Laravel Fortify)
- 📋 Profil utilisateur complet
- 📧 Système de contact entre utilisateurs
- ⚙️ Gestion des préférences de localisation
- ✅ Modale de consentement RGPD au premier login

### 📝 Système de prêt/réservation
- 📅 Demandes de prêt avec statuts
- ✉️ Notifications
- 📊 Historique des emprunts
- 🔄 Gestion des retours

### 📄 Conformité légale
- 📜 Conditions Générales d'Utilisation (CGU)
- 🔒 Politique de confidentialité
- ✅ Système de consentement utilisateur
- 🗑️ Révocation de consentement

---

## 🛠️ Stack technique

### Backend
- **Laravel 12** - Framework PHP
- **MySQL** - Base de données
- **Laravel Fortify** - Authentification
- **API Géocodage** - Service de localisation

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Inertia.js** - Bridge Laravel/React (SPA)
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Composants UI
- **Lucide React** - Icônes

### DevOps
- **Vite** - Build tool
- **Docker** - Containerisation
- **Git** - Versioning

---

## 📦 Installation

### Prérequis
- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL
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
│   ├── Console/Commands/       # Commandes Artisan
│   ├── Http/Controllers/       # Contrôleurs
│   │   ├── Api/               # API Controllers
│   │   └── LocationController.php
│   ├── Models/                # Modèles Eloquent
│   └── Services/              # Services métier
│       └── GeocodingService.php
├── database/
│   ├── migrations/            # Migrations BDD
│   └── seeders/               # Seeders
├── resources/
│   ├── js/
│   │   ├── components/        # Composants React
│   │   │   ├── Consent/
│   │   │   └── Items/
│   │   ├── Pages/             # Pages Inertia
│   │   │   ├── Categories/
│   │   │   ├── Favorites/
│   │   │   ├── Items/
│   │   │   ├── Legal/
│   │   │   ├── Loans/
│   │   │   └── settings/
│   │   ├── layouts/           # Layouts
│   │   └── types/             # Types TypeScript
│   └── views/                 # Vues Blade
├── routes/
│   └── web.php                # Routes web
└── public/                    # Assets publics
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
composer pint                # Formater le code PHP
npm run lint                 # Linter le code TypeScript
```

---

## 📝 Fonctionnalités en cours de développement

Consultez le [ROADMAP.md](./ROADMAP.md) pour voir les fonctionnalités planifiées.

### ✅ Complété
- [x] Système d'authentification
- [x] CRUD complet des annonces
- [x] Upload et gestion d'images
- [x] Système de catégories (77 catégories)
- [x] Géolocalisation utilisateurs
- [x] Système de likes/favoris
- [x] Commentaires avec réponses imbriquées
- [x] Système de consentement RGPD
- [x] Pages légales (CGU, Confidentialité)
- [x] Système de prêts/emprunts

### 🚧 En cours
- [ ] Messagerie privée entre utilisateurs
- [ ] Système de notation
- [ ] Notifications en temps réel
- [ ] Mode sombre

### 💡 À venir
- [ ] Application mobile (React Native)
- [ ] Paiement en ligne
- [ ] Système de badges/gamification

---

## 👨‍💻 Auteur

**Emmanuel Chabrier**

💻 Développeur Web Full Stack Junior  
🎓 Formation AFPA - Diplôme prévu février 2026  
📍 Saint-Géniès-de-Fontedit, Hérault (34)

- GitHub: [@chabriermanu](https://github.com/chabriermanu)
- LinkedIn: [emmanuel-chabrier](https://www.linkedin.com/in/emmanuel-chabrier-160b68197)

---

## 📄 Licence

Ce projet a été développé dans un cadre pédagogique pour l'obtention du titre professionnel de Développeur Web et Web Mobile.

---

## 🙏 Remerciements

- **AFPA Saint-Jean-de-Védas** - Formation et accompagnement
- **Laravel** - Framework PHP exceptionnel
- **React & Inertia.js** - Stack moderne et efficace
- **shadcn/ui** - Bibliothèque de composants

---

<div align="center">

**⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !**

Made with ❤️ by Emmanuel Chabrier

</div>