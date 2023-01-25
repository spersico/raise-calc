/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

const toMonth = (month = new Date().getMonth() + 1) =>
  String(month).padStart(2, '0');

const toYearMonth = (year, month) => `${year}-${toMonth(month)}`;

const dateToYearMonth = (date) => {
  const value = new Date(date);
  return toYearMonth(value.getFullYear(), value.getMonth() + 1);
};

const formUrl = (code, date) => {
  const [year, month] = dateToYearMonth(date).split('-');
  return `/api/country/${code}?year=${year}&month=${month}`;
};

export default function useInflationData(countries, router) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [firstDate, setSelectedCountryFirstDate] = useState([new Date().getFullYear(), '01']);
  const [selectedDate, setSelectedDate] = useState(null);
  const [{ data: selectedCountryData, loading }, getCountryData] =
    useGetCountryData(router);

  const setCountry = (code) => {
    const country = countries.find((c) => c.code === code);
    setSelectedCountry(country);
    setSelectedCountryFirstDate(country ? country.first.split('-') : [new Date().getFullYear(), '01']);
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
    firstDate,
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

      setData(response);
      console.log(`🐛 | DATA`, response);
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
