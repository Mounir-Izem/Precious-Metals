import { describe, it, expect } from 'vitest';
import { resolveThresholds } from './resolveThresholds.js';

const policy = {
    thresholds: {
        gold: {
            bullion: {
                stacking: { low_max: 3, high_max: 6 },
                semi_stack: { low_max: 10, high_max: 20 },
                liquidity: { low_max: 2, high_max: 5 },
            },
            historical_bullion: {
                stacking: { low_max: 8, high_max: 15 },
                semi_stack: { low_max: 15, high_max: 25 },
                liquidity: { low_max: 5, high_max: 10 },
            },
        },
        silver: {
            bullion: {
                stacking: { low_max: 5, high_max: 10 },
                liquidity: { low_max: 5, high_max: 10, limit_max: 15 },
            },
            semi: {
                semi_stack: { low_max: 30, high_max: 50 },
                liquidity: { low_max: 12, high_max: 18, limit_max: 22 },
            },
        },
    },
};

describe('resolveThresholds', () => {
    it('retourne les seuils pour une combinaison valide', () => {
        const result = resolveThresholds('gold', 'bullion', 'stacking', policy);
        expect(result).toEqual({ low_max: 3, high_max: 6 });
    });

    it('retourne limit_max quand il existe', () => {
        const result = resolveThresholds('silver', 'bullion', 'liquidity', policy);
        expect(result).toEqual({ low_max: 5, high_max: 10, limit_max: 15 });
    });

    it('retourne null si archetype inexistant pour ce métal', () => {
        const result = resolveThresholds('gold', 'semi', 'stacking', policy);
        expect(result).toBeNull();
    });

    it('retourne null si intent inexistant pour cet archetype', () => {
        const result = resolveThresholds('silver', 'bullion', 'semi_stack', policy);
        expect(result).toBeNull();
    });

    it('retourne null si métal inexistant', () => {
        const result = resolveThresholds('platinum', 'bullion', 'stacking', policy);
        expect(result).toBeNull();
    });

    it('retourne null si policy est null', () => {
        const result = resolveThresholds('gold', 'bullion', 'stacking', null);
        expect(result).toBeNull();
    });

    it('retourne null si policy est undefined', () => {
        const result = resolveThresholds('gold', 'bullion', 'stacking', undefined);
        expect(result).toBeNull();
    });
});
