const fs = require('fs');
const { writeFile } = fs.promises;

const { buildData: updateIMFData } = require('./providers/imf.js');
const { log, allCountries, readAllFilesInAFolder } = require('./utils.js');

const slimCountryList = (allData) =>
  allCountries.reduce((acum, country) => {
    const {
      codes: { cca2: code },
      names,
    } = country;

    acum[code] = {
      code,
      names,
      periods: allData
        .filter(({ data }) => data[code])
        .map(({ data, meta }) => ({
          [meta.provider]: {
            periods: data[code].periods,
            dataRange: data[code].dataRange,
          },
        })),
    };

    return acum;
  }, {});

const fullcountryList = (allData) =>
  allCountries
    .map((country) => {
      const {
        codes: { cca2: code },
        names,
      } = country;
      const periods = allData
        .filter(({ data }) => data[code])
        .map(({ data, meta }) => ({ [meta.provider]: data[code].dataRange }));
      return { code };
    })
    .sort((a, b) => a.names[0].localeCompare(b.names[0]));

const gatherAllCountriesData = async () => {
  log(`buildData - started`);

  log(`IMF - started`);
  await updateIMFData();
  log(`IMF - finished`);

  let allGatheredData;
  await readAllFilesInAFolder(`${process.cwd()}/countryData/data/providers`)
    .then((files) => {
      allGatheredData = files.map(({ contents }) => JSON.parse(contents));
    })
    .catch((error) => {
      console.log(error);
    });
  // TODO THIS should group by country, not by provider
  // TODO
  await writeFile(
    './countryData/data/allCountriesData.json',
    JSON.stringify({ data: allGatheredData })
  );
  console.log(allGatheredData);
  const listOfCountries = slimCountryList(allGatheredData);
  await writeFile(
    './countryData/data/countryList.json',
    JSON.stringify({
      meta: { updatedAt: new Date().toISOString() },
      countries: listOfCountries,
    })
  );

  log(`buildData - finished`, `with ${listOfCountries.length} records`);
};

gatherAllCountriesData();
