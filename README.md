# Miss Excellence — Fullstack (Frontend + Backend)

Ce projet contient:

- `frontend/`: React + Vite + Tailwind (site public + backoffice `/admin`)
- `backend/`: Node.js + Express (API)

Inspiration UX: [miss-france.fr](https://www.miss-france.fr/)

## Lancer en local

### 1) Backend

```bash
cd backend
npm install
cp env.example.txt .env
npm run dev
```

Le backend écoute par défaut sur `http://localhost:3000`. Si tu changes `PORT` dans `backend/.env`, aligne aussi `VITE_API_BASE` côté frontend.

### 2) Frontend

```bash
cd frontend
npm install
cp env.example.txt .env
npm run dev
```

`frontend/.env` → `VITE_API_BASE` doit pointer vers l’URL du backend (par défaut `http://localhost:3000`).

## Admin (backoffice)

- URL: `http://localhost:5173/admin`
- Credentials (par défaut): ceux définis dans `backend/.env` (voir `backend/env.example.txt`)


