const prisma = require('../db.js');
const { normalizeData } = require('./lbmaService.js');

const getSpotPrices = async () => {
    const getData = await prisma.spotPrice.findMany()
    return getData
}

const saveSpotPrice = async () => {
    const data = normalizeData()
    await prisma.spotPrice.createMany({data: data})
}

module.exports = {getSpotPrices, saveSpotPrice};