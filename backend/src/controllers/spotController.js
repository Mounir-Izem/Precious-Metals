import { getSpot } from '../services/spotService.js';

export const getLatestSpot = async (_req, res) => {
    try {
        const spot = await getSpot();
        res.json(spot);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'Service unavailable' });
    }
};
