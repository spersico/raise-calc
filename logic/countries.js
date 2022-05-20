import data from '../pages/api/country/_services/_countries-slim.json';

export default function getCountries() {
  return { data, error: null };
}
