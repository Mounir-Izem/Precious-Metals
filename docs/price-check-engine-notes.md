# Price-Check Engine — Notes de comportement

## 1. Scope

Marché secondaire FR observé.

Les thresholds ne sont ni retail dealer, ni marché primaire, ni dynamiques.

---

## 2. Mode standard

- Le catalogue est obligatoire. Pas de produit libre dans le moteur.
- Un verdict (`evaluated`) n'est produit que si :
  - le produit est connu du catalogue (`family_id` + `variant_code` valides)
  - l'archetype est reconnu (sinon `status: error`)
  - `shouldManualReview()` est false (sinon `status: manual_review`)
  - l'intent est dans `family.supported_intents` (sinon `status: manual_review`)
- Si `family_id` ou `variant_code` sont inconnus → `status: error`.

---

## 3. manual_review

Utilisé quand le verdict standard n'est pas fiable :

- `pricing_engine = manual_only`
- `collection_sensitivity`, `year_sensitivity`, ou `condition_sensitivity = high`
- `user_intent` non présent dans `family.supported_intents`

Le pricing est calculé et affiché si `spot_price_per_g_fine` est fourni.
Sinon `pricing = null`.

---

## 4. borderline

La position `borderline` dépend uniquement de la présence de `limit_max` dans les thresholds.

- Si `limit_max` absent → `above_range` directement après `within_range_high`.
- `borderline` n'est jamais produit sans `limit_max`.

---

## 5. ask_price

Toujours le prix total du lot, pas le prix unitaire.

`melt_value = variant.fine_weight_g × quantity × spot_price_per_g_fine`

---

## 6. Intent

L'UI filtre les intents disponibles selon `family.supported_intents`.

Le moteur reste défensif : si un intent non supporté passe quand même, il déclenche `manual_review` avec `reason_code: not_reliably_modelled_for_intent`.

---

## 7. Non inclus MVP

- **Fallback produit libre** : pas de mode manuel sans catalogue.
- **Moteur dynamique** : les thresholds sont statiques (JSON injecté).
- **Préclassification active** : `preclassification_policy.json` existe mais est désactivée (`enabled: false`).
