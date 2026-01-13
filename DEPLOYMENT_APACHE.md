# Guide de déploiement Apache - Miss Excellence

Ce guide remplace les sections Nginx du guide principal si vous utilisez Apache.

## Structure

- **Backend** : Node.js + Express sur le port 3000
- **Frontend** : React + Vite (build statique)
- **Base de données** : MongoDB
- **Serveur Web** : Apache (reverse proxy)

## URLs

- **Site public** : `www.missexcellence.org` (ou `missexcellence.org`)
- **Admin** : `admin.missexcellence.org`
- Les deux URLs servent la même build React, React Router gère le routing

## Étapes de déploiement sur VPS avec Apache

### 1. Préparation du serveur

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js (version 18 ou supérieure)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer MongoDB
# Voir: https://www.mongodb.com/docs/manual/installation/

# Installer Apache
sudo apt install -y apache2

# Installer PM2 (gestionnaire de processus Node.js)
sudo npm install -g pm2
```

### 2. Activation des modules Apache nécessaires

```bash
# Activer les modules requis
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod expires
sudo a2enmod deflate

# Recharger Apache
sudo systemctl reload apache2
```

### 3. Configuration DNS

Dans votre panneau DNS Hostinger, ajoutez :
- **A Record** : `www` → IP du VPS
- **A Record** : `@` (racine) → IP du VPS  
- **A Record** : `admin` → IP du VPS

### 4. Déploiement du code

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

### 5. Configuration Backend

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

### 6. Configuration Frontend

```bash
cd /var/www/missexcellence/frontend

# Installer les dépendances
npm install

# Copier et configurer les variables d'environnement
cp env.example.txt .env
nano .env

# Variable importante :
# VITE_API_BASE=https://www.missexcellence.org/api

# Build de production
npm run build
```

### 7. Configuration Apache

```bash
# Copier la configuration
sudo cp /var/www/missexcellence/apache.conf.example /etc/apache2/sites-available/missexcellence.conf

# Éditer la configuration (remplacer les domaines si nécessaire)
sudo nano /etc/apache2/sites-available/missexcellence.conf

# Vérifier/modifier les chemins dans le fichier :
# - DocumentRoot doit pointer vers /var/www/missexcellence/frontend/dist
# - Les ServerName doivent correspondre à vos domaines

# Activer le site
sudo a2ensite missexcellence.conf

# Désactiver le site par défaut (optionnel)
sudo a2dissite 000-default.conf

# Tester la configuration
sudo apache2ctl configtest

# Si OK, recharger Apache
sudo systemctl reload apache2
```

### 8. Démarrer le backend avec PM2

```bash
cd /var/www/missexcellence/backend

# Démarrer l'application
pm2 start server.js --name missexcellence-backend

# Vérifier que ça fonctionne
pm2 status
pm2 logs missexcellence-backend

# Sauvegarder la configuration
pm2 save

# Configurer pour démarrer au boot (suivre les instructions affichées)
pm2 startup
```

### 9. SSL/HTTPS (Let's Encrypt avec Certbot)

```bash
# Installer Certbot pour Apache
sudo apt install -y certbot python3-certbot-apache

# Obtenir les certificats (remplacer par vos domaines)
sudo certbot --apache -d www.missexcellence.org -d missexcellence.org -d admin.missexcellence.org

# Le certificat sera renouvelé automatiquement

# Vérifier la configuration SSL
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Certbot modifiera automatiquement votre configuration Apache pour inclure HTTPS.

## Vérification finale

1. **Vérifier le backend :**
   ```bash
   pm2 status
   curl http://localhost:3000/health
   ```

2. **Vérifier Apache :**
   ```bash
   sudo systemctl status apache2
   ```

3. **Tester les URLs :**
   - `http://www.missexcellence.org` → devrait afficher le site
   - `http://admin.missexcellence.org` → devrait afficher le site (admin accessible via /admin)

## En cas de problème

### Logs backend
```bash
pm2 logs missexcellence-backend
```

### Logs Apache
```bash
# Logs d'erreur
sudo tail -f /var/log/apache2/missexcellence_error.log
sudo tail -f /var/log/apache2/error.log

# Logs d'accès
sudo tail -f /var/log/apache2/missexcellence_access.log
sudo tail -f /var/log/apache2/access.log
```

### Vérifier que MongoDB fonctionne
```bash
sudo systemctl status mongod
```

### Vérifier les permissions
```bash
# S'assurer que les fichiers appartiennent au bon utilisateur
sudo chown -R $USER:$USER /var/www/missexcellence

# Vérifier les permissions du dossier dist
ls -la /var/www/missexcellence/frontend/dist
```

### Vérifier que les modules Apache sont activés
```bash
apache2ctl -M | grep -E "proxy|rewrite|headers|expires|deflate"
```

### Problèmes courants

#### Erreur 403 Forbidden
- Vérifier les permissions : `sudo chown -R $USER:$USER /var/www/missexcellence`
- Vérifier la configuration `<Directory>` dans Apache

#### Les images ne s'affichent pas
- Vérifier que le proxy `/static` fonctionne : `curl http://localhost:3000/static/uploads/FICHIER.jpg`
- Vérifier les logs Apache pour les erreurs 404
- Vérifier la configuration ProxyPass /static dans Apache

#### Le routing React ne fonctionne pas (404 sur les routes)
- Vérifier que mod_rewrite est activé : `sudo a2enmod rewrite`
- Vérifier les règles RewriteRule dans la configuration Apache
- Vérifier que AllowOverride est activé dans la configuration `<Directory>`

#### Erreur "AH00558: apache2: Could not reliably determine the server's fully qualified domain name"
- Ajouter `ServerName localhost` dans `/etc/apache2/apache2.conf` ou dans votre VirtualHost
