# CLAUDE.md — Precious Metals

## ⚠️ PROTOCOLE DE DÉMARRAGE — OBLIGATOIRE

**À chaque nouvelle session ou reprise après compaction :**

1. Lire **tous** les fichiers dans `docs/` (`current_phase.md`, `roadmap.md`, `architecture.md`, `context.md`, `rules.md`)
2. Synthétiser ce qui a été compris : phase en cours, décisions fermes, état des features
3. Présenter cette synthèse à Mounir et **attendre sa validation explicite** avant toute action

`current_phase.md` peut contenir des oublis ou des informations obsolètes — ne jamais supposer qu'il est parfaitement à jour.

---

## ⚠️ RÈGLES ABSOLUES — LIS CECI EN PREMIER

### Fichiers interdits — NE JAMAIS LIRE, MODIFIER OU SUGGÉRER
- `.env` et tout fichier `.env.*`
- Tout fichier contenant des credentials, clés API, secrets

Ces fichiers ne t'appartiennent pas. Tu n'as aucune raison de les consulter.

### Standard de qualité — NON NÉGOCIABLE
Ce projet a un niveau d'exigence **production**. Chaque ligne de code doit être :
- **Correcte** — pas de comportement implicite non maîtrisé
- **Sécurisée** — toute entrée est validée, tout secret reste côté serveur
- **Fiable** — les cas edge sont anticipés, les erreurs sont gérées explicitement
- **Testée** — tout code métier a un test associé

Si tu as un doute sur une implémentation, tu le dis. Tu ne proposes jamais une solution approximative sans le signaler.

---

## Identité du projet

**Precious Metals** — PWA de suivi des métaux précieux (or et argent) pour les stackers français.

Valeur principale : calculateur de prime au moment d'acheter une pièce sur le marché secondaire français (Leboncoin, P2P). Pas un outil pour traders — un outil pour collectionneurs et investisseurs particuliers.

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | Node.js + Express, **ES Modules** |
| Frontend | React + Vite, **ES Modules** |
| Déploiement | Railway (monorepo npm workspaces) |
| Style | Tailwind CSS |
| i18n | i18next + react-i18next (FR/EN) ✅ |
| Tests | Vitest (frontend), Supertest (backend) |
| Analytics | Umami (self-hosted Railway) |
| Chiffrement | Web Crypto API native (AES-256-GCM + PBKDF2) |
| Email | Brevo (transactionnel uniquement) |
| Paiement | Stripe (Phase 8) |
| Migration future | TypeScript (Phase 9) |

---

## Architecture monorepo

```
Precious-metals/
├── docs/
│   └── CLAUDE.md
├── backend/
│   └── src/
│       ├── controllers/
│       ├── services/
│       │   ├── metalsDevService.js
│       │   ├── spotService.js
│       │   ├── marketWindow.js
│       │   └── spotCacheService.js
│       ├── routes/
│       └── mock/
│           └── metalsDevSpot.json
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

---

## Conventions de développement

- Branches : `feature/nom`, `fix/nom`
- Commits : conventionnels (`feat:`, `fix:`, `refactor:`, `wip:`)
- Backend : ES Modules (`import`/`export`)
- Frontend : ES Modules (`import`/`export`)
- JavaScript jusqu'à Phase 9, puis migration TypeScript fichier par fichier
- Tests : `fichier.test.js` à côté de `fichier.js`, jamais supprimés
- Pas de décision impactant d'autres fichiers sans validation explicite du développeur

---

## État des features

### ✅ Terminées
- Migration metals.dev (spot real-time, format unifié, mock-first)
- Suppression Prisma, node-cron, LBMA stack
- `/spot/latest` endpoint : `{ timestamp, stale, rates, gold, silver }` avec change/change_pct
- SpotPrice page — prix unique par métal + variation J/J
- Conversion dynamique USD/EUR/GBP + oz/g/kg
- Ratio gold/silver
- i18n FR/EN avec drapeaux SVG + clés `priceCheck.intents.*`
- CSS Tailwind — dégradés métalliques
- Router + Layout + SpotContext
- BottomNav + TopBar
- 63 tests Vitest (15 backend + 48 frontend)
- `feature/spot-cache` ✅ — cache in-memory TTL 5min/24h, stale fallback, single-flight, localStorage frontend

### 🔄 Prochaines branches
1. `feature/price-check-engine` — moteur métier pur, sans UI 🔄
2. `feature/price-check-ui` — composants + page + route /price-check
3. `feature/price-check-ui` — connexion moteur → UI
4. `feature/spot-realtime-live` — `USE_MOCK_SPOT=false`, clé API réelle
5. `feature/portfolio` — local-first IndexedDB, sans compte, sans backend
6. `feature/dashboard` — calcul client, combine portfolio + spot
7. `feature/security-hardening` — Helmet CSP, audit inputs, hygiène deps

### 🔄 Phase 7 — Déploiement
- metals.dev live avec cache 60s
- Zod validation
- CORS restreint au domaine de production
- Umami analytics
- Déploiement Railway

### 🔄 Phase 8 — Monétisation (Stripe)
### 🔄 Phase 9 — Migration TypeScript

---

## Décisions techniques validées

### Architecture MVP — décisions fermes
- Portfolio = local-first (IndexedDB), sans backend, sans compte, sans chiffrement pour le MVP
- Backend = spot uniquement — cache mémoire, pas de DB, pas de Redis pour le MVP
- Pas d'auth dans le MVP
- Dashboard = calcul côté client uniquement (portfolio local + spot courant)
- `USE_MOCK_SPOT=true` en dev, `false` uniquement en `feature/spot-realtime-live`

### Sécurité générale
- Zod validation sur **toutes** les entrées API et sur les réponses metals.dev
- CORS restreint au domaine de production (Phase 7)
- Rate limiting global en place
- Rate limiting dédié sur `POST /community-price` : 3 soumissions/heure/IP
- Helmet en place
- Clé API metals.dev côté backend uniquement, jamais dans le frontend
- Variables d'environnement Railway, jamais dans le code
- HTTPS uniquement

### Stripe (Phase 8)
- Checkout Session avec UUID + email en metadata
- Webhook idempotent + vérification signature obligatoire + rejet si > 5 minutes
- Logger UUID + Session ID à la création de la session
- Logger chaque webhook reçu : type + timestamp
- Gestion explicite : remboursement, annulation, échec renouvellement

---

## Endpoints existants

- `GET /spot/latest` — `{ timestamp, stale, rates, gold: { oz_usd, g_fine_usd, change, change_pct }, silver: { ... } }`
- `GET /health`

## Endpoints à créer

- `GET /coins`
- `POST /community-price`
- `GET /community-price/:coinId`
- `POST /webhook/stripe` (Phase 8)

---

## Catalogue pièces MVP

### Règle de calcul
`poids total (g) × pureté = poids fin (g)` puis `÷ 31.1035 = weight_oz`
Stockage : `weight_oz` — affichage UI : grammes

### Or d'investissement
| Pièce | Pureté | weight_oz |
|-------|--------|-----------|
| Napoléon 20F | 90% | 0.1867 |
| Krugerrand 1oz | 91.67% | 0.9675 |
| Maple Leaf 1oz | 99.99% | 1.0000 |
| American Eagle 1oz | 91.67% | 1.0000 |
| Britannia 1oz | 99.99% | 1.0000 |
| Vreneli 20F | 90% | 0.1867 |
| Philharmoniker 1oz | 99.99% | 1.0000 |
| Souverain | 91.67% | 0.2354 |

### Argent d'investissement
| Pièce | Pureté | weight_oz |
|-------|--------|-----------|
| Maple Leaf 1oz | 99.99% | 1.0000 |
| American Eagle 1oz | 99.9% | 1.0000 |
| Philharmoniker 1oz | 99.9% | 1.0000 |
| Britannia 1oz | 99.9% | 1.0000 |
| Kangaroo 1oz | 99.99% | 1.0000 |
| Libertad 1oz | 99.9% | 1.0000 |
| Krugerrand 1oz | 99.9% | 1.0000 |
| Panda 1oz (avant 2016) | 99.9% | 0.9990 |
| Panda 1oz (2016+) | 99.9% | 0.9646 |
| Kookaburra 1oz (avant 2018) | 99% | 0.9893 |
| Kookaburra 1oz (2018+) | 99.9% | 0.9990 |

### Junk silver français
| Pièce | Pureté | Poids total | weight_oz |
|-------|--------|-------------|-----------|
| 50F Hercule | 900‰ | 30g | 0.8681 |
| 10F Hercule | 900‰ | 10g | 0.2894 |
| 5F Semeuse | 835‰ | 5g | 0.1343 |
| 10F Turin | 680‰ | 10g | 0.2186 |
| 20F Turin | 680‰ | 20g | 0.4372 |
| 2F Semeuse | 835‰ | 10g | 0.2685 |
| 1F Semeuse | 835‰ | 5g | 0.1343 |
| 50c Semeuse | 835‰ | 2.5g | 0.0671 |
| Franken 5 | 835‰ | 25g | 0.6716 |
| Reichsmark 5 | 900‰ | 25g | 0.7234 |

---

## Modèle économique

### Gratuit
- Spot complet
- Price-Check complet
- Marché communautaire
- Portfolio 10 pièces
- Dashboard basique : valeur totale + poids fin + répartition %
- 1 objectif

### Payant — 5.99€/mois
- Portfolio illimité
- Dashboard complet : DCA + profit/loss + prime moyenne + cartes détaillées
- Objectifs illimités
- Partage de collection

### Upsells one-shot (Phase 8)
- Packs de thèmes visuels (~1.99€)
- Badges identitaires affichables (~0.99€)

---

## Philosophie de confidentialité

- Données sensibles = vault serveur chiffré AES-256 uniquement
- Le serveur stocke un blob opaque — jamais les données en clair
- Pas de compte utilisateur
- Pas d'email persisté en base
- RGPD compliant par design