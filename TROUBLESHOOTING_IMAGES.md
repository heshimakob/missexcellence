# Dépannage : Images ne s'affichent pas en production

## Vérifications à faire

### 1. Configuration Frontend (`.env`)

Dans `frontend/.env`, vérifiez que `VITE_API_BASE` pointe vers votre domaine :

```env
VITE_API_BASE=https://www.missexcellence.org/api
```

**Important** : Après modification du `.env`, vous devez **rebuilder** le frontend :

```bash
cd /var/www/missexcellence/frontend
npm run build
```

### 2. Configuration Apache (ou Nginx)

#### Si vous utilisez Apache :

Vérifiez que la configuration Apache inclut bien le proxy pour `/static` :

```apache
# Proxy pour les fichiers statiques du backend (images uploads, etc.)
ProxyPass /static http://localhost:3000/static
ProxyPassReverse /static http://localhost:3000/static
```

**Important** : Ces directives doivent être dans votre VirtualHost, généralement avant la configuration `<Directory>`.

#### Si vous utilisez Nginx :

Vérifiez que la configuration Nginx inclut bien le proxy pour `/static` :

```nginx
# Proxy pour les fichiers statiques du backend (images uploads, etc.)
location /static {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

**Important** : Cette configuration doit être **avant** le bloc `location /` qui gère le SPA React.

### 3. Vérifier que le backend sert les fichiers statiques

Sur le serveur, testez directement :

```bash
# Tester si le backend sert les images
curl http://localhost:3000/static/uploads/NOM_DU_FICHIER.jpg

# Si ça fonctionne, tester via Apache/Nginx
curl https://www.missexcellence.org/static/uploads/NOM_DU_FICHIER.jpg
```

### 4. Vérifier les permissions des fichiers

Les fichiers dans `backend/public/uploads/` doivent être lisibles :

```bash
cd /var/www/missexcellence/backend
ls -la public/uploads/
# Les fichiers doivent avoir les permissions -rw-r--r--
```

Si nécessaire, corrigez les permissions :

```bash
sudo chown -R $USER:$USER public/uploads/
chmod -R 644 public/uploads/*
```

### 5. Vérifier les logs

**Logs Apache** :
```bash
# Logs d'erreur
sudo tail -f /var/log/apache2/missexcellence_error.log
sudo tail -f /var/log/apache2/error.log

# Logs d'accès
sudo tail -f /var/log/apache2/missexcellence_access.log
```

**Logs Nginx** (si vous utilisez Nginx) :
```bash
sudo tail -f /var/log/nginx/error.log
```

**Logs Backend (PM2)** :
```bash
pm2 logs missexcellence-backend
```

### 6. Vérifier que le backend écoute sur le bon port

```bash
# Vérifier que le backend tourne
pm2 status

# Vérifier que le port 3000 est utilisé
sudo netstat -tlnp | grep 3000
# ou
sudo ss -tlnp | grep 3000
```

### 7. Test dans le navigateur

1. Ouvrez la console développeur (F12)
2. Allez dans l'onglet "Network" (Réseau)
3. Rechargez la page
4. Cherchez les requêtes vers `/static/...` ou `/api/...`
5. Vérifiez :
   - Le code HTTP (doit être 200, pas 404 ou 500)
   - L'URL complète de la requête
   - Les erreurs CORS éventuelles

### 8. Problèmes courants

#### Erreur 404 sur `/static/...`
- Vérifiez que le dossier `backend/public/uploads/` contient bien les fichiers
- Vérifiez que le backend sert bien les fichiers statiques (route `/static` dans `app.js`)
- Vérifiez la configuration Nginx pour `/static`

#### Erreur CORS
- Vérifiez la configuration `FRONTEND_ORIGIN` dans `backend/.env`
- Doit contenir vos domaines de production séparés par des virgules :
  ```
  FRONTEND_ORIGIN=https://www.missexcellence.org,https://admin.missexcellence.org
  ```
- Redémarrez le backend après modification :
  ```bash
  pm2 restart missexcellence-backend
  ```

#### Les images ne se chargent pas du tout
- Vérifiez que `VITE_API_BASE` est bien défini dans `frontend/.env`
- Vérifiez que vous avez bien rebuild le frontend après modification
- Vérifiez que Nginx sert bien le nouveau build (`/var/www/missexcellence/frontend/dist`)

#### Les images se chargent mais sont blanches/cassées
- Vérifiez les permissions des fichiers
- Vérifiez que les fichiers existent bien sur le serveur
- Vérifiez le type MIME dans les headers (devrait être `image/jpeg`, `image/png`, etc.)

## Solution rapide (checklist)

1. ✅ `frontend/.env` : `VITE_API_BASE=https://www.missexcellence.org/api`
2. ✅ Rebuild frontend : `cd frontend && npm run build`
3. ✅ Apache/Nginx config : proxy `/static` présent
4. ✅ Apache reload : `sudo systemctl reload apache2` (ou Nginx : `sudo systemctl reload nginx`)
5. ✅ Backend `.env` : `FRONTEND_ORIGIN` contient les domaines de production
6. ✅ Backend restart : `pm2 restart missexcellence-backend`
7. ✅ Permissions : fichiers uploads lisibles
8. ✅ Test : `curl https://www.missexcellence.org/static/uploads/FICHIER.jpg`
