const { getLatestSpotWithVariation, getSpotToday } = require('../services/spotService.js');


const getLatestSpot = async (_req, res) => {
    try {
        const lastSpotVar = await getLatestSpotWithVariation();

        if (!lastSpotVar) {
            return res.status(404).json({ 'status': 'Not enough data' })
        }

        res.json(lastSpotVar);

    } catch (error) {
        res.status(500).json({ 'status': 'Unavaliable variation' })
    }
}

const getTodaySpot = async (_req, res) => {
    try {
        const todaySpot = await getSpotToday();

        if (!todaySpot) {
            return res.status(404).json({'status': 'Not enough data'})
        }

        res.json(todaySpot)

    } catch (error) {
        res.status(500).json({ 'status': 'Unavaliable latest date' })
    }
}

module.exports = { getLatestSpot, getTodaySpot };