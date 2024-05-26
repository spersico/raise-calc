import logger from '../../../utils/logger.js';
import { getPercentageOfCurrentMonth, toYearMonth } from '../../../utils/date.js';
import countries from './../../../countryData/data/allCountriesData.json';

/**
 * Get the country periods by provider. If no provider is requested, it will return the average
 * @param {*} requestedProvider
 * @param {*} country
 * @returns {Object} { periods: [], providers: [] }
 */
function getCountryPeriodsByProvider(requestedProvider, country) {
  const { inflation, meta } = country;
  if (meta.length === 1)
    return { periods: inflation[meta[0].provider], providers: meta };
  if (!requestedProvider)
    return { periods: inflation['average'], providers: meta };

  const countryProvider = meta.find((p) => p.provider === requestedProvider);
  if (!countryProvider) {
    const countryProviders = meta.map(({ provider }) => provider);
    throw new Error(
      'Country provider not found, avaliable providers: ' +
      countryProviders.join(', ')
    );
  }

  return {
    periods: inflation[countryProvider.provider],
    providers: [countryProvider],
  };
}

/**
 * Get the country periods sliced by the fromYear and fromMonth to the end (now).
 * If no fromYear and fromMonth is provided, it will return all the periods
 * @param {*} dateFilter  { fromYear, fromMonth }
 * @param {*} periods The previously filtered by provider periods
 * @returns
 */
function getCountrySlicedPeriods({ fromYear, fromMonth }, periods) {
  let fromIndex = 0;
  if (fromYear && fromMonth) {
    const from = toYearMonth(fromYear, fromMonth);
    fromIndex = periods.findIndex(({ date }) => date === from);
    if (fromIndex === -1) {
      console.error(`No data found  - Invalid Period`, { from, periods });
      throw new Error('No data found - Invalid Period');
    }
  }

  return periods.slice(fromIndex);
}

/**
 * Corrects the last period, by the percentage of the month that the user is asking on.
 * 
 * The data from the providers estimates the inflation of up to the current month 
 * (based on the averages of the previous months). 
 * Because that last month is not finished yet, we need to correct the last period.
 * That way, if we are at 80% of the month, we reduce the estimated change by 20%.
 * @param {*} previousToLastPeriod
 * @param {*} lastPeriod
 */
function correctLastPeriodInAccountForNotYetFinished(allPeriods, slicedPeriods) {
  const lastPeriod = allPeriods[allPeriods.length - 1];
  const previousToLastPeriod = allPeriods[allPeriods.length - 2];
  const percentageOfCurrentMonth = Number(getPercentageOfCurrentMonth());
  const inflation = percentageOfCurrentMonth * lastPeriod.inflation;
  const cpi =
    previousToLastPeriod.cpi + previousToLastPeriod.cpi * (inflation / 100);
  slicedPeriods[slicedPeriods.length - 1] = {
    ...lastPeriod,
    percentageOfCurrentMonth,
    inflation,
    cpi,
  };
}

/**
 * Calculate the total inflation of the periods
 * Uses the composite interest formula, to calculate the total inflation of the periods,
 * because the inflation is compounded.
 * And that method allows us to not need an extra CPI period  to calculate the inflation.
 * The formula is:
 * AccumulatedInflationAtMonthX = 
 *    ((1 + inflationAsPercentageInFirstMonth) *  ... * (1 + inflationAsPercentageAtMonthX)) - 1
 * @see https://ciecmza.files.wordpress.com/2020/09/como-se-calcula-la-inflacion.pdf
 */
const addEndOfPeriodAccumulatedInflation = (periods) => {
  periods[0].accumulatedInflation = 0;
  for (let i = 1; i < periods.length; i++) {
    periods[i].accumulatedInflation = ((periods[i].cpi - periods[0].cpi) / periods[0].cpi) * 100;
  }
};

/**
 * Adds relative salary, equivalent salary and relative buying power to the periods
 */
const calculateEnOfPeriodRelativeToInitialSalary = (periods, initialSalary) => {
  for (let i = 0; i < periods.length; i++) {
    periods[i].relativeSalary = Number(initialSalary) / (1 + periods[i].accumulatedInflation / 100);
    periods[i].equivalentSalary = Number(initialSalary) * (1 + periods[i].accumulatedInflation / 100);
    periods[i].relativeBuyingPower = Number(initialSalary) / periods[i].equivalentSalary * 100;
  }
};

/**  Main function to get the country inflation data */
function getCpi(code, provider, fromYear, fromMonth, initialSalary) {
  const country = countries.data[code];
  if (!country) throw new Error('Country CPI not found');

  const { periods, providers } = getCountryPeriodsByProvider(provider, country);
  const slicedPeriods = getCountrySlicedPeriods(
    { fromYear, fromMonth },
    periods
  );

  correctLastPeriodInAccountForNotYetFinished(periods, slicedPeriods);
  addEndOfPeriodAccumulatedInflation(slicedPeriods);
  calculateEnOfPeriodRelativeToInitialSalary(slicedPeriods, initialSalary);

  return { providers, periods: slicedPeriods };
}

/**
 * Function used by the SSR to get the country data
 */
export function getCpiFromQuery(query) {
  try {
    logger.info({ event: 'Get CPI', query });
    const { code, provider, year, month, salary } = query;
    const countryCode = String(code).toUpperCase();
    const result = getCpi(countryCode, provider, year, month, salary);
    logger.debug({ event: 'Get CPI - Success', query, result });
    return result;
  } catch (error) {
    console.error(error);
    logger.error({ event: 'Get CPI - Error', query, error });
    throw error;
  }
}

/**
 * Fetch country data CPI from the API
 * Exposed endpoint: /api/country/[code]
 * e.g: localhost:3000/api/country/ar?year=2021&month=12
 */
export default function handler(req, res) {
  try {
    const country = getCpiFromQuery(req.query);
    res.status(200).json(country);
  } catch (error) {
    logger.error({ event: 'Get CPI - Error', query, error });
    return res
      .status(404)
      .json({ error: 'Error getting CPI' + error.message, params: req.query });
  }
}
