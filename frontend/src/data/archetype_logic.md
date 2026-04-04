# Logique d’archétypes — Price-Check MVP

## Objectif

Ce document décrit **humainement** comment le moteur `price-check` doit déduire un **archétype métier** à partir du `catalog.json`, **sans ajouter de logique dans la data**.

L’idée est simple :

- le `catalog.json` décrit les produits
- le moteur lit certains champs
- puis il classe la famille dans un archétype exploitable par la suite

Les archétypes servent ensuite à :
- choisir les seuils
- savoir si un verdict standard est possible
- produire un message explicatif cohérent

---

## Principe fondamental

L’archétype n’est **pas** une donnée stockée dans le catalogue.

Il est **déduit** à partir de champs déjà présents, notamment :

- `identity.metal`
- `identity.series_role`
- `trade_profile.pricing_engine`
- `trade_profile.collection_sensitivity`
- `trade_profile.year_sensitivity`
- `trade_profile.condition_sensitivity`

Donc :

- **data** = description du produit
- **logique** = déduction de l’archétype

---

## Archétypes retenus

Le moteur peut produire les archétypes suivants :

- `manual_review`
- `junk`
- `historical_bullion`
- `semi`
- `bullion`
- `unknown`

`unknown` est seulement un fallback de sécurité.

---

## Ordre de résolution

L’ordre est important.

Il faut toujours résoudre dans cet ordre :

1. `manual_review`
2. `junk`
3. `historical_bullion`
4. `semi`
5. `bullion`
6. `unknown`

Pourquoi ?

Parce qu’un produit peut avoir plusieurs caractéristiques à la fois, et il faut que les cas les plus structurants prennent le dessus.

Exemple :
- un produit avec `pricing_engine = manual_only` ne doit jamais tomber plus bas dans la logique
- un produit `junk_investment` ne doit pas être reclassé en bullion

---

## 1. Archétype `manual_review`

### Rôle
Cet archétype signifie :

> le moteur peut éventuellement calculer les valeurs, mais il ne doit pas produire un verdict standard fiable.

### Quand il s’applique
Si au moins une des conditions suivantes est vraie :

- `pricing_engine == manual_only`
- `collection_sensitivity == high`
- `year_sensitivity == high`
- `condition_sensitivity == high`

### Pourquoi
Parce que le produit dépend trop de facteurs non modélisés proprement dans le MVP :
- année
- état
- sensibilité collection
- logique de pricing non standard

### Exemple
- Silver Panda

### Conséquence
- calculs visibles
- pas de verdict standard
- message explicatif obligatoire

---

## 2. Archétype `junk`

### Rôle
Cet archétype couvre l’argent de circulation / vrac / logique fonte.

### Quand il s’applique
Si au moins une des conditions suivantes est vraie :

- `pricing_engine == melt_value`
- `series_role == junk_investment`

### Pourquoi
Parce que ce type de produit ne se lit pas comme un bullion moderne.
La logique dominante est :
- valeur métal
- lot
- proximité du melt

### Exemple
- Silver France Junk
- Hercule
- Semeuse

### Conséquence
- seuils spécifiques
- traitement distinct de l’argent bullion

---

## 3. Archétype `historical_bullion`

### Rôle
Cet archétype couvre l’or historique d’investissement.

### Quand il s’applique
Si :

- `identity.metal == gold`
- `identity.series_role == historical_bullion`

### Pourquoi
Parce que ce sont des pièces :
- historiquement reconnues
- souvent liquides
- avec une prime structurelle
- mais encore lisibles dans une logique investissement

### Exemples
- 20 Francs Or France
- Sovereign
- Vreneli
- 20 USD
- 50 Pesos Mexico

### Conséquence
- seuils différents du bullion standard
- toujours dans le moteur standard tant que les sensibilités ne montent pas à `high`

---

## 4. Archétype `semi`

### Rôle
Cet archétype couvre les produits semi-bullion, surtout côté argent.

### Quand il s’applique
Si :

- `series_role == semi_bullion`

### Pourquoi
Parce que ces produits gardent une logique investissement,
mais avec une sensibilité plus forte au design, à la série ou à la perception marché.

### Exemple
- Kookaburra

### Conséquence
- tolérance de prime plus large
- toujours calculable
- mais pas lu comme un bullion pur

### Remarque
Dans le modèle actuel, `semi` vient surtout du `series_role`.
On n’ajoute pas d’autre logique cachée ici tant qu’elle n’a pas été validée explicitement.

---

## 5. Archétype `bullion`

### Rôle
Cet archétype couvre les bullion standards.

### Quand il s’applique
Si :

- `series_role == bullion`

et que le produit n’a pas déjà été classé plus haut
(`manual_review`, `junk`, `historical_bullion`, `semi`).

### Pourquoi
Parce que ce sont les cas les plus “métal + prime standard”.

### Exemples
#### Or
- Gold Maple Leaf
- Krugerrand
- Gold Britannia
- Gold Philharmonic
- American Gold Eagle

#### Argent
- Silver Maple Leaf
- Silver Britannia
- Silver Philharmonic
- American Silver Eagle
- Silver Kangaroo

### Conséquence
- lecture standard du moteur
- seuils les plus simples à appliquer

---

## 6. Archétype `unknown`

### Rôle
Fallback de sécurité.

### Quand il s’applique
Quand aucune règle précédente ne matche proprement.

### Pourquoi
Pour éviter qu’un produit parte dans une classification implicite et silencieuse.

### Conséquence
Deux options possibles selon ton implémentation future :
- soit traiter `unknown` comme erreur de moteur
- soit le faire remonter en `manual_review`

Pour le MVP, il vaut mieux éviter les `unknown` en gardant le catalogue propre.

---

## Résumé ultra simple

### Priorité 1
Si le produit est trop sensible ou `manual_only` :
- `manual_review`

### Priorité 2
Si le produit est en logique fonte / junk :
- `junk`

### Priorité 3
Si c’est de l’or historique :
- `historical_bullion`

### Priorité 4
Si c’est du semi-bullion :
- `semi`

### Priorité 5
Si c’est du bullion standard :
- `bullion`

### Sinon
- `unknown`

---

## Tableau de lecture rapide

| Condition principale | Archétype |
|---|---|
| `pricing_engine = manual_only` ou sensibilité `high` | `manual_review` |
| `pricing_engine = melt_value` ou `series_role = junk_investment` | `junk` |
| `metal = gold` et `series_role = historical_bullion` | `historical_bullion` |
| `series_role = semi_bullion` | `semi` |
| `series_role = bullion` | `bullion` |
| rien ne matche | `unknown` |

---

## Ce que cette logique ne fait pas

Elle ne :
- choisit pas les seuils
- ne produit pas la position (`below_spot`, etc.)
- ne construit pas le message utilisateur
- ne décide pas l’erreur ou l’incomplete

Elle fait seulement une chose :

> classer le produit dans un archétype moteur utilisable ensuite.

---

## Règle d’hygiène importante

Aucune logique d’archétype ne doit être rajoutée dans `catalog.json`.

Le catalogue doit rester :
- descriptif
- stable
- sans logique exécutable

La logique doit vivre dans un fichier dédié du moteur, par exemple :
- `resolveArchetype.js`

---

## Phrase de référence

Si tu dois résumer cette logique en une phrase :

> L’archétype est une lecture métier déduite du catalogue par le moteur, pour savoir comment interpréter la prime selon le type réel de produit.
