const prisma = require('../db.js');
const { normalizeData } = require('./lbmaService.js');

const saveSpotPrice = async (fixing) => {
    try {
        const data = normalizeData(fixing)
        if (!data) {
            return null
        }
        await prisma.spotPrice.createMany({
            data: data,
            skipDuplicates: true
        })
    } catch (error) {
        console.error(error)
    }

}

const getLatestForMetal = async (metal, fixing) => {
    try {
        return await prisma.spotPrice.findMany({
            where: { metal: metal, fixing: fixing },
            orderBy: { date: 'desc' },
            take: 2
        })
    } catch (error) {
        console.error(error)
    }

}

const getSpotToday = async () => {
    try {
        const latestDate = await prisma.spotPrice.findFirst({ orderBy: { date: 'desc' } })
        if (!latestDate) {
            return null
        }
        const result = await prisma.spotPrice.findMany({ where: { date: latestDate.date } })
        if (result.length === 0) {
            return null
        }
        return result

    } catch (error) {
        console.error(error)
    }
}

const getLatestSpotWithVariation = async () => {
    try {
        const goldResults = await getLatestForMetal('gold', 'PM');
        const silverResults = await getLatestForMetal('silver', 'NOON');
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

    } catch (error) {
        console.error(error)
    }

}

module.exports = { saveSpotPrice, getLatestSpotWithVariation, getSpotToday };