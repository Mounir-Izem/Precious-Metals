import { describe, it, expect, vi } from "vitest";
import { getCachedSpot, resetCache } from "./spotCacheService.js";
import { getSpot } from "./spotService.js";


vi.mock('./spotService.js', () => ({
    getSpot: vi.fn()
}));


describe('getCachedSpot', () => {
    beforeEach(() => {
        resetCache();
        vi.clearAllMocks();
    });
    it ('should return the first fetched spot data', async () => {
        getSpot.mockResolvedValueOnce({ gold: { oz_usd: 3120 }, silver: { oz_usd: 34 } });
        await getCachedSpot()
        await getCachedSpot()
        expect(getSpot).toHaveBeenCalledTimes(1);
    });
    it('should return stale data...', async () => {
    vi.useFakeTimers();
    getSpot.mockResolvedValueOnce({ gold: { oz_usd: 3120 }, silver: { oz_usd: 34 } });
    const firstData = await getCachedSpot();

    vi.advanceTimersByTime(10 * 60 * 1000); // avance de 10 min → cache expiré

    getSpot.mockRejectedValueOnce(new Error('API error'));
    const secondData = await getCachedSpot();
    expect(secondData).toEqual({ ...firstData, stale: true });
    vi.useRealTimers();
    });

});    