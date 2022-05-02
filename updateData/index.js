const fs = require('fs');
const { request } = require('undici');
const { countries, slimCountries } = require('./countries.js');

const getNewJSON = async () => {
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
  const meta = { updatedAt: new Date().toISOString() };
  console.log(`buildData - started at ${meta.updatedAt}`);
  console.time(`buildData`);

  const data = await getNewJSON();
  const cpis = data.series.docs.map(
    ({ dimensions: { REF_AREA }, series_code, period, value, indexed_at }) => ({
      country: {
        code: REF_AREA,
        name: data.dataset.dimensions_values_labels.REF_AREA[REF_AREA],
      },
      seriesCode: series_code,
      indexedAt: indexed_at,
      period: period
        .map((monthYear, index) => [monthYear, value[index]])
        .filter(([_monthYear, value]) => value !== 'NA'),
    })
  );

  const fullCountryList = countries(cpis);

  fs.writeFileSync(
    './pages/api/country/_services/_countries.json',
    JSON.stringify({ meta, countries: fullCountryList })
  );

  fs.writeFileSync(
    './pages/api/country/_services/_countries-slim.json',
    JSON.stringify({
      meta,
      countries: slimCountries(fullCountryList),
    })
  );

  console.log(
    `buildData - finished at ${new Date().toISOString()}, with ${
      cpis.length
    } records`
  );
  console.timeEnd(`buildData`);
};

buildData();
