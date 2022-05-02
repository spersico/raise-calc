import { getCpiFromCountry } from './_services/_cpis';

// Fetch country data CPI from the API
// e.g: localhost:3000/api/country/ar?year=2021&month=12

export default function handler(req, res) {
  const { code, year, month } = req.query;
  const country = getCpiFromCountry(String(code).toUpperCase(), year, month);
  if (!country) return res.status(404).json({ error: 'Country not found' });
  res.status(200).json(country);
}
