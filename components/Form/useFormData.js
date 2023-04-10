import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function useFormData(countries) {
  const router = useRouter();
  const query = useSearchParams();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [firstDate, setSelectedCountryFirstDate] = useState([
    new Date().getFullYear(),
    '01',
  ]);
  const [selectedDate, setDate] = useState(null);
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // load the query params into the form
    const qCode = query.get('code');
    const country = countries.find((c) => c.code === qCode);
    if (!country) return;

    setCountry(country);

    const qYear = query.get('year');
    const qMonth = query.get('month');
    const qSalary = Number(query.get('salary'));

    !isNaN(qSalary) && setSalary(qSalary);

    qYear && qMonth && setDate(new Date(qYear, Number(qMonth) - 1, 1));
  }, []);

  const setCountry = (country) => {
    setSelectedCountry(country);
    setSelectedCountryFirstDate(
      country ? country.first.split('-') : [new Date().getFullYear(), '01']
    );
  };

  const showResults = async (e) => {
    e.preventDefault();
    if (!selectedCountry || !selectedDate || !salary) return;
    const [year, month] = [
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
    ];
    const code = selectedCountry?.code;
    setLoading(true);
    router.push(
      `/results?${new URLSearchParams({
        code,
        year,
        month,
        salary,
      }).toString()}`
    );
  };

  return {
    salary,
    setSalary,
    setCountry,
    setDate,
    selectedCountry,
    firstDate,
    selectedDate,
    loading,
    showResults,
  };
}
