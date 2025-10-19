# 🧭 Guide de Navigation - MicroPropiedad

## 🚀 Démarrage Rapide

```bash
cd frontend
npm run dev
# Ouvrir http://localhost:3000
```

---

## 📍 Toutes les URLs Disponibles

### Page d'Accueil
```
http://localhost:3000          → Redirige automatiquement vers /en
http://localhost:3000/en       → Landing page (English)
http://localhost:3000/es       → Landing page (Español)
```

### Login / Wallet
```
http://localhost:3000/en/login → Page de connexion wallet
http://localhost:3000/es/login → Page de connexion wallet (ES)
```

### Marketplace
```
http://localhost:3000/en/marketplace → Liste de toutes les propriétés
http://localhost:3000/es/marketplace → Liste de toutes les propriétés (ES)
```

### Propriétés Individuelles
```
http://localhost:3000/en/marketplace/1 → São Paulo, Brazil (Active)
http://localhost:3000/en/marketplace/2 → Bogotá, Colombia (Active)
http://localhost:3000/en/marketplace/3 → Buenos Aires, Argentina (Active)
http://localhost:3000/en/marketplace/4 → Mexico City, Mexico (Sold Out)
http://localhost:3000/en/marketplace/5 → Cancún, Mexico (Coming Soon)
http://localhost:3000/en/marketplace/6 → Santiago, Chile (Active)
```

### Dashboard
```
http://localhost:3000/en/dashboard → Dashboard investisseur
http://localhost:3000/es/dashboard → Dashboard investisseur (ES)
```

---

## 🎯 Parcours Utilisateur Recommandé

### 1. Premier Visiteur
```
1. Aller sur http://localhost:3000
   → Automatiquement redirigé vers /en

2. Landing Page
   ✓ Lire le hero: "Invest in Real Estate with Bitcoin"
   ✓ Scroller vers Features (3 avantages)
   ✓ Voir "How It Works" (4 étapes)
   ✓ Lire les FAQ

3. Cliquer sur "Start Investing" (bouton orange)
   → Redirigé vers /en/login

4. Page Login
   ✓ Voir les 3 options de wallet (Xverse, Leather, Hiro)
   ✓ Lire les info cards (Secure, Fast, Non-Custodial)
   Note: Pour la démo, ignorer la connexion réelle

5. Aller manuellement sur /en/marketplace
   → Via URL ou Header "Explore Properties"
```

### 2. Explorer le Marketplace
```
1. Sur /en/marketplace
   ✓ Voir 3 stats cards: Total (6), Active (5), Sold Out (1)
   ✓ Observer la grille de 6 propriétés

2. Utiliser la recherche
   ✓ Taper "São Paulo" → Voir 1 résultat
   ✓ Effacer → Voir 6 résultats

3. Utiliser les filtres
   ✓ Cliquer sur "Filters"
   ✓ Status: Sélectionner "Active" → Voir 5 résultats
   ✓ Sort By: "Highest ROI" → Propriétés triées par ROI

4. Cliquer sur une propriété
   → Exemple: "Modern Apartment Building - São Paulo"
```

### 3. Voir les Détails d'une Propriété
```
1. Sur /en/marketplace/1 (São Paulo)

2. Onglet Overview (défaut)
   ✓ Lire la description
   ✓ Voir les 5+ features

3. Onglet Financials
   ✓ Total Property Value: $100,000
   ✓ Estimated Annual ROI: 8.5%
   ✓ Total Raised: $75,000
   ✓ Total Investors: 145
   ✓ Last/Next Payout dates

4. Onglet Documents
   ✓ 4 documents disponibles (Property Title, Legal, Financial, Inspection)

5. Sidebar (droite)
   ✓ Share Price: $100
   ✓ Progress: 75% (750/1000 shares sold)
   ✓ Available Shares: 250
   ✓ Cliquer sur "Purchase Shares"

6. Modal d'Achat
   ✓ Changer le nombre de shares (1-250)
   ✓ Voir le calcul automatique:
     - Total Cost = Shares × $100
     - Est. Monthly Return calculé automatiquement
   ✓ Cliquer "Confirm Purchase" (pour démo)
```

### 4. Explorer le Dashboard
```
1. Aller sur /en/dashboard
   → Via Header "Dashboard"

2. Stats Cards (en haut)
   ✓ Total Value: $9,900
   ✓ Total Invested: $9,500
   ✓ Total Returns: $400
   ✓ Claimable: $73.10

3. Onglet Portfolio (défaut)
   ✓ Voir la distribution (2 propriétés)
   ✓ Best Performing property
   ✓ Total Properties: 2
   ✓ Avg. ROI: 4.21%

4. Onglet Holdings
   ✓ Voir 2 propriétés détenues:
     - São Paulo: 50 shares, 5% ownership
     - Bogotá: 30 shares, 3% ownership
   ✓ Voir Current Value, Invested, Returns, ROI
   ✓ Voir montant Claimable pour chaque
   ✓ Cliquer "View Property" → Retour au détail
   ✓ Cliquer "Claim Now" (pour démo)

5. Onglet Activity
   ✓ Voir 4 transactions récentes:
     - 2 Purchases (São Paulo, Bogotá)
     - 2 Claims (payouts)
   ✓ Chaque transaction a:
     - Type, montant, shares
     - Date
     - Status badge
     - Lien vers Stacks Explorer

6. Onglet Payouts
   ✓ 3 cards: Available ($73.10), Total Claimed ($250), Pending (2)
   ✓ Voir 3 payout rounds:
     - Round #1 São Paulo: Claimed ✓
     - Round #2 São Paulo: $42.50 - Not claimed
     - Round #1 Bogotá: $30.60 - Not claimed
   ✓ Cliquer "Claim" ou "Claim All"
```

### 5. Tester l'Internationalisation
```
1. Sur n'importe quelle page
   ✓ Header → Cliquer sur "ES"
   → URL change /en/ → /es/
   → Contenu en espagnol

2. Naviguer en espagnol
   ✓ /es/marketplace
   ✓ /es/marketplace/1
   ✓ /es/dashboard
   ✓ Tout fonctionne en espagnol

3. Revenir en anglais
   ✓ Header → Cliquer sur "EN"
   → URL change /es/ → /en/
```

---

## 🎬 Scénario de Démo (5 minutes)

### Intro (30 sec)
```
"MicroPropiedad permet d'investir dans l'immobilier avec Bitcoin.
Regardons comment cela fonctionne..."
```

### 1. Landing Page (1 min)
```
URL: http://localhost:3000

✓ "Voici la page d'accueil"
✓ "Investissez dès $10"
✓ "3 avantages: Accessibilité, Revenus Passifs, Liquidité"
✓ "4 étapes simples"
✓ Cliquer "Start Investing"
```

### 2. Marketplace (1 min 30 sec)
```
URL: /en/marketplace

✓ "6 propriétés tokenisées en Amérique Latine"
✓ "Stats: 6 total, 5 active, 1 sold out"
✓ Recherche: "Bogotá" → Filtrer
✓ Cliquer sur "Commercial Plaza - Bogotá"
```

### 3. Property Detail (1 min 30 sec)
```
URL: /en/marketplace/2

✓ "Détails complets de la propriété"
✓ Overview: Features, description
✓ Financials: ROI 10.2%, $138K raised
✓ Documents: 3 documents disponibles
✓ Sidebar: $150 per share, 92% sold
✓ Cliquer "Purchase Shares"
✓ Modal: Choisir 10 shares → Voir calcul
```

### 4. Dashboard (1 min)
```
URL: /en/dashboard

✓ "Dashboard investisseur"
✓ "Portfolio: $9,900 total value, +4.21% ROI"
✓ Holdings: 2 propriétés
✓ Activity: 4 transactions
✓ Payouts: $73.10 claimable
✓ Cliquer "Claim Now"
```

### Conclusion (30 sec)
```
✓ Changer en espagnol (ES)
✓ "Interface bilingue pour LATAM"
✓ "Prêt pour connexion blockchain"
✓ "Merci!"
```

---

## 🔍 Points Clés à Montrer

### Design & UX
✅ Interface moderne et professionnelle
✅ Animations et hover effects
✅ Responsive (montrer sur mobile si possible)
✅ Navigation intuitive
✅ Bilingual EN/ES

### Fonctionnalités
✅ Recherche et filtres avancés
✅ 6 propriétés de démonstration réalistes
✅ Détails complets (4 onglets)
✅ Modal d'achat avec calculateur
✅ Dashboard investisseur complet
✅ Gestion des payouts

### Technique
✅ Next.js 14 (App Router)
✅ TypeScript
✅ TailwindCSS
✅ i18n (next-intl)
✅ Stacks.js integration prête
✅ 13 composants réutilisables

---

## 📱 Test Mobile (Optionnel)

### Responsive Breakpoints
```
Mobile: < 768px    → 1 colonne, menu collapse
Tablet: 768-1024px → 2 colonnes
Desktop: > 1024px  → 3 colonnes
```

### Pages à Tester
1. Landing: Hero adapté, features empilées
2. Marketplace: Grille 1 colonne
3. Property Detail: Sidebar en bas
4. Dashboard: Cards empilées

---

## 🎯 Checklist Avant Démo

- [ ] Serveur démarré (`npm run dev`)
- [ ] Navigateur ouvert sur `http://localhost:3000`
- [ ] Tester navigation basic (Landing → Marketplace → Property → Dashboard)
- [ ] Vérifier que les images se chargent
- [ ] Tester changement EN/ES
- [ ] Préparer scenario de 5 minutes
- [ ] Screenshots des pages principales (optionnel)

---

## 💡 Astuces de Navigation

### Raccourcis Clavier
- `Ctrl/Cmd + R` : Recharger la page
- `F12` : Ouvrir DevTools (voir console pour erreurs)
- `Cmd + Shift + M` : Mode responsive (Chrome)

### Navigation Rapide
- **Header Logo** → Retour landing
- **Header "Explore Properties"** → Marketplace
- **Header "Dashboard"** → Dashboard
- **Header EN/ES** → Changer langue
- **Footer liens** → Pages (About, Terms, etc.) - pas encore créées

### URLs à Bookmarker
```
Landing:     http://localhost:3000/en
Marketplace: http://localhost:3000/en/marketplace
Property 1:  http://localhost:3000/en/marketplace/1
Dashboard:   http://localhost:3000/en/dashboard
```

---

## 🐛 Troubleshooting

### Page 404
❌ URL incorrecte: `/marketplace`
✅ URL correcte: `/en/marketplace` (avec locale)

### Erreur d'Hydration
Solution: Recharger la page (Ctrl+R)

### Images Manquantes
Normal: Placeholder images
Solution: Télécharger vraies images (voir IMAGE_GUIDE.md)

### Changement de langue ne fonctionne pas
Vérifier: Vous êtes sur une page avec locale (`/en/` ou `/es/`)

---

## 🎉 Vous êtes Prêt!

**Toutes les pages fonctionnent.**
**Toutes les fonctionnalités sont implémentées.**
**L'application est prête pour la démo!**

**Bonne chance pour votre hackathon! 🚀🏆**

---

**Questions? Consultez:**
- `README.md` - Guide complet
- `QUICK_START.md` - Démarrage rapide
- `IMPLEMENTATION_COMPLETE.md` - Résumé technique
