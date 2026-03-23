const {getSpotPrices, getLatestSpotWithVariation} = require('../services/spotService.js');

const getSpot = async (_req, res) => {
    try {
        const result = await getSpotPrices();
        res.json(result);
    } catch (error) {
        res.status(500).json({'status': 'error acces spot'});
    }
}

const getLatestSpot = async (_req, res) => {
    try {
        const lastSpotVar = await getLatestSpotWithVariation();
        
        if (!lastSpotVar){
        return res.status(404).json({'status': 'Not enough data'})
        }
        
        res.json(lastSpotVar);
    
    } catch (error) {
        res.status(500).json({'status': 'Unavaliable variation'})
    }
}

module.exports = {getSpot, getLatestSpot};