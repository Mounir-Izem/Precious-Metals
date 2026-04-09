/**
 * Resolves the i18n message key and variables for a given position/intent/metal.
 * vars.intent is the raw intent key — the UI layer resolves the label via priceCheck.intents.{intent}.
 *
 * @param {string} position — 'below_spot'|'within_range_low'|'within_range_high'|'borderline'|'above_range'
 * @param {string} metal — 'gold' | 'silver'
 * @param {string} intent — 'stacking' | 'semi_stack' | 'liquidity'
 * @param {object} messageTemplates — policy.message_templates object
 * @returns {{ key: string, vars: { intent: string } }}
 */
export function resolveMessage(position, metal, intent, messageTemplates) {
    const key =
        messageTemplates?.[position]?.[metal] ??
        messageTemplates?.[position]?.['default'] ??
        `priceCheck.result.${position}`;

    return { key, vars: { intent } };
}
