import {describe, it, expect } from "vitest";
import { isMarketOpen, getSpotTtlMs } from "./marketWindow.js";

describe('isMarketOpen', () => {
    it('should return true during market hours', () => {
        const now = new Date('2026-04-06T00:00:00Z'); // Monday at 00:00 UTC
        expect(isMarketOpen(now)).toBe(true);
    });
    it('should return true on Friday before 22:00 UTC', () => {
        const now = new Date('2026-04-10T21:59:00Z'); // Friday at 21:59 UTC
        expect(isMarketOpen(now)).toBe(true);
    });
    it('should return false on Friday after 22:00 UTC', () => {
        const now = new Date('2026-04-10T22:00:00Z'); // Friday at 22:00 UTC
        expect(isMarketOpen(now)).toBe(false);
    });
    it('should return false on Saturday', () => {
        const now = new Date('2026-04-11'); // Saturday UTC
        expect(isMarketOpen(now)).toBe(false);
    });
    it('should return false on Sunday', () => {
        const now = new Date('2026-04-12'); // Sunday UTC
        expect(isMarketOpen(now)).toBe(false);
    });
});

describe('getSpotTtlMs', () => {
    it('should return 5 minutes in milliseconds when market is open', () => {
        const now = new Date('2026-04-06T00:00:00Z'); // Monday at 00:00 UTC
        expect(getSpotTtlMs(now)).toBe(5 * 60 * 1000);
    });
    it ('should return 24 hours in milliseconds when market is closed', () => {
        const now = new Date('2026-04-11'); // Saturday UTC
        expect(getSpotTtlMs(now)).toBe(24 * 60 * 60 * 1000);
    });
    it('should return 24 hours in milliseconds on Friday after 22:00 UTC', () => {
        const now = new Date('2026-04-10T22:00:00Z'); // Friday at 22:00 UTC
        expect(getSpotTtlMs(now)).toBe(24 * 60 * 60 * 1000);
    });
    it ('should return 5 minutes in milliseconds on Friday before 22:00 UTC', () => {
        const now = new Date('2026-04-10T21:59:00Z'); // Friday at 21:59 UTC
        expect(getSpotTtlMs(now)).toBe(5 * 60 * 1000);
    });
    it ('should return 24 hours in milliseconds on Sunday', () => {
        const now = new Date('2026-04-12'); // Sunday UTC
        expect(getSpotTtlMs(now)).toBe(24 * 60 * 60 * 1000);
    });
});