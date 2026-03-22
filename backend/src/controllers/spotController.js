const {getSpotPrices} = require('../services/spotService.js');

const getSpot = async (_req, res) => {
    try {
        const result = await getSpotPrices();
        res.json(result);
    } catch (error) {
        res.status(500).json({'status': 'error acces spot'});
    }
}

module.exports = {getSpot};