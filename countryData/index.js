import logger from '../utils/logger.js';
import { PROVIDERS_DATA_FOLDER } from './constants.js';
import { buildAllDataList } from './dataUnifiers/allDataList.js';
import { buildSlimList } from './dataUnifiers/slimCountryList.js';

import { fetchAllProvidersData } from './providers/index.js';
import { readFilesInAFolder } from './utils/readFilesInAFolder.js';


async function gatherAllCountriesData() {
  logger.info(`UPDATE COUNTRY CPI DATA - started`);

  await fetchAllProvidersData();

  logger.info(`> Read Providers Data - started`);

  const sortedAndParsedProviderFiles = await readFilesInAFolder(PROVIDERS_DATA_FOLDER)
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
      logger.error(error);
    });

  logger.info(`> Read Providers Data - finished`);

  const allGatheredData = await buildAllDataList(sortedAndParsedProviderFiles);
  const countryList = await buildSlimList(allGatheredData);

  logger.info(`UPDATE COUNTRY CPI DATA - finished with ${countryList.length} records`);
};

gatherAllCountriesData();
