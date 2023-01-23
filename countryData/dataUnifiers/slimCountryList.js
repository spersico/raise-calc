const fs = require('fs');
const { writeFile } = fs.promises;

const { log, allCountries } = require('../utils.js');

const slimCountryList = (allData) =>
  allCountries
    .filter((country) => allData[country.codes.cca2])
    .map((country) => {
      const {
        codes: { cca2: code },
        names,
      } = country;

      return {
        code,
        names,
        first: allData[code].periods[0][0],
      };
    });

const buildSlimList = async (allGatheredData) => {
  log(`> Build Slim Country List - started`, allGatheredData);
  const countries = slimCountryList(allGatheredData);

  await writeFile(
    './countryData/data/countryList.json',
    JSON.stringify({
      meta: { updatedAt: new Date().toISOString() },
      countries,
    })
  );
  log(`> Building Slim Country List (${countries.length}) - finished`);

  return countries;
};
module.exports = { buildSlimList };
