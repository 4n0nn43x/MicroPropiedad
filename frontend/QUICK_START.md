# 🚀 Quick Start Guide - MicroPropiedad Frontend

## URLs Correctes

Avec notre configuration i18n, **toutes les URLs doivent inclure le locale** (langue):

### ✅ URLs Valides
```
http://localhost:3000/           → Redirige automatiquement vers /en
http://localhost:3000/en         → Landing page (English)
http://localhost:3000/es         → Landing page (Español)
http://localhost:3000/en/login   → Login page (English)
http://localhost:3000/es/login   → Login page (Español)
http://localhost:3000/en/marketplace → Marketplace (English)
http://localhost:3000/es/marketplace → Marketplace (Español)
http://localhost:3000/en/dashboard   → Dashboard (English)
http://localhost:3000/es/dashboard   → Dashboard (Español)
```

### ❌ URLs Invalides (404 Error)
```
http://localhost:3000/login       → ❌ Manque le locale
http://localhost:3000/marketplace → ❌ Manque le locale
http://localhost:3000/dashboard   → ❌ Manque le locale
```

## Navigation

### Dans l'Application
Utilisez les liens dans le Header - ils incluent automatiquement le bon locale:
- **Logo MicroPropiedad** → Retour à la page d'accueil (`/en` ou `/es`)
- **Explore Properties** → Marketplace (`/en/marketplace` ou `/es/marketplace`)
- **Dashboard** → Dashboard (`/en/dashboard` ou `/es/dashboard`)

### Changement de Langue
Cliquez sur **EN** ou **ES** dans le header:
- Reste sur la même page
- Change juste la langue
- Par exemple: `/en/marketplace` → `/es/marketplace`

## Test Rapide

1. **Démarrer le serveur**
   ```bash
   npm run dev
   ```

2. **Ouvrir le navigateur**
   ```
   http://localhost:3000
   ```
   → Sera redirigé automatiquement vers `http://localhost:3000/en`

3. **Tester la navigation**
   - Cliquez sur "Start Investing" dans le Hero → Va vers `/en/login`
   - Cliquez sur "Explore Properties" dans le Header → Va vers `/en/marketplace`
   - Cliquez sur "ES" dans le Header → Change en Espagnol

4. **Tester le changement de langue**
   - Sur `/en/marketplace`, cliquez sur **ES**
   - L'URL devient `/es/marketplace`
   - Le contenu passe en espagnol

## Résolution des Erreurs

### Erreur 404 "Page Not Found"
**Cause**: Vous essayez d'accéder à une URL sans locale (ex: `/marketplace`)

**Solution**: Ajoutez `/en/` ou `/es/` au début:
- `/marketplace` → `/en/marketplace`
- `/login` → `/en/login`

### Erreur d'Hydration React
**Cause**: Incompatibilité server/client rendering

**Solution**:
1. Rechargez la page (Ctrl+R / Cmd+R)
2. Si persiste, arrêtez le serveur (Ctrl+C) et redémarrez:
   ```bash
   npm run dev
   ```

### Images Manquantes
**Cause**: Les images de bâtiments ne sont pas téléchargées

**Solution**: Voir `/public/images/IMAGE_GUIDE.md` pour télécharger les images

## Pages Disponibles

| Page | URL EN | URL ES |
|------|--------|--------|
| Landing | `/en` | `/es` |
| Login | `/en/login` | `/es/login` |
| Marketplace | `/en/marketplace` | `/es/marketplace` |
| Dashboard | `/en/dashboard` | `/es/dashboard` |

## Fonctionnalités

### ✅ Implémenté
- Landing page complète (Hero, Features, How It Works, FAQ)
- Login page avec sélection de wallet
- Header avec navigation et bouton wallet
- Footer avec liens
- Changement de langue (EN/ES)
- Routing i18n automatique

### ⏳ À Implémenter
- Liste de propriétés dans Marketplace
- Page détail d'une propriété
- Dashboard avec portfolio
- Connexion réelle aux smart contracts

## Prochaines Étapes

1. **Télécharger des images de bâtiments** (optionnel, 5 min)
   - Voir `public/images/IMAGE_GUIDE.md`

2. **Tester la connexion wallet** (nécessite extension de wallet)
   - Installer Xverse, Leather ou Hiro wallet
   - Aller sur `/en/login`
   - Cliquer sur une option de wallet
   - Approuver la connexion

3. **Déployer les smart contracts** sur testnet
   - Mettre à jour `.env.local` avec l'adresse du contrat
   - Tester l'achat de shares

## Support

**Documentation complète**: `frontend/README.md`

**Problèmes courants**:
- URLs: Toujours inclure `/en/` ou `/es/`
- Navigation: Utiliser les liens du Header
- Langue: Utiliser le switcher EN/ES
- Erreurs: Recharger la page ou redémarrer le serveur

---

**Bon test! 🚀**
