import { getSpotTtlMs } from "./marketWindow.js";
import { getSpot } from "./spotService.js";

const spotCache = {
    data: null,
    fetchedAt: null,
    promise: null
};

export async function getCachedSpot(now = new Date()) {
    const ttl = getSpotTtlMs(now);
    const isFresh = spotCache.data && (Date.now() - spotCache.fetchedAt) < ttl;

    if (isFresh) {
        return spotCache.data;
    }

    if (spotCache.promise) {
        return spotCache.promise;
    }

    spotCache.promise = getSpot();

    try {
        const data = await spotCache.promise;
        spotCache.data = data;
        spotCache.fetchedAt = Date.now();
        return spotCache.data;
    } catch (error) {
        if (spotCache.data) {
            return { ...spotCache.data, stale: true };
        }
        throw error;
    } finally {
        spotCache.promise = null;
    }
}

export function resetCache() {
    spotCache.data = null;
    spotCache.fetchedAt = null;
    spotCache.promise = null;
}
