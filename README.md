# Tableau de Bord de Gestion Commerciale

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-06B6D4?logo=tailwind-css)](https://tailwindcss.com/)

Un tableau de bord moderne et réactif pour la gestion commerciale, développé avec React, Redux Toolkit et Tailwind CSS. Cette application permet de suivre les ventes, gérer les produits et analyser les performances commerciales.

## Fonctionnalités

### 📊 Tableau de Bord
- Vue d'ensemble des performances commerciales
- Graphiques interactifs (lignes et secteurs)
- Indicateurs clés de performance (KPI)
- Filtrage par catégorie

### 🛍️ Gestion des Produits
- Liste complète des produits avec pagination
- Ajout, modification et suppression de produits
- Téléchargement d'images pour les produits
- Filtrage et recherche avancée

### 📈 Analyse des Ventes
- Suivi des ventes mensuelles
- Analyse des tendances
- Revenu total et ventes totales

## Prérequis

- Node.js (version 14 ou supérieure)
- npm (version 6 ou supérieure) ou yarn

## Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/laylaelamrani/sales-dashboard.git
   cd sales-dashboard
   ```

2. Installer les dépendances :
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Lancer l'application en mode développement :
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Ouvrir [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## Structure du Projet

```
src/
├── components/       # Composants réutilisables
├── pages/            # Pages de l'application
├── redux/            # Configuration Redux
│   ├── store.js      # Configuration du store Redux
│   └── slices/       # Redux slices
├── assets/           # Images et fichiers statiques
└── App.jsx           # Composant racine
```

## Technologies Utilisées

- **React** - Bibliothèque JavaScript pour les interfaces utilisateur
- **Redux Toolkit** - Gestion d'état prévisible
- **React Router** - Navigation entre les pages
- **Tailwind CSS** - Framework CSS utilitaire
- **Recharts** - Bibliothèque de graphiques
- **Lucide Icons** - Icônes modernes
- **Vite** - Outil de build et développement rapide

## Déploiement

Pour créer une version de production :

```bash
npm run build
# ou
yarn build
```

Les fichiers de production seront générés dans le dossier `dist/`.

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## Auteur

- EL AMRANI Layla(https://github.com/laylaelamrani)   


