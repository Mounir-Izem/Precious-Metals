import { describe, it, expect } from 'vitest';
import { resolvePosition } from './resolvePosition.js';

const thresholds = { low_max: 5, high_max: 10 };
const thresholdsLimit = { low_max: 5, high_max: 10, limit_max: 15 };

describe('resolvePosition', () => {
    // --- below_spot ---

    it('retourne below_spot si premium_pct = 0', () => {
        expect(resolvePosition(0, thresholds)).toBe('below_spot');
    });

    it('retourne below_spot si premium_pct négatif', () => {
        expect(resolvePosition(-5, thresholds)).toBe('below_spot');
    });

    // --- within_range_low ---

    it('retourne within_range_low si premium_pct = low_max', () => {
        expect(resolvePosition(5, thresholds)).toBe('within_range_low');
    });

    it('retourne within_range_low si premium_pct < low_max', () => {
        expect(resolvePosition(3, thresholds)).toBe('within_range_low');
    });

    // --- within_range_high ---

    it('retourne within_range_high si premium_pct entre low_max et high_max', () => {
        expect(resolvePosition(7, thresholds)).toBe('within_range_high');
    });

    it('retourne within_range_high si premium_pct = high_max', () => {
        expect(resolvePosition(10, thresholds)).toBe('within_range_high');
    });

    // --- borderline ---

    it('retourne borderline si premium_pct entre high_max et limit_max', () => {
        expect(resolvePosition(12, thresholdsLimit)).toBe('borderline');
    });

    it('retourne borderline si premium_pct = limit_max', () => {
        expect(resolvePosition(15, thresholdsLimit)).toBe('borderline');
    });

    it('ne retourne JAMAIS borderline sans limit_max', () => {
        expect(resolvePosition(12, thresholds)).toBe('above_range');
    });

    // --- above_range ---

    it('retourne above_range si premium_pct > high_max sans limit_max', () => {
        expect(resolvePosition(11, thresholds)).toBe('above_range');
    });

    it('retourne above_range si premium_pct > limit_max', () => {
        expect(resolvePosition(20, thresholdsLimit)).toBe('above_range');
    });
});
