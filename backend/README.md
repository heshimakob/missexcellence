# Miss Excellence — Backend (Node.js + Express)

## Démarrage

1) Installer:

```bash
cd backend
yarn install
```

2) Variables d’environnement

Ce repo ne peut pas créer de `.env` automatiquement. Copie le fichier:

- `backend/env.example.txt` → `backend/.env`

3) Lancer en dev:

```bash
yarn dev
```

Le serveur démarre sur `http://localhost:3000`.

Note: si `localhost` ne répond pas sur ta machine, utilise `http://127.0.0.1:3000`.

## MongoDB

Ajoute dans `backend/.env`:

- `MONGO_URI=mongodb://127.0.0.1:27017/miss-excellence`

## Endpoints

- `GET /health`: healthcheck
- `GET /api/public/home`: contenu du landing (mock) pour le frontend
- `GET /api/public/blog/posts`: liste des posts (blog)
- `GET /api/public/blog/posts/:slug`: détail d’un post
- `POST /api/admin/auth/login`: login admin (mock, email/password via env)
- `POST /api/admin/auth/logout`: logout admin (mock)
- `GET /api/admin/me`: infos admin (JWT simple en mémoire — placeholder)


