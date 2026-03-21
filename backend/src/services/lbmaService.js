const mockData = require('../mock/spotPrice.json');



const normalizeData = () => {
    const metalPrices = mockData.metals;
    const currencyRates = mockData.currencies;
    const date = mockData.timestamp.split('T')[0];
    const data = [
        {metal: 'gold', fixing: 'AM', oz_price_usd: metalPrices.lbma_gold_am, usd_to_eur: currencyRates.EUR,
            usd_to_gbp: currencyRates.GBP, date: date
          },
        {metal: 'gold', fixing: 'PM', oz_price_usd: metalPrices.lbma_gold_pm, usd_to_eur: currencyRates.EUR,
            usd_to_gbp: currencyRates.GBP, date: date
        },
        {metal: 'silver', fixing: 'AM', oz_price_usd: metalPrices.lbma_silver_am, usd_to_eur: currencyRates.EUR,
            usd_to_gbp: currencyRates.GBP, date: date
        },
        {metal: 'silver', fixing: 'PM', oz_price_usd: metalPrices.lbma_silver_pm, usd_to_eur: currencyRates.EUR,
            usd_to_gbp: currencyRates.GBP, date: date
        }
    ]

    return data
}

module.exports = {normalizeData};