/**
 * Deduces the engine archetype from a catalog family object.
 * Resolution order is strict — see archetype_logic.md.
 *
 * @param {object} family — family object from catalog.json
 * @returns {'bullion'|'historical_bullion'|'semi'|'junk'|'manual_review'|'unknown'}
 */
export function resolveArchetype(family) {
    const { series_role, pricing_engine, collection_sensitivity, year_sensitivity, condition_sensitivity } =
        extractFields(family);

    // 1. manual_review — most restrictive, checked first
    if (
        pricing_engine === 'manual_only' ||
        collection_sensitivity === 'high' ||
        year_sensitivity === 'high' ||
        condition_sensitivity === 'high'
    ) {
        return 'manual_review';
    }

    // 2. junk
    if (pricing_engine === 'melt_value' || series_role === 'junk_investment') {
        return 'junk';
    }

    // 3. historical_bullion — gold only
    if (family.identity?.metal === 'gold' && series_role === 'historical_bullion') {
        return 'historical_bullion';
    }

    // 4. semi
    if (series_role === 'semi_bullion' || series_role === 'semi_bullion_high_sensitivity') {
        return 'semi';
    }

    // 5. bullion
    if (series_role === 'bullion') {
        return 'bullion';
    }

    return 'unknown';
}

function extractFields(family) {
    return {
        series_role: family.identity?.series_role,
        pricing_engine: family.trade_profile?.pricing_engine,
        collection_sensitivity: family.trade_profile?.collection_sensitivity,
        year_sensitivity: family.trade_profile?.year_sensitivity,
        condition_sensitivity: family.trade_profile?.condition_sensitivity,
    };
}
