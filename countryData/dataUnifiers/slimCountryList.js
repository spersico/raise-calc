import { writeFile } from 'fs/promises';
import countries from 'world-countries';
import logger from '../../utils/logger.js';
import { DATA_FOLDER } from '../constants.js';


const allCountries = countries
  .map(
    ({
      cca2,
      currencies,
      cioc,
      cca3,
      region,
      subregion,
      name: { common, native },
      languages,
      latlng,
    }) => ({
      codes: { cca2, cioc, cca3 },
      names: [
        common,
        ...Object.keys(native)
          .filter((key) => key !== 'eng' && native[key].common !== common)
          .map((key) => native[key].common),
      ],
      geo: { region, subregion, latlng },
      languages,
      currencies,
    })
  )
  .sort((a, b) => a.names[0] - b.names[0]);

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

export async function buildSlimList(allGatheredData) {
  logger.info(`> Build Slim Country List - started`, allGatheredData);
  const countries = slimCountryList(allGatheredData);

  await writeFile(
    `${DATA_FOLDER}/countryList.json`,
    JSON.stringify({
      meta: { updatedAt: new Date().toISOString() },
      countries,
    })
  );
  logger.info(`> Building Slim Country List (${countries.length}) - finished`);

  return countries;
};
