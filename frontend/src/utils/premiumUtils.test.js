import { describe, it, expect } from "vitest";
import { calcMetalValue,
    calcSpotPerG,
    calcPremiumValue,
    calcPremiumPercent
 } from "./premiumUtils";

 // Tests pour la fonction calcMetalValue
describe("calcMetalValue", () => {
    it("should return the correct metal value for valid inputs", () => {
        const result = calcMetalValue(10, 20);
        expect(result).toBe(200);
    });
    it("should return 0 for zero inputs", () => {
            expect(calcMetalValue(0, 20)).toBe(0);
    });
    it("should return null for non-finite inputs", () => {
        expect(calcMetalValue(null, 20)).toBeNull();
        expect(calcMetalValue(10, undefined)).toBeNull();
        expect(calcMetalValue(NaN, 20)).toBeNull();
    });
});

// Tests pour la fonction calcSpotPerG
describe("calcSpotPerG", () => {
    it("should return the correct spot per gram for valid input", () => {
        const result = calcSpotPerG(31.1035);
        expect(result).toBeCloseTo(1, 5);
    });
    it("should retrun null for zero or negative input", () => {
        expect(calcSpotPerG(0)).toBeNull();
        expect(calcSpotPerG(-1)).toBeNull();
    });
    it("should return null for non-finite inputs", () => {
        expect(calcSpotPerG(null)).toBeNull();
        expect(calcSpotPerG(undefined)).toBeNull();
        expect(calcSpotPerG(NaN)).toBeNull();
    });
});

// Tests pour la fonction calcPremiumValue
describe("calcPremiumValue", () => {
    it("should return the correct premium value for valid inputs", () => {
        const result = calcPremiumValue(250, 200);
        expect(result).toBe(50);
    });
    it("should return negative value when ask price is below metal value", () => {
        expect(calcPremiumValue(500, 510)).toBe(-10); 
    });
    it("should return 0 when ask price equals metal value", () => {
        expect(calcPremiumValue(200, 200)).toBe(0);
    });
    it("should return null for non-finite inputs", () => {
        expect(calcPremiumValue(null, 200)).toBeNull();
        expect(calcPremiumValue(250, undefined)).toBeNull();
        expect(calcPremiumValue(NaN, 200)).toBeNull();
    });
});

// Tests pour la fonction calcPremiumPercent
describe("calcPremiumPercent", () => {
    it("should return the correct premium percent for valid inputs", () => {
        const result = calcPremiumPercent(50, 200);
        expect(result).toBe(25);
    });
    it("should return 0 when premium value is 0", () => {
        expect(calcPremiumPercent(0, 200)).toBe(0);
    });
    it("should return null for non-finite inputs", () => {
        expect(calcPremiumPercent(null, 200)).toBeNull();
        expect(calcPremiumPercent(50, undefined)).toBeNull();
        expect(calcPremiumPercent(NaN, 200)).toBeNull();
    });
    it("should return null when metal value is 0 to avoid division by zero", () => {
        expect(calcPremiumPercent(50, 0)).toBeNull();
    });
});
