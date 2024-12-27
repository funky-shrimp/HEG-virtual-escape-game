Virtual Escape Game – Vue 3 + Tailwind

Ce projet consiste à créer un escape game virtuel utilisant Vue.js (version 3) et Tailwind CSS. L’idée est d’avoir une expérience de jeu interactive, avec des zones cliquables, un système d’énigmes, et une interface d’administration pour modifier facilement le contenu (indices, solutions, etc.).
Sommaire

    Technologies
    Installation et démarrage
    Structure du projet
    Conventions de code
    Style Guide (Couleurs & Typo)
    Workflow Git / Collaboration

Technologies

    Vue.js 3
        Créé avec l’outil de scaffolding npm create vue@latest.
        Utilise la syntaxe <script setup> pour une approche plus concise.
        Vue Router pour la navigation (pages / vues).

    Tailwind CSS
        Permet un stylage rapide via des classes utilitaires.
        Facile à personnaliser grâce au fichier tailwind.config.js.

    Possibilité d’un backend (selon les besoins)
        Actuellement, le projet n’inclut pas de backend lourd.
        Les énigmes et indices pourraient être gérés via un simple fichier JSON ou un service type JSON-Server / Firebase.

Installation et démarrage

    Cloner le repo

git clone git@github.com:ClementKunzi/HEG-virtual-escape-game.git
cd HEG-virtual-escape-game

Installer les dépendances

npm install

Démarrer le serveur de développement

    npm run dev

    Accéder à l’application
    Ouvre ton navigateur sur http://localhost:5173 (ou autre port indiqué).

Structure du projet

├─ public/                  # Fichiers statiques (favicon, images si besoin)
├─ src/
│  ├─ assets/
│  │  ├─ main.css          # Fichier principal Tailwind (import & config)
│  │  └─ ...               # Autres assets (images, fonts, etc.)
│  ├─ components/          # Composants réutilisables
│  │  ├─ TheWelcome.vue
│  │  └─ ...
│  ├─ views/               # Pages / Vues principales associées aux routes
│  │  ├─ HelloView.vue
|  |  ├─ Admin/
│  │  |  ├─ AdminView.vue
|  |  ├─ Rooms/
│  │  └─ ...
│  ├─ router/
│  │  └─ index.js          # Configuration du Vue Router
│  ├─ App.vue              # Composant racine
│  └─ main.js             # Point d'entrée de l'application
├─ .gitignore
├─ index.html
├─ package.json
├─ postcss.config.js       # Config PostCSS pour Tailwind
├─ tailwind.config.js      # Config tailwind
├─ vite.config.js          # Config Vite (le bundler)
└─ README.md               # Documentation du projet (ce fichier)

Principes d’organisation

    views/ : Contient les composantes “pages” (ex. HomeView, AdminView, etc.).
    components/ : Contient les composantes réutilisables (boutons, sections, zones interactives).
    router/index.js : Déclare les routes (/, /admin, /room1, etc.).

Style Guide (Couleurs & Typo)

    Police : Montserrat
        Importée dans index.html ou via @import dans main.css.
    Couleurs (définies dans tailwind.config.js) :
        primary: #1E3A8A (bleu foncé)
        secondary: #3B82F6 (bleu clair)
        accent: #FBBF24 (jaune)
        text: #111827 (gris très foncé)
        neutral: #F9FAFB (gris très clair)

Exemples de classes Tailwind

    Titres
        .title-1 : text-3xl font-bold tracking-wide mb-4
        .title-2 : text-2xl font-semibold mb-3
    Paragraphes
        .paragraph : text-base leading-6
    Boutons
        .btn : px-4 py-2 rounded-md font-semibold transition duration-200
        .btn-primary : bg-primary text-white hover:bg-blue-900
        .btn-secondary : border-2 border-primary text-primary hover:bg-primary hover:text-white
