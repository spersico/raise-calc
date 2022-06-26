const fs = require('fs');
const { writeFile } = fs.promises;
const { log } = require('../utils.js');

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
        periods.reduce((acum, [period, value]) => {
          if (allData[code].periods[period]) {
            allData[code].periods[period].push(value);
          } else {
            allData[code].periods[period] = new Array(preference).fill(null);
            // we fill with nulls to ensure that we don't mistake
            // one provider's data with another's

            allData[code].periods[period][preference] = value;
            // we set values in the same order as the meta
          }
          acum[period] = [value];
          return acum;
        }, {});
      }
    });
  });

  for (const code in allData) {
    allData[code].periods = Object.entries(allData[code].periods).sort(
      ([periodA], [periodB]) => String(periodA).localeCompare(periodB)
    );
  }

  await writeFile(
    './countryData/data/allCountriesData.json',
    JSON.stringify({ data: allData, meta: allMeta })
  );

  log(`> Unify Providers ${sortedProviderFiles.length} Data - finished`);

  return allData;
}

module.exports = { buildAllDataList };
