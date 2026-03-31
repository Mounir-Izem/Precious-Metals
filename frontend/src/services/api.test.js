import { describe, it, expect, vi } from "vitest";
import { getSpotData, getSpotVariation } from "./api";

// Tests pour getSpotData
describe("getSpotData", () => {
    it("should return data on success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ price: 100 }),
        });

        const data = await getSpotData();
        expect(data).toEqual({ price: 100 });

    });
    it('should retun server error', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
        });

        const data = await getSpotData();
        expect(data).toBeNull();
    });
    it('should return undefined on network error', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const data = await getSpotData();
        expect(data).toBeUndefined();
    });
});

// Tests pour getSpotVariation
describe("getSpotVariation", () => {
    it("should return data on success", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ variation: 5 }),
        });

        const data = await getSpotVariation();
        expect(data).toEqual({ variation: 5 });
    });
    it('should retun server error', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
        });

        const data = await getSpotVariation();
        expect(data).toBeNull();
    });
    it('should return undefined on network error', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const data = await getSpotVariation();
        expect(data).toBeUndefined();
    });

});