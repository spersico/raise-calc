const { buildAllDataList } = require('./dataUnifiers/allDataList.js');
const { buildSlimList } = require('./dataUnifiers/slimCountryList.js');

const { fetchProviderData } = require('./providers/index.js');
const { log, readFiles } = require('./utils.js');

const gatherAllCountriesData = async () => {
  log(`UPDATE COUNTRY CPI DATA - started`);

  await fetchProviderData();

  log(`> Read Providers Data - started`);

  const sortedAndParsedProviderFiles = await readFiles(
    `${process.cwd()}/countryData/data/providers`
  )
    .then(
      (files) =>
        files
          .map(({ contents }) => JSON.parse(contents))
          .sort(
            (providerA, providerB) =>
              (providerA.meta.preference || 999) -
              (providerB.meta.preference || 999)
          )
      // descending order of priority (lower number = higher priority)
    )
    .catch((error) => {
      console.log(error);
    });

  log(`> Read Providers Data - finished`);

  const allGatheredData = await buildAllDataList(sortedAndParsedProviderFiles);
  const countryList = await buildSlimList(allGatheredData);

  log(`UPDATE COUNTRY CPI DATA - finished`, `with ${countryList.length} records`);
};

gatherAllCountriesData();
