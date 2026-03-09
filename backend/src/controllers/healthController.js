const { getHealthStatus } = require('../services/healthService');

const getHealth = (req, res) => {
  const health = getHealthStatus();
  res.json(health);
};

module.exports = {
  getHealth
};