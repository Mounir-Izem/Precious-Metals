# CLAUDE.md — Precious Metals

## ⚠️ RÈGLES ABSOLUES — LIS CECI EN PREMIER

### Fichiers interdits — NE JAMAIS LIRE, MODIFIER OU SUGGÉRER
- `.env` et tout fichier `.env.*`
- `prisma/migrations/`
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
| Backend | Node.js + Express, **CommonJS** |
| Frontend | React + Vite, **ES Modules** |
| Base de données | PostgreSQL + Prisma ORM |
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
├── CLAUDE.md
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── crons/
│   │   └── mock/
│   └── prisma/
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
- Backend : CommonJS (`require`/`module.exports`)
- Frontend : ES Modules (`import`/`export`)
- JavaScript jusqu'à Phase 9, puis migration TypeScript fichier par fichier
- Tests : `fichier.test.js` à côté de `fichier.js`, jamais supprimés
- Pas de décision impactant d'autres fichiers sans validation explicite du développeur

---

## État des features

### ✅ Terminées
- SpotPrice (fixings LBMA AM/PM/NOON)
- Conversion dynamique USD/EUR/GBP + oz/g/kg
- Variation J/J + intraday AM/PM gold
- Ratio gold/silver
- i18n FR/EN avec drapeaux SVG
- CSS Tailwind — dégradés métalliques
- Router + Layout + SpotContext
- BottomNav avec NavLink actif/inactif
- TopBar avec date fixing LBMA

### 🔄 En cours — branche active : `feature/tests`
1. `feature/tests` — Vitest sur `spotUtils.js` + Supertest backend
2. `feature/price-check` — catalogue + calculateurs + marché communautaire
3. `feature/portfolio` — vault chiffré + 10 pièces
4. `feature/dashboard` — métriques basiques
5. `feature/objectifs` — 1 objectif gratuit
6. `feature/pwa` — manifest + Service Worker

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

### Chiffrement et sync (vault)
- **AES-256-GCM** + **PBKDF2** (100 000 itérations, sel aléatoire stocké en clair)
- Sync serveur : blob chiffré opaque lié à un UUID v4 anonyme (`crypto.randomUUID()`)
- Le serveur ne voit jamais les données en clair — jamais
- Endpoints à créer : `PUT /vault/:uuid`, `GET /vault/:uuid`, `GET /vault/:uuid/status`
- Modèle Prisma : `Vault { uuid, encrypted_blob, updated_at, premium, expires_at }`
- Conflit de sync : refuser PUT si `updated_at` envoyé < `updated_at` en base
- Récupération UUID : email transactionnel via Brevo (email non persisté en base)
- localStorage : UUID + préférences UI + cache statut premium uniquement

### Sécurité générale
- Zod validation sur **toutes** les entrées API et sur les réponses metals.dev
- CORS restreint au domaine de production (Phase 7)
- Rate limiting global en place
- Rate limiting dédié sur `POST /community-price` : 3 soumissions/heure/IP
- Helmet en place
- Clé API metals.dev côté backend uniquement, jamais dans le frontend
- Variables d'environnement Railway, jamais dans le code
- HTTPS uniquement

### Crons — fiabilité
- Vérification jour ouvré LBMA avant exécution
- Retry backoff exponentiel : échec → 5min → échec → 10min → échec → abandon + alerte
- Alerte email Brevo au développeur si 3 échecs consécutifs
- Validation Zod sur la réponse metals.dev avant tout INSERT
- Vérification au démarrage backend : fixing du jour manquant → récupération automatique
- Frontend : badge "Données retardées" si fixing > 2h

### Stripe (Phase 8)
- Checkout Session avec UUID + email en metadata
- Webhook idempotent + vérification signature obligatoire + rejet si > 5 minutes
- Logger UUID + Session ID à la création de la session
- Logger chaque webhook reçu : type + timestamp
- Gestion explicite : remboursement, annulation, échec renouvellement

---

## Schema Prisma actuel

```prisma
enum Fixing { AM PM NOON }
enum Metal { gold silver }

model SpotPrice {
  id           Int      @id @default(autoincrement())
  metal        Metal
  fixing       Fixing
  oz_price_usd Decimal
  eur_usd_rate Decimal
  gbp_usd_rate Decimal
  date         DateTime
  created_at   DateTime @default(now())
  @@unique([metal, fixing, date])
}
```

### À créer
```prisma
model Vault {
  uuid           String   @id
  encrypted_blob String
  updated_at     DateTime
  premium        Boolean  @default(false)
  expires_at     DateTime?
}

model Coin {
  id          Int     @id @default(autoincrement())
  name        String
  metal       Metal
  weight_oz   Decimal
  purity      Decimal
  category    String
  country     String
  description String?
}

model CommunityPrice {
  id         Int      @id @default(autoincrement())
  coin_id    Int
  price_paid Decimal
  currency   String
  unit       String
  created_at DateTime @default(now())
}
```

---

## Endpoints existants

- `GET /spot/latest` — fixings du jour
- `GET /spot/variation` — variation J/J gold PM + silver NOON
- `GET /health`

## Endpoints à créer

- `GET /coins`
- `POST /community-price`
- `GET /community-price/:coinId`
- `PUT /vault/:uuid`
- `GET /vault/:uuid`
- `GET /vault/:uuid/status`
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