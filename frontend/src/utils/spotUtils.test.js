import { describe, it, expect } from 'vitest';
import { trendColor, 
        absFmt, 
        fmt, 
        sign, 
        convertUnit, 
        convertCurrency, 
        convertPrice 
    } from './spotUtils';

// Tests pour la fonction trendColor
describe('trendColor', () => {
    it('should return text-green-400 for positive values', () => {
        expect(trendColor(10)).toBe('text-green-400');
    });
    it('should return text-gray-400 for zero', () => {
        expect(trendColor(0)).toBe('text-gray-400');
    });
    it('should return text-red-400 for negative values', () => {
        expect(trendColor(-5)).toBe('text-red-400');
    });
    it('should return empty string for invalid values', () => {
        expect(trendColor(null)).toBe('');
        expect(trendColor(undefined)).toBe('');
        expect(trendColor(NaN)).toBe('');
    });
});

//tests pour la fonction absFmt
describe('absFmt', () => {
    it('should return absolute value with 2 decimals for positive numbers', () => {
        expect(absFmt(10.567)).toBe('10.57');
    });
    it('should return absolute value with 2 decimals for negative numbers', () => {
        expect(absFmt(-10.567)).toBe('10.57');
    });
    it('should return absolute value with 2 decimals for zero', () => {
        expect(absFmt(0)).toBe('0.00');
    });
    it('should return empty string for invalid values', () => {
        expect(absFmt(null)).toBe('-');
        expect(absFmt(undefined)).toBe('-');
        expect(absFmt(NaN)).toBe('-');
    });
});

// tests pour la fonction fmt
describe('fmt', () => {
    it('should return value with 2 decimals for positive numbers', () => {
        expect(fmt(10.567)).toBe('10.57');
    });
    it('should return value with 2 decimals for negative numbers', () => {
        expect(fmt(-10.567)).toBe('-10.57');
    });
    it('should return value with 2 decimals for zero', () => {
        expect(fmt(0)).toBe('0.00');
    });
    it('should return empty string for invalid values', () => {
        expect(fmt(null)).toBe('-');
        expect(fmt(undefined)).toBe('-');
        expect(fmt(NaN)).toBe('-');
    });
});

// tests pour la fonction sign
describe('sign', () => {
    it('should return + for positive values', () => {
        expect(sign(10)).toBe('+');
    });
    it('should return - for negative values', () => {
        expect(sign(-5)).toBe('-');
    });
    it('should return = for zero', () => {
        expect(sign(0)).toBe('=');
    });
    it('should return empty string for invalid values', () => {
        expect(sign(null)).toBe('');
        expect(sign(undefined)).toBe('');
        expect(sign(NaN)).toBe('');
    });
});

// tests pour la fonction convertUnit
describe('convertUnit', () => {
    it('should return price unchanged for oz', () => {
        expect(convertUnit(100, 'oz')).toBe(100);
    });
    it('should convert oz price from g price', () => {
        expect(convertUnit(31.1035, 'g')).toBeCloseTo(1, 5);
    });
    it('should convert oz price from kg price', () => {
        expect(convertUnit(31.1035, 'kg')).toBeCloseTo(1000, 3);
    });
    it('should return price unchanged for unknown unit', () => {
        expect(convertUnit(100, 'invalid')).toBe(100);
    });

});

// tests pour la fonction convertCurrency
describe('convertCurrency', () => {
    it('should return price unchanged for USD', () => {
        expect(convertCurrency(100, 'USD', '1.1', '0.85')).toBe(100)
    });
    it('should convert USD to EUR', () => {
        expect(convertCurrency(110, 'EUR', '1.1', '0.85')).toBeCloseTo(100, 2)
    });
    it('should convert USD to GBP', () => {
        expect(convertCurrency(85, 'GBP', '1.1', '0.85')).toBeCloseTo(100, 2)
    });
    it('should return price unchanged for unknown currency', () => {
        expect(convertCurrency(100, 'invalid', '1.1', '0.85')).toBe(100)
    });
    it('should return null for EUR rate of 0', () => {
        expect(convertCurrency(100, 'EUR', '0', '0.85')).toBeNull()
    });
    it('should return null for invalid EUR rate', () => {
        expect(convertCurrency(100, 'EUR', 'abc', '0.85')).toBeNull()
    });
    it('should return null for GBP rate of 0', () => {
        expect(convertCurrency(100, 'GBP', '1.1', '0')).toBeNull()
    });
    it('should return null for invalid GBP rate', () => {
        expect(convertCurrency(100, 'GBP', '1.1', 'abc')).toBeNull()
    });
});

// tests pour la fonction convertPrice
describe('convertPrice', () => {
    it('should return unchanged price for oz and USD', () => {
        expect(convertPrice('100', 'oz', 'USD', '1.1', '0.85')).toBe(100)
    });
    it('should convert price from oz to g and USD to EUR', () => {
        expect(convertPrice('31.1035', 'g', 'EUR', '1.1', '0.85')).toBeCloseTo(0.909, 2)
    });
    it('should return null for null price', () => {
        expect(convertPrice(null, 'oz', 'USD', '1.1', '0.85')).toBeNull()
        expect(convertPrice('abc', 'oz', 'USD', '1.1', '0.85')).toBeNull()
        expect(convertPrice(null, 'oz', 'USD', '1.1', '0.85')).toBeNull()
        expect(convertPrice(undefined, 'oz', 'USD', '1.1', '0.85')).toBeNull()
        expect(convertPrice(NaN, 'oz', 'USD', '1.1', '0.85')).toBeNull()
    });
});
