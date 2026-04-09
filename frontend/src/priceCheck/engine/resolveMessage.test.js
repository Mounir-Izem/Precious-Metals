import { describe, it, expect } from 'vitest';
import { resolveMessage } from './resolveMessage.js';

const messageTemplates = {
    below_spot:       { default: 'priceCheck.result.default.below_spot', gold: 'priceCheck.result.gold.below_spot' },
    within_range_low: { gold: 'priceCheck.result.gold.within_range_low', silver: 'priceCheck.result.silver.within_range_low' },
    within_range_high:{ default: 'priceCheck.result.default.within_range_high' },
    borderline:       { default: 'priceCheck.result.default.borderline' },
    above_range:      { gold: 'priceCheck.result.gold.above_range', silver: 'priceCheck.result.silver.above_range' },
};

describe('resolveMessage', () => {
    // --- Résolution clé ---

    it('retourne la clé spécifique au métal si elle existe', () => {
        const result = resolveMessage('below_spot', 'gold', 'stacking', messageTemplates);
        expect(result.key).toBe('priceCheck.result.gold.below_spot');
    });

    it('retourne la clé default si le métal n\'a pas de clé pour cette position', () => {
        const result = resolveMessage('below_spot', 'silver', 'stacking', messageTemplates);
        expect(result.key).toBe('priceCheck.result.default.below_spot');
    });

    it('retourne la clé default pour borderline', () => {
        const result = resolveMessage('borderline', 'gold', 'stacking', messageTemplates);
        expect(result.key).toBe('priceCheck.result.default.borderline');
    });

    it('retourne la clé métal pour silver above_range', () => {
        const result = resolveMessage('above_range', 'silver', 'liquidity', messageTemplates);
        expect(result.key).toBe('priceCheck.result.silver.above_range');
    });

    it('retourne une clé fallback si messageTemplates est null', () => {
        const result = resolveMessage('below_spot', 'gold', 'stacking', null);
        expect(result.key).toBe('priceCheck.result.below_spot');
    });

    it('retourne la clé default si position présente avec default seulement', () => {
        const result = resolveMessage('within_range_high', 'gold', 'stacking', messageTemplates);
        expect(result.key).toBe('priceCheck.result.default.within_range_high');
    });

    // --- Intent labels ---

    it('traduit stacking en "stacking"', () => {
        const result = resolveMessage('below_spot', 'gold', 'stacking', messageTemplates);
        expect(result.vars.intent).toBe('stacking');
    });

    it('retourne semi_stack brut', () => {
        const result = resolveMessage('below_spot', 'gold', 'semi_stack', messageTemplates);
        expect(result.vars.intent).toBe('semi_stack');
    });

    it('retourne liquidity brut', () => {
        const result = resolveMessage('below_spot', 'gold', 'liquidity', messageTemplates);
        expect(result.vars.intent).toBe('liquidity');
    });

    it('retourne l\'intent brut si inconnu', () => {
        const result = resolveMessage('below_spot', 'gold', 'unknown_intent', messageTemplates);
        expect(result.vars.intent).toBe('unknown_intent');
    });
});
