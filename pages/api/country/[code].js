const countries = require('./../../../countryData/data/allCountriesData.json');
const { data } = countries;

export const getCpiFromCountry = (code, provider, fromYear, fromMonth = 1) => {
  const country = data[code];
  if (!country) throw new Error('Country CPI not found');
  const { periods, meta } = country;

  const providerMeta = provider
    ? [meta.find((p) => p.provider === provider)]
    : meta;

  if (fromYear && fromMonth) {
    const from = `${fromYear}-${String(fromMonth).padStart(2, '0')}`;
    const startIndex = periods.findIndex(([date]) => date === from);
    if (startIndex === -1) throw new Error('Invalid from date');

    return { provider: providerMeta, periods: periods.slice(startIndex) };
  }
  return { provider: providerMeta, periods };
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
