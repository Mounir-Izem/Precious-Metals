const mockData = require('../mock/spotPrice.json');



const normalizeData = () => {
    const metalPrices = mockData.metals;
    const currencyRates = mockData.currencies;
    const date = new Date(mockData.timestamp.split('T')[0]);
    const data = [
        {metal: 'gold', fixing: 'AM', oz_price_usd: metalPrices.lbma_gold_am, eur_usd_rate: currencyRates.EUR,
            gbp_usd_rate: currencyRates.GBP, date: date
          },
        {metal: 'gold', fixing: 'PM', oz_price_usd: metalPrices.lbma_gold_pm, eur_usd_rate: currencyRates.EUR,
            gbp_usd_rate: currencyRates.GBP, date: date
        },
        // Only one fixing/day for silver
        {metal: 'silver', fixing: 'AM', oz_price_usd: metalPrices.lbma_silver, eur_usd_rate: currencyRates.EUR,
            gbp_usd_rate: currencyRates.GBP, date: date
        }
    ]

    return data
}

module.exports = {normalizeData};