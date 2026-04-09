/**
 * Retrieves thresholds for a given metal / archetype / intent combination.
 * Returns null if no thresholds exist — caller is responsible for handling it.
 *
 * @param {string} metal — 'gold' | 'silver'
 * @param {string} archetype — 'bullion' | 'historical_bullion' | 'semi' | 'junk' | 'manual_review'
 * @param {string} intent — 'stacking' | 'semi_stack' | 'liquidity'
 * @param {object} policy — verdict_policy.json object
 * @returns {{ low_max: number, high_max: number, limit_max?: number } | null}
 */
export function resolveThresholds(metal, archetype, intent, policy) {
    return policy?.thresholds?.[metal]?.[archetype]?.[intent] ?? null;
}
