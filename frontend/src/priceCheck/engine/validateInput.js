const VALID_INTENTS = ['stacking', 'semi_stack', 'liquidity'];

/**
 * Validates and normalizes raw input before catalog resolution.
 * Does NOT check catalog existence — that is resolveCatalogProduct's job.
 *
 * @param {object} rawInput
 * @returns {{ ok: true, data: object } | { ok: false, errors: Array<{ code: string, field: string }> }}
 */
export function validateInput(rawInput) {
    const errors = [];

    if (rawInput === null || typeof rawInput !== 'object') {
        return { ok: false, errors: [{ code: 'invalid_input', field: 'input' }] };
    }

    // --- Champs requis ---

    if (!rawInput.family_id || typeof rawInput.family_id !== 'string') {
        errors.push({ code: 'missing_required_field', field: 'family_id' });
    }

    if (!rawInput.variant_code || typeof rawInput.variant_code !== 'string') {
        errors.push({ code: 'missing_required_field', field: 'variant_code' });
    }

    const askPrice = rawInput.ask_price;
    if (askPrice === undefined || askPrice === null) {
        errors.push({ code: 'invalid_ask_price', field: 'ask_price' });
    } else if (typeof askPrice !== 'number' || !isFinite(askPrice) || askPrice <= 0) {
        errors.push({ code: 'invalid_ask_price', field: 'ask_price' });
    }

    const intent = typeof rawInput.user_intent === 'string'
        ? rawInput.user_intent.toLowerCase()
        : rawInput.user_intent;

    if (!intent || !VALID_INTENTS.includes(intent)) {
        errors.push({ code: 'invalid_user_intent', field: 'user_intent' });
    }

    // --- Champs optionnels avec contraintes ---

    const spot = rawInput.spot_price_per_g_fine;
    if (spot !== undefined && spot !== null) {
        if (typeof spot !== 'number' || !isFinite(spot) || spot <= 0) {
            errors.push({ code: 'invalid_spot_price', field: 'spot_price_per_g_fine' });
        }
    }

    const quantity = rawInput.quantity;
    if (quantity !== undefined && quantity !== null) {
        if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
            errors.push({ code: 'invalid_quantity', field: 'quantity' });
        }
    }

    if (errors.length > 0) {
        return { ok: false, errors };
    }

    // --- Normalisation ---

    const currency = typeof rawInput.currency === 'string'
        ? rawInput.currency.toUpperCase()
        : 'USD';

    return {
        ok: true,
        data: {
            family_id: rawInput.family_id.trim(),
            variant_code: rawInput.variant_code.trim(),
            ask_price: askPrice,
            user_intent: intent,
            spot_price_per_g_fine: spot ?? null,
            currency,
            quantity: quantity ?? 1,
            source: rawInput.source ?? null,
            raw_title: rawInput.raw_title ?? null,
            ocr_text: rawInput.ocr_text ?? null,
        },
    };
}
