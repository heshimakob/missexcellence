# Étapes de déploiement - Checklist

## ✅ Frontend - TERMINÉ
- [x] npm install
- [x] Configuration .env
- [x] npm run build

## 📋 Prochaines étapes sur le VPS

### Étape 4 : Configuration Backend

```bash
cd /var/www/missexcellence/backend

# Installer les dépendances
npm install
# ou si vous utilisez yarn:
yarn install

# Copier le fichier d'exemple vers .env
cp env.example.txt .env

# Éditer le fichier .env
nano .env
```

**Variables à configurer dans backend/.env :**
```env
NODE_ENV=production
PORT=3000
FRONTEND_ORIGIN=https://www.missexcellence.org,https://admin.missexcellence.org
ADMIN_EMAIL=votre-email@example.com
ADMIN_PASSWORD=votre-mot-de-passe-tres-securise
MONGO_URI=mongodb://localhost:27017/missexcellence
```

**Important :** Remplacez `www.missexcellence.org` et `admin.missexcellence.org` par vos vrais domaines si différents.

```bash
# Créer le dossier uploads (s'il n'existe pas)
mkdir -p public/uploads
```

### Étape 6 : Configuration Nginx

```bash
# Copier la configuration Nginx
sudo cp /var/www/missexcellence/nginx.conf.example /etc/nginx/sites-available/missexcellence

# Éditer la configuration (remplacer les domaines si nécessaire)
sudo nano /etc/nginx/sites-available/missexcellence
```

**Dans le fichier Nginx, vérifiez :**
- Ligne 8 : `server_name www.missexcellence.org missexcellence.org;` → vos domaines
- Ligne 18 : `root /var/www/missexcellence/frontend/dist;` → chemin correct
- Ligne 61 : `server_name admin.missexcellence.org;` → votre sous-domaine admin
- Ligne 71 : `root /var/www/missexcellence/frontend/dist;` → même chemin

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/missexcellence /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Si OK, recharger Nginx
sudo systemctl reload nginx
```

### Étape 7 : Démarrer le backend avec PM2

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

### Étape 8 : SSL/HTTPS (Let's Encrypt)

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir les certificats (remplacer par vos domaines)
sudo certbot --nginx -d www.missexcellence.org -d missexcellence.org -d admin.missexcellence.org

# Le certificat sera renouvelé automatiquement
```

**Après SSL, dans nginx.conf :**
- Décommenter les lignes HTTPS (lignes 14-16 et 64-66)
- Décommenter la redirection HTTP → HTTPS (lignes 11 et 57)
- Recharger Nginx : `sudo systemctl reload nginx`

## Vérification finale

1. **Vérifier le backend :**
   ```bash
   pm2 status
   curl http://localhost:3000/health
   ```

2. **Vérifier Nginx :**
   ```bash
   sudo systemctl status nginx
   ```

3. **Tester les URLs :**
   - `http://www.missexcellence.org` → devrait afficher le site
   - `http://admin.missexcellence.org` → devrait afficher le site (admin accessible via /admin)

## En cas de problème

### Logs backend
```bash
pm2 logs missexcellence-backend
```

### Logs Nginx
```bash
sudo tail -f /var/log/nginx/error.log
```

### Vérifier que MongoDB fonctionne
```bash
sudo systemctl status mongod
```

### Vérifier les permissions
```bash
# S'assurer que les fichiers appartiennent au bon utilisateur
sudo chown -R $USER:$USER /var/www/missexcellence
```
