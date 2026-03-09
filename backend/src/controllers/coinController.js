const { parseCoinTitle } = require('../services/coinParserService');

const parseCoin = (req, res) => {
    const {title} = req.query;
    const result = parseCoinTitle(title);
    res.json(result);
}

module.exports = {
    parseCoin
}