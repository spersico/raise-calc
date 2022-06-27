/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { getAccumulatedInflation } from './inflationHelpers';
import { thisYearAndMonth } from './utils';

export default function useInflationData(countries) {
  const [code, setCountryCode] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [date, setDate] = useState(thisYearAndMonth);
  const [{ data, loading }, getCountryData] = useGetCountryData(code, date);

  useEffect(() => {
    if (code) {
      setSelectedCountry(countries.find((c) => c.code === code));
      getCountryData();
    }
  }, [code]);

  useEffect(() => {
    if (data) setSelectedCountry({ ...selectedCountry, ...data });
  }, [data]);

  return [setCountryCode, setDate, selectedCountry, date, loading];
}

export const useGetCountryData = (id, date) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const makeRequest = async () => {
    let url;
    if (id && globalThis.location) {
      url = `${globalThis.location.protocol}//${globalThis.location.host}/api/country/${id}`;
      const [year, month] = date.split('-');
      if (year && month) {
        url += `?year=${year}&month=${month}`;
      }

      try {
        setLoading(true);
        const response = await (await fetch(url)).json();
        response.inflation = getAccumulatedInflation(response);

        setData(response);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
  };
  return [{ data, error, loading }, makeRequest];
};
