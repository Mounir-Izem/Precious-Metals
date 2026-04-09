import { describe, it, expect } from 'vitest';
import { runPriceCheck } from './priceCheckEngine.js';

// --- Fixtures ---

const catalog = {
    families: [
        {
            family_id: 'gold-bullion-test',
            identity: { metal: 'gold', series_role: 'bullion' },
            trade_profile: {
                pricing_engine: 'spot_plus_premium',
                collection_sensitivity: 'low',
                year_sensitivity: 'low',
                condition_sensitivity: 'low',
            },
            variants: [{ variant_code: '1oz', fine_weight_g: 31.1035 }],
        },
        {
            family_id: 'silver-bullion-test',
            identity: { metal: 'silver', series_role: 'bullion' },
            trade_profile: {
                pricing_engine: 'spot_plus_premium',
                collection_sensitivity: 'low',
                year_sensitivity: 'low',
                condition_sensitivity: 'low',
            },
            variants: [{ variant_code: '1oz', fine_weight_g: 31.1035 }],
        },
        {
            family_id: 'silver-manual-test',
            identity: { metal: 'silver', series_role: 'semi_bullion_high_sensitivity' },
            trade_profile: {
                pricing_engine: 'manual_only',
                collection_sensitivity: 'high',
                year_sensitivity: 'high',
                condition_sensitivity: 'high',
            },
            variants: [{ variant_code: '1oz', fine_weight_g: 31.0724 }],
        },
        {
            family_id: 'gold-no-thresholds-test',
            identity: { metal: 'gold', series_role: 'semi_bullion' },
            trade_profile: {
                pricing_engine: 'spot_plus_premium',
                collection_sensitivity: 'low',
                year_sensitivity: 'low',
                condition_sensitivity: 'low',
            },
            variants: [{ variant_code: '1oz', fine_weight_g: 31.1035 }],
        },
        {
            family_id: 'gold-unknown-archetype-test',
            identity: { metal: 'gold', series_role: 'unrecognized_role' },
            trade_profile: {
                pricing_engine: 'spot_plus_premium',
                collection_sensitivity: 'low',
                year_sensitivity: 'low',
                condition_sensitivity: 'low',
            },
            variants: [{ variant_code: '1oz', fine_weight_g: 31.1035 }],
        },
        {
            family_id: 'gold-limited-intents-test',
            identity: { metal: 'gold', series_role: 'bullion' },
            supported_intents: ['stacking', 'liquidity'],
            trade_profile: {
                pricing_engine: 'spot_plus_premium',
                collection_sensitivity: 'low',
                year_sensitivity: 'low',
                condition_sensitivity: 'low',
            },
            variants: [{ variant_code: '1oz', fine_weight_g: 31.1035 }],
        },
    ],
};

const policy = {
    thresholds: {
        gold: {
            bullion: {
                stacking: { low_max: 5, high_max: 9 },
                semi_stack: { low_max: 8, high_max: 14 },
                liquidity: { low_max: 6, high_max: 10 },
            },
        },
        silver: {
            bullion: {
                stacking: { low_max: 10, high_max: 18 },
                liquidity: { low_max: 10, high_max: 18, limit_max: 22 },
            },
        },
    },
    manual_review_rules: {
        message_template: 'priceCheck.manual_review.message',
    },
    warning_rules: {},
    error_rules: {
        missing_thresholds_for_archetype: {
            message_template: 'priceCheck.warnings.missing_thresholds',
        },
    },
    message_templates: {
        below_spot: { default: 'priceCheck.messages.below_spot.default' },
        within_range_low: { gold: 'priceCheck.messages.within_range_low.gold', silver: 'priceCheck.messages.within_range_low.silver' },
        within_range_high: { gold: 'priceCheck.messages.within_range_high.gold', silver: 'priceCheck.messages.within_range_high.silver' },
        borderline: { default: 'priceCheck.messages.borderline.default' },
        above_range: { gold: 'priceCheck.messages.above_range.gold', silver: 'priceCheck.messages.above_range.silver' },
    },
};

const baseInput = {
    family_id: 'gold-bullion-test',
    variant_code: '1oz',
    ask_price: 2750,
    user_intent: 'stacking',
    spot_price_per_g_fine: 85,
};

// --- incomplete ---

describe('status: incomplete', () => {
    it('retourne incomplete si rawInput est null', () => {
        const result = runPriceCheck(null, catalog, policy);
        expect(result.status).toBe('incomplete');
    });

    it('retourne incomplete si ask_price est absent', () => {
        const { ask_price: _, ...rest } = baseInput;
        const result = runPriceCheck(rest, catalog, policy);
        expect(result.status).toBe('incomplete');
        expect(result.missing_fields).toContain('ask_price');
    });

    it('retourne incomplete si user_intent est invalide', () => {
        const result = runPriceCheck({ ...baseInput, user_intent: 'collection' }, catalog, policy);
        expect(result.status).toBe('incomplete');
    });

    it('retourne incomplete si spot_price_per_g_fine absent pour une pièce non manual', () => {
        const { spot_price_per_g_fine: _, ...rest } = baseInput;
        const result = runPriceCheck(rest, catalog, policy);
        expect(result.status).toBe('incomplete');
        expect(result.missing_fields).toContain('spot_price_per_g_fine');
    });
});

// --- error ---

describe('status: error', () => {
    it('retourne error si family_id inconnue', () => {
        const result = runPriceCheck({ ...baseInput, family_id: 'inexistante' }, catalog, policy);
        expect(result.status).toBe('error');
        expect(result.error.code).toBe('unknown_family');
    });

    it('retourne error si variant_code inconnu dans la famille', () => {
        const result = runPriceCheck({ ...baseInput, variant_code: 'inexistant' }, catalog, policy);
        expect(result.status).toBe('error');
        expect(result.error.code).toBe('unknown_variant');
    });

    it('retourne error si aucun seuil pour cette combinaison archetype/intent', () => {
        const result = runPriceCheck(
            { ...baseInput, family_id: 'gold-no-thresholds-test', user_intent: 'stacking' },
            catalog,
            policy
        );
        expect(result.status).toBe('error');
        expect(result.error.code).toBe('missing_thresholds_for_archetype');
    });

    it('retourne error avec policy_resolution_failed si archetype unknown', () => {
        const result = runPriceCheck(
            { ...baseInput, family_id: 'gold-unknown-archetype-test' },
            catalog,
            policy
        );
        expect(result.status).toBe('error');
        expect(result.error.code).toBe('policy_resolution_failed');
    });
});

// --- manual_review ---

describe('status: manual_review', () => {
    it('retourne manual_review pour une pièce manual_only', () => {
        const result = runPriceCheck(
            { ...baseInput, family_id: 'silver-manual-test', spot_price_per_g_fine: 0.85 },
            catalog,
            policy
        );
        expect(result.status).toBe('manual_review');
        expect(result.manual_review.reason_code).toBe('manual_only');
    });

    it('calcule quand même la prime en manual_review si spot fourni', () => {
        const result = runPriceCheck(
            { ...baseInput, family_id: 'silver-manual-test', spot_price_per_g_fine: 0.85 },
            catalog,
            policy
        );
        expect(result.pricing).not.toBeNull();
        expect(result.pricing.melt_value).toBeGreaterThan(0);
    });

    it('retourne pricing null en manual_review si spot absent', () => {
        const { spot_price_per_g_fine: _, ...rest } = baseInput;
        const result = runPriceCheck(
            { ...rest, family_id: 'silver-manual-test' },
            catalog,
            policy
        );
        expect(result.status).toBe('manual_review');
        expect(result.pricing).toBeNull();
    });

    it('retourne manual_review si intent non dans supported_intents', () => {
        const result = runPriceCheck(
            { ...baseInput, family_id: 'gold-limited-intents-test', user_intent: 'semi_stack' },
            catalog,
            policy
        );
        expect(result.status).toBe('manual_review');
        expect(result.manual_review.reason_code).toBe('not_reliably_modelled_for_intent');
    });

    it('calcule la prime en manual_review unsupported_intent si spot fourni', () => {
        const result = runPriceCheck(
            { ...baseInput, family_id: 'gold-limited-intents-test', user_intent: 'semi_stack' },
            catalog,
            policy
        );
        expect(result.pricing).not.toBeNull();
        expect(result.pricing.melt_value).toBeGreaterThan(0);
    });

    it('retourne pricing null en manual_review unsupported_intent si spot absent', () => {
        const { spot_price_per_g_fine: _, ...rest } = baseInput;
        const result = runPriceCheck(
            { ...rest, family_id: 'gold-limited-intents-test', user_intent: 'semi_stack' },
            catalog,
            policy
        );
        expect(result.status).toBe('manual_review');
        expect(result.pricing).toBeNull();
    });
});

// --- evaluated ---

describe('status: evaluated', () => {
    it('retourne evaluated avec position below_spot si ask < melt', () => {
        // melt_value = 31.1035 * 85 = 2643.80 — ask_price en dessous
        const result = runPriceCheck({ ...baseInput, ask_price: 2600 }, catalog, policy);
        expect(result.status).toBe('evaluated');
        expect(result.analysis.position).toBe('below_spot');
    });

    it('retourne evaluated avec position within_range_low', () => {
        // premium_pct ~2% — sous low_max: 5
        const result = runPriceCheck({ ...baseInput, ask_price: 2700 }, catalog, policy);
        expect(result.status).toBe('evaluated');
        expect(result.analysis.position).toBe('within_range_low');
    });

    it('retourne evaluated avec position within_range_high', () => {
        // melt = 31.1035 * 85 = 2643.80 — ask = 2829 → premium_pct ~7% — entre low_max: 5 et high_max: 9
        const result = runPriceCheck({ ...baseInput, ask_price: 2829 }, catalog, policy);
        expect(result.status).toBe('evaluated');
        expect(result.analysis.position).toBe('within_range_high');
    });

    it('retourne evaluated avec position above_range', () => {
        // premium_pct ~21% — au-dessus de high_max: 10
        const result = runPriceCheck({ ...baseInput, ask_price: 3200 }, catalog, policy);
        expect(result.status).toBe('evaluated');
        expect(result.analysis.position).toBe('above_range');
    });

    it('retourne evaluated avec position borderline si limit_max présent', () => {
        // silver bullion liquidity : low_max:10 high_max:18 limit_max:22
        // melt = 31.1035 * 0.85 = 26.44 — ask = 32 → premium_pct ~21% → borderline
        const result = runPriceCheck(
            { ...baseInput, family_id: 'silver-bullion-test', user_intent: 'liquidity', spot_price_per_g_fine: 0.85, ask_price: 32 },
            catalog,
            policy
        );
        expect(result.status).toBe('evaluated');
        expect(result.analysis.position).toBe('borderline');
    });

    it('expose les thresholds dans analysis', () => {
        const result = runPriceCheck({ ...baseInput, ask_price: 2700 }, catalog, policy);
        expect(result.analysis.thresholds).toEqual({ low_max: 5, high_max: 9 });
    });

    it('expose asking_price dans pricing', () => {
        const result = runPriceCheck({ ...baseInput, ask_price: 2700 }, catalog, policy);
        expect(result.pricing.asking_price).toBe(2700);
    });

    it('expose series_role dans product', () => {
        const result = runPriceCheck({ ...baseInput, ask_price: 2700 }, catalog, policy);
        expect(result.product.series_role).toBe('bullion');
    });

    it('expose une clé message i18n dans analysis', () => {
        const result = runPriceCheck({ ...baseInput, ask_price: 2700 }, catalog, policy);
        expect(result.analysis.message.key).toBeTypeOf('string');
        expect(result.analysis.message.vars.intent).toBe('stacking');
    });
});

// --- quantity > 1 ---

describe('quantity > 1', () => {
    it('melt_value est multiplié par quantity', () => {
        // fine_weight_total = 31.1035 * 2 = 62.207, melt = 62.207 * 85 = 5287.60
        const result = runPriceCheck({ ...baseInput, ask_price: 5500, quantity: 2 }, catalog, policy);
        expect(result.status).toBe('evaluated');
        expect(result.pricing.melt_value).toBeCloseTo(5287.60, 0);
    });

    it('premium_pct est cohérent avec quantity > 1', () => {
        // melt = 5287.60, ask = 5500, premium = 212.40, pct ≈ 4.02%
        const result = runPriceCheck({ ...baseInput, ask_price: 5500, quantity: 2 }, catalog, policy);
        expect(result.pricing.premium_pct).toBeCloseTo(4.02, 1);
    });
});
