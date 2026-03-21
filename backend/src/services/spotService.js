const { normalizeData } = require('./lbmaService.js');

const getSpotPrices = () => {
    return normalizeData()
}

module.exports = {getSpotPrices};