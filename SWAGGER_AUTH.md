# Guide d'authentification Swagger

Ce guide explique comment utiliser l'authentification avec l'interface Swagger de l'API Rahou.

## Comment ça fonctionne

1. **Login** : Vous devez d'abord vous connecter via l'endpoint `/auth/login`
2. **Token** : Le login retourne un token d'authentification
3. **Session** : Le token est stocké côté serveur avec toutes les informations de session
4. **Authentification** : Utilisez le token pour les appels authentifiés

## Étapes pour utiliser Swagger

### 1. Se connecter

1. Allez sur l'endpoint `POST /auth/login`
2. Cliquez sur "Try it out"
3. Entrez vos identifiants :
   ```json
   {
     "email": "votre@email.com",
     "password": "votre_mot_de_passe"
   }
   ```
4. Cliquez sur "Execute"
5. Copiez le `token` de la réponse

### 2. Configurer l'authentification dans Swagger

1. Cliquez sur le bouton "Authorize" en haut à droite de l'interface Swagger
2. Dans le champ "Value", entrez : `Bearer VOTRE_TOKEN`
   - Remplacez `VOTRE_TOKEN` par le token reçu lors du login
   - N'oubliez pas le préfixe "Bearer " (avec l'espace)
3. Cliquez sur "Authorize"
4. Cliquez sur "Close"

### 3. Utiliser les endpoints authentifiés

Maintenant vous pouvez utiliser tous les endpoints qui nécessitent une authentification :

- `POST /auth/logout` - Se déconnecter
- `GET /auth/verify` - Vérifier le token
- `GET /auth/sessions` - Voir les sessions actives

## Exemple de workflow complet

```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Réponse :
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sessionId": "sess_1234567890_abc123def",
  "user": { ... },
  "expiresAt": "2024-01-01T12:00:00.000Z"
}

# 2. Utiliser le token pour logout
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Gestion des sessions

- Les sessions sont stockées en mémoire côté serveur
- Chaque session a une durée de vie de 24 heures
- Le token est automatiquement supprimé lors du logout
- Les sessions expirées sont nettoyées automatiquement

## Dépannage

### Erreur 401 "Token required"

- Vérifiez que vous avez configuré l'authentification dans Swagger
- Assurez-vous que le token commence par "Bearer "

### Erreur 401 "Invalid or expired session"

- Votre session a peut-être expiré
- Refaites un login pour obtenir un nouveau token

### Token ne fonctionne pas

- Vérifiez que le token est correct et complet
- Assurez-vous qu'il n'y a pas d'espaces supplémentaires
- Le token doit être celui retourné par le dernier login réussi
