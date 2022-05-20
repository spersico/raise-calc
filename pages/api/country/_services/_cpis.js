const countries = require('./_countries.json');
const slimCountries = require('./_countries-slim.json');

export const getCpiFromCountry = (code, fromYear, fromMonth = 1) => {
  const country = countries.countries[code];
  if (!country) throw new Error('Country CPI not found');
  const { indexedAt, period, seriesCode } = country.cpi;

  if (fromYear && fromMonth) {
    const from = `${fromYear}-${String(fromMonth).padStart(2, '0')}`;
    console.log(`🐛 -> getCpiFromCountry -> from`, from)
    const startIndex = period.findIndex(([date]) => date === from);
    if (startIndex === -1) throw new Error('Invalid from date');
    
    return { indexedAt, seriesCode, period: period.slice(startIndex) };
  }
  return { indexedAt, seriesCode, period };
};

export const countryList = slimCountries;
