/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { getAccumulatedAndMonthlyInflations } from './inflationHelpers';
import { dateToYearMonth } from './utils';

const formUrl = (code, date) => {
  const [year, month] = dateToYearMonth(date).split('-');
  return `${globalThis.location.protocol}//${globalThis.location.host}/api/country/${code}?year=${year}&month=${month}`;
};

export default function useInflationData(countries, router) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [{ data: selectedCountryData, loading }, getCountryData] =
    useGetCountryData(router);

  const setCountry = (code) => {
    setSelectedCountry(countries.find((c) => c.code === code));
    if (code && selectedDate) getCountryData(code, selectedDate);
  };

  const setDate = (value) => {
    const date = new Date(value);
    setSelectedDate(date);
    if (selectedCountry && date) getCountryData(selectedCountry.code, date);
  };

  useEffect(() => {
    if (!router.isReady) return;

    const paramCountry =
      router.query?.code &&
      countries.find((c) => c.code === router.query?.code);
    const paramDate =
      router.query?.date &&
      Number(router.query?.date) &&
      new Date(Number(router.query?.date));

    paramCountry && setSelectedCountry(paramCountry);
    paramDate && setSelectedDate(paramDate);
    if (paramCountry && paramDate) getCountryData(paramCountry.code, paramDate);
  }, [router.isReady]);

  return {
    setCountry,
    setDate,
    selectedCountry,
    selectedCountryData,
    selectedDate,
    loading,
  };
}

export const useGetCountryData = (router) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const makeRequest = async (code, date) => {
    if (loading) return;
    setLoading(true);

    try {
      const url = formUrl(code, date);
      const response = await (await fetch(url)).json();
      const accumulatedData = {
        ...response,
        ...getAccumulatedAndMonthlyInflations(
          response.periods,
          dateToYearMonth(date)
        ),
      };

      setData(accumulatedData);
      console.log(`🐛 | DATA`, accumulatedData);
    } catch (err) {
      setError(err);
    } finally {
      router.push({
        query: { date: Number(new Date(date)), code },
      });
      setLoading(false);
    }
  };
  return [{ data, error, loading }, makeRequest];
};
