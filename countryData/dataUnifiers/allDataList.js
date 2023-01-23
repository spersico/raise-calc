const fs = require('fs');
const { writeFile } = fs.promises;
const { log } = require('../utils.js');
const { dateFillingPipeline } = require('./dateFillingPipeline.js');
const { inflationCalcPipeline } = require('./inflationCalcPipeline.js');

async function buildAllDataList(sortedProviderFiles) {
  log(`> Unify Providers ${sortedProviderFiles.length} Data - finished`);

  let allData = {};
  let allMeta = {};

  sortedProviderFiles.forEach(({ data, meta }, preference) => {
    const provider = meta.provider;
    if (!allMeta[provider]) allMeta[provider] = meta;

    Object.values(data).forEach(({ code, periods, ...countryMeta }) => {
      if (!allData[code]) {
        allData[code] = {
          code,
          meta: [{ provider, ...countryMeta }],
          periods: periods.reduce((acum, [period, value]) => {
            acum[period] = [value];
            return acum;
          }, {}),
        };
      } else {
        // we add the provider to the local country metadata
        allData[code].meta.push({ provider, ...countryMeta });
        periods.forEach(([period, value]) => {
          if (allData[code].periods[period]) {
            allData[code].periods[period].push(value);
          } else {
            allData[code].periods[period] = new Array(preference).fill(null);
            // we fill with nulls to ensure that we don't mistake
            // one provider's data with another's

            allData[code].periods[period][preference] = value;
            // we set values in the same order as the meta
          }
        }, {});
      }
    });
  });

  allData = dateFillingPipeline(allData);
  allData = inflationCalcPipeline(allData);

  await writeFile(
    './countryData/data/allCountriesData.json',
    JSON.stringify({ data: allData, meta: allMeta }, null, 2)
  );

  log(`> Unify Providers ${sortedProviderFiles.length} Data - finished`);

  return allData;
}

module.exports = { buildAllDataList };
