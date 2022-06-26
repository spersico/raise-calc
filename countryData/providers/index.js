const { buildData } = require('./imf.js');
const { log } = require('../utils.js');

const fetchProviderData = async () => {
  log(`>> IMF - started`);
  await buildData();
  log(`>> IMF - finished`);
};

module.exports = { fetchProviderData };
