import { fetchMetalsData } from './metalsDevService.js';

const TROY_OZ_IN_GRAMS = 31.1035;

export const getSpot = async () => {
    const raw = await fetchMetalsData();

    const goldOzUsd = raw.metals.gold;
    const silverOzUsd = raw.metals.silver;

    return {
        timestamp: new Date(raw.timestamps.metal * 1000).toISOString(),
        stale: false,
        rates: {
            EUR: raw.currencies.EUR,
            GBP: raw.currencies.GBP
        },
        gold: {
            oz_usd: goldOzUsd,
            g_fine_usd: goldOzUsd / TROY_OZ_IN_GRAMS,
            change: raw.change.gold,
            change_pct: raw.change_percentage.gold
        },
        silver: {
            oz_usd: silverOzUsd,
            g_fine_usd: silverOzUsd / TROY_OZ_IN_GRAMS,
            change: raw.change.silver,
            change_pct: raw.change_percentage.silver
        }
    };
};
