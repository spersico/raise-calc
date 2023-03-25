const countries = require('./../../../countryData/data/allCountriesData.json');
const { data } = countries;

// TODO: move this to a shared logic utils file shared between this and frontend
const toMonth = (month = new Date().getMonth() + 1) =>
  String(month).padStart(2, '0');
const toYearMonth = (year, month) => `${year}-${toMonth(month)}`;
// TODO: up to here

const getCountryPeriodsByProvider = (requestedProvider, country) => {
  const { inflation, meta } = country;
  if (meta.length === 1) return { periods: inflation[meta[0].provider], providers: meta };
  if (!requestedProvider) return { periods: inflation['average'], providers: meta };

  const countryProvider = meta.find((p) => p.provider === requestedProvider);
  if (!countryProvider) {
    const countryProviders = meta.map(({ provider }) => provider);
    throw new Error('Country provider not found, avaliable providers: ' + countryProviders.join(', '));
  }

  return { periods: inflation[countryProvider.provider], providers: [countryProvider] };
};

const getCountrySlicedPeriods = ({ fromYear, fromMonth }, periods) => {
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
};

const calculateTotalInflationOfPeriods = (periods) => {
  return periods.reduce((acum, period) => acum + period.inflation, 0);
};

function percentageOfCurrentMonth() {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const dayOfMonth = today.getDate();
  return ((dayOfMonth / daysInMonth)).toFixed(2);
}

// The last value, almost always will be estimated, because data is always old.
// Instead of throwing away the estimation, because inflation is a daily phenomena
// We correct it, by the percentage of the month that the user is asking on.
// That way, if we are at 80% of the month, we reduce the cpi estimated change by 20%.
// And if the month just started, the estimation of the new month will pretty much be discarded
function correctLastEstimatedPeriod(previousToLastPeriod, lastPeriod) {
  const percentage = percentageOfCurrentMonth();
  lastPeriod.inflation = percentage * lastPeriod.inflation;
  lastPeriod.percentage = percentage;
  lastPeriod.cpi = previousToLastPeriod.cpi + (previousToLastPeriod.cpi * (lastPeriod.inflation / 100));
}

const getCpi = (code, provider, fromYear, fromMonth) => {
  const country = data[code];
  if (!country) throw new Error('Country CPI not found');

  const { periods, providers } = getCountryPeriodsByProvider(provider, country);
  const slicedPeriods = getCountrySlicedPeriods({ fromYear, fromMonth }, periods);
  correctLastEstimatedPeriod(periods[periods.length - 2], slicedPeriods[slicedPeriods.length - 1]);
  const totalInflation = calculateTotalInflationOfPeriods(slicedPeriods);

  return { providers, periods: slicedPeriods, totalInflation };
};
/**
 * Function used by the SSR to get the country data
 */
export function getCpiFromQuery(query) {
  try {
    const { code, provider, year, month } = query;
    const countryCode = String(code).toUpperCase();
    return getCpi(countryCode, provider, year, month);
  } catch (error) {
    console.error(`Error getting CPI from query: ${JSON.stringify(query)} - `, error);
    throw error;
  }
}

/**
 * Fetch country data CPI from the API
 * e.g: localhost:3000/api/country/ar?year=2021&month=12
 */
export default function handler(req, res) {
  try {
    const country = getCpiFromQuery(req.query);
    res.status(200).json(country);

  } catch (error) {
    return res.status(404).json({ error: 'Error getting CPI' + error.message, params: req.query });
  }
}
