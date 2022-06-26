const { request } = require('undici');
const { storeProviderData } = require('./../utils.js');

const fetchNewData = async () => {
  try {
    const respData = await request(
      'https://api.db.nomics.world/v22/series/IMF/CPI?dimensions=%7B%22INDICATOR%22%3A%5B%22PCPI_IX%22%5D%2C%22FREQ%22%3A%5B%22M%22%5D%7D&observations=1'
    );
    return await respData.body.json();
  } catch (error) {
    console.error('Fetch Error', new Date().toISOString(), error);
  }
};

const buildData = async () => {
  const rawData = await fetchNewData();
  const CPIs = rawData.series.docs.reduce(
    (
      acum,
      { dimensions: { REF_AREA }, series_code, period, value, indexed_at }
    ) => {
      const periods = period
        .map((monthYear, index) => [monthYear, value[index]])
        .filter(([_monthYear, value]) => value !== 'NA');

      if (periods.length) {
        acum[REF_AREA] = {
          code: REF_AREA,
          seriesCode: series_code,
          indexedAt: indexed_at,
          periods,
        };
      }
      return acum;
    },
    {}
  );

  await storeProviderData('IMF', null, CPIs, 999);

  return CPIs;
};

module.exports = { buildData };
