import { describe, it, expect } from 'vitest';
import { resolveArchetype } from './resolveArchetype.js';

const makeFamily = (overrides = {}) => ({
    identity: {
        metal: 'gold',
        series_role: 'bullion',
        ...overrides.identity,
    },
    trade_profile: {
        pricing_engine: 'spot_plus_premium',
        collection_sensitivity: 'low',
        year_sensitivity: 'low',
        condition_sensitivity: 'low',
        ...overrides.trade_profile,
    },
});

describe('resolveArchetype', () => {
    // --- manual_review ---

    it('retourne manual_review si pricing_engine = manual_only', () => {
        const family = makeFamily({ trade_profile: { pricing_engine: 'manual_only' } });
        expect(resolveArchetype(family)).toBe('manual_review');
    });

    it('retourne manual_review si collection_sensitivity = high', () => {
        const family = makeFamily({ trade_profile: { collection_sensitivity: 'high' } });
        expect(resolveArchetype(family)).toBe('manual_review');
    });

    it('retourne manual_review si year_sensitivity = high', () => {
        const family = makeFamily({ trade_profile: { year_sensitivity: 'high' } });
        expect(resolveArchetype(family)).toBe('manual_review');
    });

    it('retourne manual_review si condition_sensitivity = high', () => {
        const family = makeFamily({ trade_profile: { condition_sensitivity: 'high' } });
        expect(resolveArchetype(family)).toBe('manual_review');
    });

    it('manual_review prend le dessus sur junk', () => {
        const family = makeFamily({
            identity: { series_role: 'junk_investment' },
            trade_profile: { pricing_engine: 'melt_value', year_sensitivity: 'high' },
        });
        expect(resolveArchetype(family)).toBe('manual_review');
    });

    // --- junk ---

    it('retourne junk si pricing_engine = melt_value', () => {
        const family = makeFamily({
            identity: { series_role: 'junk_investment' },
            trade_profile: { pricing_engine: 'melt_value' },
        });
        expect(resolveArchetype(family)).toBe('junk');
    });

    it('retourne junk si series_role = junk_investment', () => {
        const family = makeFamily({ identity: { series_role: 'junk_investment' } });
        expect(resolveArchetype(family)).toBe('junk');
    });

    // --- historical_bullion ---

    it('retourne historical_bullion pour or historique', () => {
        const family = makeFamily({ identity: { metal: 'gold', series_role: 'historical_bullion' } });
        expect(resolveArchetype(family)).toBe('historical_bullion');
    });

    it('ne retourne PAS historical_bullion pour argent historical_bullion', () => {
        const family = makeFamily({ identity: { metal: 'silver', series_role: 'historical_bullion' } });
        expect(resolveArchetype(family)).not.toBe('historical_bullion');
    });

    // --- semi ---

    it('retourne semi si series_role = semi_bullion', () => {
        const family = makeFamily({ identity: { series_role: 'semi_bullion' } });
        expect(resolveArchetype(family)).toBe('semi');
    });

    it('retourne semi si series_role = semi_bullion_high_sensitivity (sensibilités non high)', () => {
        const family = makeFamily({ identity: { series_role: 'semi_bullion_high_sensitivity' } });
        expect(resolveArchetype(family)).toBe('semi');
    });

    // --- bullion ---

    it('retourne bullion pour un bullion standard', () => {
        const family = makeFamily();
        expect(resolveArchetype(family)).toBe('bullion');
    });

    // --- unknown ---

    it('retourne unknown si aucune règle ne matche', () => {
        const family = makeFamily({ identity: { series_role: 'inexistant' } });
        expect(resolveArchetype(family)).toBe('unknown');
    });
});
