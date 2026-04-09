/**
 * Determines the position of a premium relative to thresholds.
 * 'borderline' is NEVER produced without limit_max.
 *
 * @param {number} premium_pct
 * @param {{ low_max: number, high_max: number, limit_max?: number }} thresholds
 * @returns {'below_spot'|'within_range_low'|'within_range_high'|'borderline'|'above_range'}
 */
export function resolvePosition(premium_pct, thresholds) {
    const { low_max, high_max, limit_max } = thresholds;

    if (premium_pct <= 0) return 'below_spot';
    if (premium_pct <= low_max) return 'within_range_low';
    if (premium_pct <= high_max) return 'within_range_high';
    if (limit_max !== undefined && premium_pct <= limit_max) return 'borderline';
    return 'above_range';
}
