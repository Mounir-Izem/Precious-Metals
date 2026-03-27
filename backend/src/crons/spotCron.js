const cron = require('node-cron');
const {saveSpotPrice} = require('../services/spotService.js');

cron.schedule('35 10 * * *', async () => {
    try {
        await saveSpotPrice('AM')
    } catch (error) {
        console.error(error)
    }
}, {
    timezone: 'Europe/London'
})

cron.schedule('05 15 * * *', async () => {
    try {
        await saveSpotPrice('PM')
    } catch (error) {
        console.error(error)
    }
}, {
    timezone: 'Europe/London'
})

cron.schedule('05 12 * * *', async () => {
    try {
        await saveSpotPrice('NOON')
    } catch (error) {
        console.error(error)
    }
}, {
    timezone: 'Europe/London'
})