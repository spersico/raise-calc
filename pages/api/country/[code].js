const countries = require('./../../../countryData/data/allCountriesData.json');
const { data } = countries;

const generateDate = (year, month) =>
  `${year}-${String(month).padStart(2, '0')}`;



export const getCpiFromCountry = (code, provider, fromYear, fromMonth = 1) => {
  const country = data[code];
  if (!country) throw new Error('Country CPI not found');
  const { inflation, meta } = country;
  const countryProvider = meta.find((p) => p.provider === provider);
  const providers = !provider ? meta : [countryProvider];
  const periods = inflation[countryProvider ? countryProvider.provider : 'average'];

  let fromIndex = 0;
  if (fromYear && fromMonth) {
    const from = generateDate(fromYear, fromMonth);
    fromIndex = periods.findIndex(({ date }) => date === from);
  }

  if (fromIndex === -1) {
    console.warn('No data found for ' + fromYear + '-' + fromMonth, periods);
    fromIndex = 0;
  }


  return { providers, periods: periods.slice(fromIndex) };
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
