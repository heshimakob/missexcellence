# Guide de déploiement - Miss Excellence

## Structure

- **Backend** : Node.js + Express sur le port 3000
- **Frontend** : React + Vite (build statique)
- **Base de données** : MongoDB
- **Serveur Web** : Nginx (reverse proxy)

## URLs

- **Site public** : `www.missexcellence.org` (ou `missexcellence.org`)
- **Admin** : `admin.missexcellence.org`
- Les deux URLs servent la même build React, React Router gère le routing

## Étapes de déploiement sur VPS (Hostinger)

### 1. Préparation du serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js (version 18 ou supérieure)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer MongoDB
# Voir: https://www.mongodb.com/docs/manual/installation/

# Installer Nginx
sudo apt install -y nginx

# Installer PM2 (gestionnaire de processus Node.js)
sudo npm install -g pm2
```

### 2. Configuration DNS

Dans votre panneau DNS Hostinger, ajoutez :
- **A Record** : `www` → IP du VPS
- **A Record** : `@` (racine) → IP du VPS  
- **A Record** : `admin` → IP du VPS

### 3. Déploiement du code

```bash
# Se connecter au VPS
ssh user@votre-ip-vps

# Créer le dossier de l'application
sudo mkdir -p /var/www/missexcellence
sudo chown -R $USER:$USER /var/www/missexcellence

# Cloner le repository
cd /var/www/missexcellence
git clone https://github.com/heshimakob/missexcellence.git .

# Ou si vous avez déjà le repo :
cd /var/www/missexcellence
git pull origin main
```

### 4. Configuration Backend

```bash
cd /var/www/missexcellence/backend

# Installer les dépendances
npm install
# ou
yarn install

# Copier et configurer les variables d'environnement
cp env.example.txt .env
nano .env  # Éditer avec vos valeurs

# Variables importantes :
# - MONGO_URI=mongodb://localhost:27017/missexcellence
# - PORT=3000
# - FRONTEND_ORIGIN=https://www.missexcellence.org,https://admin.missexcellence.org
# - ADMIN_EMAIL=votre-email@example.com
# - ADMIN_PASSWORD=votre-mot-de-passe-securise

# Créer le dossier uploads
mkdir -p public/uploads
```

### 5. Configuration Frontend

```bash
cd /var/www/missexcellence/frontend

# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp env.example.txt .env
nano .env

# Variable importante :
# VITE_API_BASE=https://www.missexcellence.org/api
# (ou utiliser l'URL du backend directement si vous préférez)

# Build de production
npm run build
```

### 6. Configuration Nginx

```bash
# Copier la configuration
sudo cp /var/www/missexcellence/nginx.conf.example /etc/nginx/sites-available/missexcellence

# Éditer la configuration (remplacer les domaines si nécessaire)
sudo nano /etc/nginx/sites-available/missexcellence

# Activer le site
sudo ln -s /etc/nginx/sites-available/missexcellence /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

### 7. Démarrer le backend avec PM2

```bash
cd /var/www/missexcellence/backend

# Démarrer l'application
pm2 start server.js --name missexcellence-backend

# Sauvegarder la configuration PM2
pm2 save

# Configurer PM2 pour démarrer au boot
pm2 startup
# Suivre les instructions affichées
```

### 8. SSL/HTTPS avec Let's Encrypt (recommandé)

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir les certificats SSL
sudo certbot --nginx -d www.missexcellence.org -d missexcellence.org -d admin.missexcellence.org

# Le certificat sera renouvelé automatiquement
```

Après SSL, décommenter les lignes HTTPS dans la config Nginx.

### 9. Mettre à jour le CORS dans backend/.env

Après avoir configuré SSL, mettre à jour `FRONTEND_ORIGIN` :
```
FRONTEND_ORIGIN=https://www.missexcellence.org,https://admin.missexcellence.org
```

Redémarrer le backend :
```bash
pm2 restart missexcellence-backend
```

## Commandes utiles

### Backend
```bash
# Voir les logs
pm2 logs missexcellence-backend

# Redémarrer
pm2 restart missexcellence-backend

# Arrêter
pm2 stop missexcellence-backend

# Statut
pm2 status
```

### Frontend
```bash
# Rebuild après modification
cd /var/www/missexcellence/frontend
npm run build
```

### Nginx
```bash
# Tester la configuration
sudo nginx -t

# Recharger la configuration
sudo systemctl reload nginx

# Redémarrer
sudo systemctl restart nginx
```

### MongoDB
```bash
# Démarrer MongoDB
sudo systemctl start mongod

# Vérifier le statut
sudo systemctl status mongod

# Activer au démarrage
sudo systemctl enable mongod
```

## Mises à jour

```bash
cd /var/www/missexcellence

# Pull les dernières modifications
git pull origin main

# Backend
cd backend
npm install  # Si nouvelles dépendances
pm2 restart missexcellence-backend

# Frontend
cd ../frontend
npm install  # Si nouvelles dépendances
npm run build
```

## Structure des dossiers sur le VPS

```
/var/www/missexcellence/
├── backend/
│   ├── public/
│   │   └── uploads/          # Images uploadées (créé automatiquement)
│   ├── .env                  # Variables d'environnement
│   └── server.js
├── frontend/
│   └── dist/                 # Build de production (créé par npm run build)
└── nginx.conf.example        # Configuration Nginx
```

## Sécurité

1. **Firewall** : Configurer UFW
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

2. **Mots de passe** : Utiliser des mots de passe forts pour l'admin
3. **SSL** : Toujours utiliser HTTPS en production
4. **Backups** : Mettre en place des backups réguliers de MongoDB

## Notes

- Les deux URLs (`www.missexcellence.org` et `admin.missexcellence.org`) servent la même build React
- React Router gère automatiquement le routing côté client
- L'admin est accessible via `/admin` sur les deux URLs
- L'authentification admin fonctionne de la même manière
