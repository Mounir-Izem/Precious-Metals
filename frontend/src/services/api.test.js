import { describe, it, expect, vi } from "vitest";
import { getSpotData } from "./api";

describe("getSpotData", () => {
    it("should return data on success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ gold: { oz_usd: 3120.50 }, silver: { oz_usd: 34.20 } }),
        });

        const data = await getSpotData();
        expect(data).toEqual({ gold: { oz_usd: 3120.50 }, silver: { oz_usd: 34.20 } });
    });
    it('should return null on server error', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
        });

        const data = await getSpotData();
        expect(data).toBeNull();
    });
    it('should return null on network error', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const data = await getSpotData();
        expect(data).toBeNull();
    });
});
