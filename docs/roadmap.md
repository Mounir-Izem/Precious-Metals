# Precious Metals — Roadmap complète

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Node.js + Express, ES Modules |
| Frontend | React + Vite, ES Modules |
| Déploiement | Railway |
| Style | Tailwind CSS |
| i18n | i18next + react-i18next |
| Tests | Vitest (frontend), Supertest (backend) |
| Analytics | Plausible (RGPD compliant, anonyme) |
| Chiffrement | Web Crypto API native (AES-256) |
| Migration future | TypeScript (Phase 9) |

---

## Architecture

### Monorepo npm workspaces

```
Precious-metals/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       └── mock/
└── frontend/
    └── src/
        ├── pages/
        ├── components/
        │   ├── layout/
        │   ├── spot/
        │   ├── price-check/
        │   ├── portfolio/
        │   └── dashboard/
        ├── context/
        ├── services/
        ├── utils/
        └── i18n/
```

### Navigation

```
BottomNav (toujours visible)
├── Spot
├── Price-Check (+ Marché communautaire en bas)
└── Mon Stack
    ├── Tab Collection (portfolio)
    └── Tab Dashboard (métriques + objectifs)

TopBar
├── Gauche : "Precious Metals" + date fixing
└── Droite : drapeaux FR/EN + icône paramètres (devise/unité global)
```

### Règles de navigation
- Changement de contexte majeur → BottomNav
- Action dans le contexte actuel → bottom sheet ou modal
- Jamais plus de 2 niveaux de profondeur
- Pas de bouton retour à gérer

---

## Modèle économique

### Gratuit
- Spot (feature SpotPrice complète)
- Price-Check complet (calculateur unitaire + lots homogènes + lots mixtes + marché communautaire)
- Portfolio : 10 pièces max
- Dashboard basique : valeur totale stack + poids fin accumulé
- 1 objectif

### Payant — 5.99€/mois
- Portfolio illimité
- Dashboard complet : DCA + profit/loss + prime moyenne + cartes Or et Argent métrics détaillées
- Objectifs illimités
- Partage de collection (upsell social)

### One-shot
- 3.99€ — export/import chiffré pour transfert entre appareils (toutes données)
- Partage collection publique (sans données sensibles — prix d'achat masqués)

### Philosophie de confidentialité
- Toutes les données sensibles (portfolio, prix d'achat, objectifs) stockées en localStorage chiffré uniquement
- Jamais envoyées à un serveur
- Pas de compte utilisateur
- RGPD compliant par design
- Paywall via code d'activation Stripe — pas de compte nécessaire

---

## Catalogue pièces MVP (~30-50 pièces)

### Or d'investissement (8 pièces)
- Napoléon 20 Francs (90% or, 0.1867 oz)
- Krugerrand 1oz (91.67% or)
- Maple Leaf 1oz or (99.99%)
- American Eagle 1oz or (91.67%)
- Britannia 1oz or (99.99%)
- Vreneli 20 Francs (90% or)
- Philharmoniker 1oz or (99.99%)
- Souverain (91.67%)

### Argent d'investissement (9 pièces)
- Maple Leaf 1oz argent (99.99%)
- American Eagle 1oz argent (99.9%)
- Philharmoniker 1oz argent (99.9%)
- Britannia 1oz argent (99.9%)
- Kangaroo 1oz argent (99.99%)
- Libertad 1oz argent (99.9%)
- Krugerrand 1oz argent (99.9%)
- Panda 1oz argent (avant 2016 : 31.1g / 2016+ : 30g) (99.9%)
- Kookaburra 1oz argent (avant 2018 : 99% / 2018+ : 99.9%)

### Junk silver français (~12 pièces)
- 50 Francs Hercule (900‰)
- 10 Francs Hercule (900‰)
- 5 Francs Semeuse (835‰)
- 10 Francs Turin (680‰)
- 20 Francs Turin (680‰)
- 2 Francs Semeuse (835‰)
- 1 Franc Semeuse (835‰)
- 50 Centimes Semeuse (835‰)
- Franken 5 (835‰)
- Reichsmark 5 (900‰)

### Règle catalogue
- Pièces modernes uniquement (post-1970 pour les pièces d'investissement)
- Pas de numismatique ancienne
- L'utilisateur peut ajouter une pièce custom manuellement (stockée localement)

---

## Features — détail

### ✅ Feature Spot (terminée)
- metals.dev real-time, format unifié `{ timestamp, stale, rates, gold, silver }`
- Prix unique par métal + variation J/J (change/change_pct)
- Conversion dynamique USD/EUR/GBP et oz/g/kg
- Ratio gold/silver (1/X pour gold, X/1 pour silver)
- i18n FR/EN avec drapeaux
- Design Tailwind avec dégradés métalliques effet lingot
- Cache mémoire backend + TTL dynamique (5min ouvert / 24h fermé) + stale fallback + single-flight ✅
- spotCache.js frontend — localStorage fallback si backend down 🔄
- PWA (à configurer)

### 🔄 Feature Price-Check (Phase 6 — à faire)

**Calculateur unitaire**
- Sélection pièce dans le catalogue
- Entrée prix demandé
- Affichage : prix au gramme/once, spot actuel, prime en valeur et %
- Si pièce pas dans le catalogue, utilisateur rentre uniquement les infos utiles à calculer

**Calculateur lots homogènes** (gratuit)
- Même pièce en multiple
- Prix total → prix unitaire moyen → prime
- Possibilité à l'utilisateur de pouvoir rentré ces info si pas les pièces qu'il veut dans le catalogue

**Calculateur lots mixtes** (gratuit)
- Pièces différentes dans un lot
- Calcul du poids fin total, prix moyen pondéré, prime globale
- Possibilité à l'utilisateur de pouvoir rentré ces info si pas les pièces qu'il veut dans le catalogue

**Marché communautaire** (en bas de la page)
- Sélection pièce → affichage des prix observés sur 30 jours
- Min / médiane / max / nombre de transactions
- Soumission anonyme d'un prix d'achat
- Données stockées côté serveur (anonymes, pas de compte)

**Tooltips glossaire** sur tous les termes techniques

### 🔄 Feature Portfolio (Phase 6 — à faire)
- 10 pièces max (gratuit)
- Stockage localStorage chiffré
- Photo de la pièce (optionnel)
- Infos : nom, poids, millésime, année, quantité, prix d'achat, date(optionnel)
- Barre de progression objectif visible en haut
- Badge de niveau (Apprenti Stacker → Stacker Confirmé → Stacker Expert)
- Export collection publique (sans prix d'achat)

### 🔄 Feature Dashboard (Phase 6 — à faire)

**Gratuit**
- Sélecteur devise/unité dans la page spot et dans le menu paramètre(Pour la selection devise/unité en paramètre, sa n'affecte pas la page spot, la page spot à sa propre gestion devise/unité)
- Valeur totale du stack en devise sélectionnée
- Poids fin accumulé (or : X oz/g/kg, argent : X oz/g/kg)
- Répartition % or/argent

**Payant**
- DCA par métal (prix moyen pondéré)
- Comparaison DCA vs spot actuel (or +X%, argent +X% )
- Profit/loss global unrealized (montant + % + couleur vert/rouge)
- Prime moyenne payée par métal
- Cartes Gold/Silver déroulantes détaillées

### 🔄 Feature Objectifs (Phase 6 — à faire)
- 1 objectif gratuit, illimité payant
- Lié aux catégories du catalogue (silver liquide, or robuste, semi-collection...)
- Progression dynamique basée sur le portfolio
- Résumé visible en haut de l'onglet Collection

### 🔄 Feature Export/Import (Phase 6 — à faire)
- Export chiffré AES-256 (code choisi par l'utilisateur = clé)
- Import sur nouvel appareil avec le même code
- One-shot 3.99€

---

## Tests

### Vitest (frontend)
- `spotUtils.test.js` — convertPrice, convertUnit, convertCurrency
- Tests calculs Price-Check (prime, lots)
- Tests calculs Dashboard (DCA, profit/loss)
- Et partout où c'est nécessaire

### Supertest (backend)
- `GET /spot/latest`
- `GET /coins`
- `POST /community-price`
- Et partout où c'est nécessaire

### Règle
Les tests restent dans le code — toujours. Convention : `fichier.test.js` à côté de `fichier.js`.

---

## Roadmap par phase

### ✅ Terminé
- Migration metals.dev + suppression Prisma/LBMA
- SpotPrice + composants, Router + Layout, SpotContext
- CSS Tailwind, i18n FR/EN, Ratio gold/silver
- 63 tests Vitest (15 backend + 48 frontend)
- `feature/spot-cache` backend — cache mémoire in-memory, TTL dynamique (5min ouvert / 24h fermé), stale fallback, single-flight

### 🔄 En cours
- `feature/price-check-engine` — moteur métier pur
- `feature/price-check-ui`
- `feature/spot-realtime-live` — clé API réelle
- `feature/portfolio` — local-first IndexedDB
- `feature/dashboard` — calcul client
- `feature/security-hardening`

### 🔄 Phase déploiement
- Zod validation sur les réponses API
- CORS restreint au domaine de production
- Variables d'environnement Railway
- Umami analytics
- Déploiement backend Railway
- Tests end-to-end post-déploiement

### 🔄 Phase 8 — Monétisation
- Paywall Stripe (code d'activation sans compte)
- Portfolio illimité payant
- Dashboard complet payant
- Objectifs illimités payants
- Partage collection payant

### 🔄 Phase 9 — Qualité & Evolution
- Migration TypeScript (fichier par fichier)
- `// @ts-check` sur fichiers critiques
- feature/spot-avg (quand 30j de données disponibles)
- Notifications push (PWA Android + iOS 16.4+)
- Personnalisation visuelle des cartes portfolio
- Gamification avancée

### 🔄 Post-MVP — Résilience spot (après 3 mois d'observation)
- Si metals.dev tombe en prod → ajouter fallback API secondaire
- Candidats : metals-api.com ou metalpriceapi.com (option la moins chère en premier)
- Implémentation : circuit breaker dans `metalsDevService.js` — metals.dev en premier, fallback si KO
- Décision basée sur l'observation réelle en prod, pas sur l'hypothèse

---

## Conventions de développement

- Branches : `feature/nom-feature`, `fix/nom-fix`
- Commits : conventionnels (`feat:`, `fix:`, `refactor:`, `wip:`)
- Backend : ES Modules
- Frontend : ES Modules
- JavaScript jusqu'à Phase 9, puis TypeScript
- Pas de décision sans validation explicite
- Tests écrits juste après le code, jamais supprimés