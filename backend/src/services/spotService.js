const prisma = require('../db.js');
const { normalizeData } = require('./lbmaService.js');

const getSpotPrices = async () => {
    const getData = await prisma.spotPrice.findMany()
    return getData
}

const saveSpotPrice = async () => {
    const data = normalizeData()
    await prisma.spotPrice.createMany({ data: data })
}

const getLatestForMetal = async (metal) => {
    try {
        return await prisma.spotPrice.findMany({
            where: { metal: metal, fixing: 'PM' },
            orderBy: { date: 'desc' },
            take: 2
        })
    } catch (error) {
        console.error('error with db')
    }

}

const getLatestSpotWithVariation = async () => {
    const goldResults = await getLatestForMetal('gold');
    const silverResults = await getLatestForMetal('silver');
    if (!goldResults || !silverResults ||
        goldResults.length < 2 || silverResults.length < 2) {
        return null
    }

    const gToday = parseFloat(goldResults[0].oz_price_usd);
    const gYesterday = parseFloat(goldResults[1].oz_price_usd);
    const sToday = parseFloat(silverResults[0].oz_price_usd);
    const sYesterday = parseFloat(silverResults[1].oz_price_usd);

    const spreadGoldValue = gToday - gYesterday;
    const spreadGoldPercent = (spreadGoldValue / gYesterday) * 100;
    const spreadSilverValue = sToday - sYesterday;
    const spreadSilverPercent = (spreadSilverValue / sYesterday) * 100;

    return {
        gold: {
            today: gToday,
            yesterday: gYesterday,
            variationValue: spreadGoldValue,
            variationPercent: spreadGoldPercent
        },
        silver: {
            today: sToday,
            yesterday: sYesterday,
            variationValue: spreadSilverValue,
            variationPercent: spreadSilverPercent
        }
    }

}

module.exports = { getSpotPrices, saveSpotPrice, getLatestSpotWithVariation };