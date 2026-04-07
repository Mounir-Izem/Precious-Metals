import { getSpotData } from "./api.js";


export const getCachedSpotData = async () => {
    const cachedData = localStorage.getItem('cachedSpotData');
    const cacheTimestamp = localStorage.getItem('cacheTimestamp');
    const now = Date.now();
    try {
        if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp) < 5 * 60 * 1000)) {
            return JSON.parse(cachedData);
        }
    } catch {
        // cache corrompu → on continue vers le fetch
    }

    try {
        const freshData = await getSpotData();
        if (!freshData) throw new Error('Réponse vide du backend');
        localStorage.setItem('cachedSpotData', JSON.stringify(freshData));
        localStorage.setItem('cacheTimestamp', now.toString());
        return freshData;
    } catch (error) {
        if (cachedData) {
            try { return JSON.parse(cachedData); } catch { /* corrompu */ }
        }
        throw new Error('Backend indisponible et aucun cache valide');
    }

};