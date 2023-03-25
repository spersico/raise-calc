import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function useFormData(countries) {
  const router = useRouter();
  const query = useSearchParams();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [firstDate, setSelectedCountryFirstDate] = useState([new Date().getFullYear(), '01']);
  const [selectedDate, setDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // load the query params into the form
    const code = query.get('code');
    if (!code) return;
    const year = query.get('year');
    const month = query.get('month');

    setCountry(code);
    year && month && setDate(new Date(year, Number(month) - 1, 1));
  }, []);

  const setCountry = (code) => {
    const country = countries.find((c) => c.code === code);
    console.log(`🐛 | setCountry:`, country);
    setSelectedCountry(country);
    setSelectedCountryFirstDate(country ? country.first.split('-') : [new Date().getFullYear(), '01']);
  };

  const showResults = async (e) => {
    e.preventDefault();
    const [year, month] = [selectedDate.getFullYear(), selectedDate.getMonth() + 1];
    const code = selectedCountry.code;
    setLoading(true);
    router.push(`/results?${new URLSearchParams({ code, year, month }).toString()}`);
  };

  return {
    setCountry,
    setDate,
    selectedCountry,
    firstDate,
    selectedDate,
    loading,
    showResults,
  };
}
