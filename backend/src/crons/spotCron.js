const cron = require('node-cron');
const {saveSpotPrice} = require('../services/spotService.js');

cron.schedule('30 10 * * *', async () => {
    try {
        await saveSpotPrice('AM')
    } catch (error) {
        console.error(error)
    }
}, {
    timezone: 'Europe/London'
})

cron.schedule('00 15 * * *', async () => {
    try {
        await saveSpotPrice('PM')
    } catch (error) {
        console.error(error)
    }
}, {
    timezone: 'Europe/London'
})