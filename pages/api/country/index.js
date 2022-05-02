import { countryList } from './_services/_cpis';

// Fetch country list, this should be consumed on build (SSG)
// e.g: localhost:3000/api/country/ar?year=2021&month=12

export default function handler(req, res) {
  res.status(200).json(countryList);
}
