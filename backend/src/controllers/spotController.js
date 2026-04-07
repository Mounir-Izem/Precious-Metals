import { getCachedSpot } from '../services/spotCacheService.js';

export const getLatestSpot = async (_req, res) => {
    try {
        const spot = await getCachedSpot();
        
        if (spot.stale === true) {
            res.status(200).json({ status: 'Stale data', ...spot });
             console.warn(`Returned stale: ${spot.stale} data and timestamp: ${spot.timestamp} due to API error`);
             return;
        }
        res.json(spot);

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'Service unavailable' });
    }
};
