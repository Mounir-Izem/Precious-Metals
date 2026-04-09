import { validateInput } from './validateInput.js';
import { resolveArchetype } from './resolveArchetype.js';
import { resolveThresholds } from './resolveThresholds.js';
import { resolvePosition } from './resolvePosition.js';
import { resolveMessage } from './resolveMessage.js';
import { calcMetalValue, calcPremiumValue, calcPremiumPercent } from '../../utils/premiumUtils.js';

// --- Fonctions privées ---

function resolveCatalogProduct(input, catalog) {
    const family = catalog.families?.find(f => f.family_id === input.family_id);
    if (!family) {
        return { ok: false, code: 'unknown_family' };
    }
    const variant = family.variants?.find(v => v.variant_code === input.variant_code);
    if (!variant) {
        return { ok: false, code: 'unknown_variant' };
    }
    return { ok: true, family, variant };
}

function shouldManualReview(family) {
    const tp = family.trade_profile;
    if (tp.pricing_engine === 'manual_only') return { manual: true, reason: 'manual_only' };
    if (tp.collection_sensitivity === 'high') return { manual: true, reason: 'high_collection_sensitivity' };
    if (tp.year_sensitivity === 'high') return { manual: true, reason: 'high_year_sensitivity' };
    if (tp.condition_sensitivity === 'high') return { manual: true, reason: 'high_condition_sensitivity' };
    return { manual: false };
}

function computePricing(input, variant) {
    const fine_weight_total = variant.fine_weight_g * input.quantity;
    const melt_value = calcMetalValue(fine_weight_total, input.spot_price_per_g_fine);
    if (melt_value === null) {
        throw new Error('computePricing: melt_value is null — catalog or spot data is corrupted');
    }
    const premium_value = calcPremiumValue(input.ask_price, melt_value);
    const premium_pct = calcPremiumPercent(premium_value, melt_value);
    return {
        melt_value,
        premium_value,
        premium_pct,
        asking_price: input.ask_price,
    };
}

// --- Orchestrateur principal ---

/**
 * @param {object} rawInput
 * @param {object} catalog  — catalog.json object
 * @param {object} policy   — verdict_policy.json object
 * @returns {object} decision_output_schema
 */
export function runPriceCheck(rawInput, catalog, policy) {
    // 1. Validation input
    const validation = validateInput(rawInput);
    if (!validation.ok) {
        return {
            status: 'incomplete',
            product: null,
            pricing: null,
            analysis: null,
            manual_review: null,
            warnings: [],
            error: null,
            missing_fields: validation.errors.map(e => e.field),
        };
    }
    const input = validation.data;

    // 2. Résolution catalogue
    const catalogResult = resolveCatalogProduct(input, catalog);
    if (!catalogResult.ok) {
        return {
            status: 'error',
            product: null,
            pricing: null,
            analysis: null,
            manual_review: null,
            warnings: [],
            error: { code: catalogResult.code, message: `priceCheck.errors.${catalogResult.code}` },
            missing_fields: [],
        };
    }
    const { family, variant } = catalogResult;

    // 3. Archetype
    const archetype = resolveArchetype(family);

    if (archetype === 'unknown') {
        return {
            status: 'error',
            product: {
                family_id: family.family_id,
                variant_code: variant.variant_code,
                metal: family.identity.metal,
                archetype,
                series_role: family.identity.series_role,
            },
            pricing: null,
            analysis: null,
            manual_review: null,
            warnings: [],
            error: { code: 'policy_resolution_failed', message: 'priceCheck.errors.policy_resolution_failed' },
            missing_fields: [],
        };
    }

    if (family.supported_intents && !family.supported_intents.includes(input.user_intent)) {
        const pricing = input.spot_price_per_g_fine
            ? computePricing(input, variant)
            : null;
        return {
            status: 'manual_review',
            product: {
                family_id: family.family_id,
                variant_code: variant.variant_code,
                metal: family.identity.metal,
                archetype,
                series_role: family.identity.series_role,
            },
            pricing,
            analysis: {
                intent: input.user_intent,
                message: { key: policy.manual_review_rules.message_template, vars: { intent: input.user_intent } },
            },
            manual_review: { reason_code: 'not_reliably_modelled_for_intent' },
            warnings: [],
            error: null,
            missing_fields: [],
        };
    }

    // 4. Manual review
    const manualCheck = shouldManualReview(family);
    if (manualCheck.manual) {
        const pricing = input.spot_price_per_g_fine
            ? computePricing(input, variant)
            : null;
        return {
            status: 'manual_review',
            product: {
                family_id: family.family_id,
                variant_code: variant.variant_code,
                metal: family.identity.metal,
                archetype,
                series_role: family.identity.series_role,
            },
            pricing,
            analysis: {
                intent: input.user_intent,
                message: { key: policy.manual_review_rules.message_template, vars: { intent: input.user_intent } },
            },
            manual_review: { reason_code: manualCheck.reason },
            warnings: [],
            error: null,
            missing_fields: [],
        };
    }

    // 5. Calcul prime — spot obligatoire à partir d'ici
    if (!input.spot_price_per_g_fine) {
        return {
            status: 'incomplete',
            product: {
                family_id: family.family_id,
                variant_code: variant.variant_code,
                metal: family.identity.metal,
                archetype,
                series_role: family.identity.series_role,
            },
            pricing: null,
            analysis: null,
            manual_review: null,
            warnings: [],
            error: null,
            missing_fields: ['spot_price_per_g_fine'],
        };
    }
    const pricing = computePricing(input, variant);

    // 6. Seuils
    const thresholds = resolveThresholds(family.identity.metal, archetype, input.user_intent, policy);
    if (!thresholds) {
        return {
            status: 'error',
            product: {
                family_id: family.family_id,
                variant_code: variant.variant_code,
                metal: family.identity.metal,
                archetype,
                series_role: family.identity.series_role,
            },
            pricing,
            analysis: null,
            manual_review: null,
            warnings: [{ code: 'missing_thresholds_for_archetype', message: policy.error_rules.missing_thresholds_for_archetype.message_template }],
            error: { code: 'missing_thresholds_for_archetype', message: policy.error_rules.missing_thresholds_for_archetype.message_template },
            missing_fields: [],
        };
    }

    // 7. Position
    const position = resolvePosition(pricing.premium_pct, thresholds);

    // 8. Message
    const message = resolveMessage(position, family.identity.metal, input.user_intent, policy.message_templates);

    // 9. Résultat évalué
    return {
        status: 'evaluated',
        product: {
            family_id: family.family_id,
            variant_code: variant.variant_code,
            metal: family.identity.metal,
            archetype,
            series_role: family.identity.series_role,
        },
        pricing,
        analysis: {
            intent: input.user_intent,
            position,
            thresholds,
            message,
        },
        manual_review: null,
        warnings: [],
        error: null,
        missing_fields: [],
    };
}
