import { describe, it, expect } from 'vitest';
import { validateInput } from './validateInput.js';

describe('validateInput', () => {
    const validInput = {
        family_id: 'gold-sovereign-family',
        variant_code: 'full',
        ask_price: 450,
        user_intent: 'stacking',
        spot_price_per_g_fine: 85.5,
    };

    // --- Cas valides ---

    it('retourne ok:true avec un input valide minimal', () => {
        const result = validateInput(validInput);
        expect(result.ok).toBe(true);
        expect(result.data.family_id).toBe('gold-sovereign-family');
        expect(result.data.quantity).toBe(1);
        expect(result.data.currency).toBe('USD');
    });

    it('applique les defaults currency et quantity si absents', () => {
        const result = validateInput(validInput);
        expect(result.data.currency).toBe('USD');
        expect(result.data.quantity).toBe(1);
    });

    it('normalise currency en majuscules', () => {
        const result = validateInput({ ...validInput, currency: 'eur' });
        expect(result.ok).toBe(true);
        expect(result.data.currency).toBe('EUR');
    });

    it('normalise user_intent en minuscules', () => {
        const result = validateInput({ ...validInput, user_intent: 'STACKING' });
        expect(result.ok).toBe(true);
        expect(result.data.user_intent).toBe('stacking');
    });

    it('accepte semi_stack et liquidity comme intents valides', () => {
        expect(validateInput({ ...validInput, user_intent: 'semi_stack' }).ok).toBe(true);
        expect(validateInput({ ...validInput, user_intent: 'liquidity' }).ok).toBe(true);
    });

    it('accepte spot_price_per_g_fine absent (cas manual_only)', () => {
        const { spot_price_per_g_fine: _, ...withoutSpot } = validInput;
        const result = validateInput(withoutSpot);
        expect(result.ok).toBe(true);
        expect(result.data.spot_price_per_g_fine).toBeNull();
    });

    // --- Cas bloquants — champs requis ---

    it('retourne ok:false si input est null', () => {
        const result = validateInput(null);
        expect(result.ok).toBe(false);
        expect(result.errors[0].code).toBe('invalid_input');
    });

    it('retourne ok:false si family_id absent', () => {
        const { family_id: _, ...rest } = validInput;
        const result = validateInput(rest);
        expect(result.ok).toBe(false);
        expect(result.errors.some(e => e.field === 'family_id')).toBe(true);
    });

    it('retourne ok:false si family_id est une chaîne vide', () => {
        const result = validateInput({ ...validInput, family_id: '' });
        expect(result.ok).toBe(false);
    });

    it('retourne ok:false si ask_price est absent', () => {
        const { ask_price: _, ...rest } = validInput;
        const result = validateInput(rest);
        expect(result.ok).toBe(false);
        expect(result.errors.some(e => e.field === 'ask_price')).toBe(true);
    });

    it('retourne ok:false si ask_price est négatif', () => {
        const result = validateInput({ ...validInput, ask_price: -10 });
        expect(result.ok).toBe(false);
    });

    it('retourne ok:false si ask_price est zéro', () => {
        const result = validateInput({ ...validInput, ask_price: 0 });
        expect(result.ok).toBe(false);
    });

    it('retourne ok:false si ask_price est Infinity', () => {
        const result = validateInput({ ...validInput, ask_price: Infinity });
        expect(result.ok).toBe(false);
    });

    it('retourne ok:false si user_intent est invalide', () => {
        const result = validateInput({ ...validInput, user_intent: 'collection' });
        expect(result.ok).toBe(false);
        expect(result.errors.some(e => e.field === 'user_intent')).toBe(true);
    });

    // --- Cas bloquants — champs optionnels ---

    it('retourne ok:false si spot présent mais négatif', () => {
        const result = validateInput({ ...validInput, spot_price_per_g_fine: -1 });
        expect(result.ok).toBe(false);
        expect(result.errors.some(e => e.field === 'spot_price_per_g_fine')).toBe(true);
    });

    it('retourne ok:false si quantity est un décimal', () => {
        const result = validateInput({ ...validInput, quantity: 1.5 });
        expect(result.ok).toBe(false);
        expect(result.errors.some(e => e.field === 'quantity')).toBe(true);
    });

    it('retourne ok:false si quantity est zéro', () => {
        const result = validateInput({ ...validInput, quantity: 0 });
        expect(result.ok).toBe(false);
    });

    // --- Accumulation d'erreurs ---

    it('accumule plusieurs erreurs en une seule passe', () => {
        const result = validateInput({ family_id: '', ask_price: -5, user_intent: 'bad' });
        expect(result.ok).toBe(false);
        expect(result.errors.length).toBeGreaterThan(1);
    });
});
