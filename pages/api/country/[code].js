const countries = require('./../../../countryData/data/allCountriesData.json');
const { data } = countries;

const generateDate = (year, month) =>
  `${year}-${String(month).padStart(2, '0')}`;

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
    const from = generateDate(fromYear, fromMonth);
    fromIndex = periods.findIndex(({ date }) => date === from);
    if (fromIndex === -1) {
      console.error(`No data found  - Invalid Period`, { from, periods });
      throw new Error('No data found - Invalid Period');
    }
  }

  return periods.slice(fromIndex);
};

export const getCpiFromCountry = (code, provider, fromYear, fromMonth = 1) => {
  const country = data[code];
  if (!country) throw new Error('Country CPI not found');

  const { periods, providers } = getCountryPeriodsByProvider(provider, country);
  const slicedPeriods = getCountrySlicedPeriods({ fromYear, fromMonth }, periods);

  return { providers, periods: slicedPeriods };
};

/**
 * Fetch country data CPI from the API
 * e.g: localhost:3000/api/country/ar?year=2021&month=12
 */
export default function handler(req, res) {
  const { code, provider, year, month } = req.query;
  const country = getCpiFromCountry(
    String(code).toUpperCase(),
    provider,
    year,
    month
  );
  if (!country) return res.status(404).json({ error: 'Country not found' });
  res.status(200).json(country);
}
