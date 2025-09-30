# Merchant Abstraction Layer (MAL)

## Vue d'ensemble

Ce projet implémente une couche d'abstraction marchand (MAL) qui reverse l'application e-commerce Rahou pour exposer ses fonctionnalités via une API REST unifiée.

## Objectif

L'objectif principal est de comprendre le système de login de Rahou et de créer une API REST qui permet d'interagir avec cette plateforme e-commerce de manière standardisée.

## Architecture

```
src/
├── config/           # Configuration
│   └── environment.ts # Variables d'environnement centralisées
├── routes/           # Endpoints REST
│   ├── auth.ts      # Authentification (login, logout, verify)
│   ├── health.ts    # Health check
│   └── index.ts     # Endpoints généraux
├── services/         # Logique métier
│   ├── rahouService.ts    # Service d'intégration avec Rahou
│   └── sessionService.ts  # Gestion des sessions
├── middleware/       # Middlewares Express
│   └── auth.ts      # Middleware d'authentification
├── types/           # Types TypeScript
│   ├── user.ts      # Types utilisateur
├── swagger.ts       # Configuration Swagger/OpenAPI
└── index.ts         # Point d'entrée de l'application
```

## Fonctionnalités

### 🔐 Authentification

- **POST /auth/login** - Connexion utilisateur avec credentials Rahou
- **POST /auth/logout** - Déconnexion utilisateur
- **GET /auth/verify** - Vérification de la validité du token

### 📊 Monitoring

- **GET /health** - Statut de santé de l'API
- **GET /** - Informations générales de l'API

### 📚 Documentation

- **GET /swagger** - Interface Swagger UI
- **GET /swagger/swagger.json** - Spécification OpenAPI

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivant le .env.example

### Configuration centralisée

Toutes les variables d'environnement sont gérées dans `src/config/index.ts` pour une configuration centralisée et typée.

## Développement

### Installation

```bash
npm install
```

### Démarrage en développement

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Tests

```bash
npm test
```

## Prochaines étapes

1. **Analyse de Rahou** - Comprendre le système d'authentification
2. **Reverse Engineering** - Identifier les endpoints et flux d'authentification
3. **Implémentation** - Coder la logique d'intégration réelle
4. **Tests** - Valider l'intégration avec Rahou
5. **Documentation** - Finaliser la documentation API

## Endpoints à implémenter

### Phase 1: Authentification

- [x] Structure de base
- [ ] Analyse du login Rahou
- [ ] Implémentation du login
- [ ] Gestion des sessions
- [ ] Logout

### Phase 2: Données utilisateur

- [ ] Profil utilisateur
- [ ] Commandes
- [ ] Historique

### Phase 3: Fonctionnalités marchand

- [ ] Gestion des produits
- [ ] Gestion des commandes
- [ ] Analytics

## Notes techniques

- Utilise Express.js avec TypeScript
- Documentation automatique avec Swagger/OpenAPI
- Architecture modulaire pour faciliter l'extension
- Middleware d'authentification réutilisable
- Service d'abstraction pour Rahou
