import { writeFile } from 'fs/promises';
import logger from '../../utils/logger.js';
import { DATA_FOLDER } from '../constants.js';
import { dateFillingPipeline } from './dateFillingPipeline.js';
import { inflationCalcPipeline } from './inflationCalcPipeline.js';


export async function buildAllDataList(sortedProviderFiles) {
  logger.info(`> Unify Providers ${sortedProviderFiles.length} Data - finished`);

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
  await writeFile(
    `${DATA_FOLDER}/allCountriesBaseData.json`,
    JSON.stringify({ data: allData, meta: allMeta }, null, 1)
  );

  const inflationData = inflationCalcPipeline(allData);
  await writeFile(
    `${DATA_FOLDER}/allCountriesData.json`,
    JSON.stringify({ data: inflationData, meta: allMeta }, null, 1)
  );

  logger.info(`> Unify Providers ${sortedProviderFiles.length} Data - finished`);

  return allData;
}

