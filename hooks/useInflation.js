/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';

const toMonth = (month = new Date().getMonth() + 1) =>
  String(month).padStart(2, '0');

const toYearMonth = (year, month) => `${year}-${toMonth(month)}`;

const dateToYearMonth = (date) => {
  const value = new Date(date);
  return toYearMonth(value.getFullYear(), value.getMonth() + 1);
};

export default function useInflationData(countries, router) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [firstDate, setSelectedCountryFirstDate] = useState([new Date().getFullYear(), '01']);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const showResults = async (e) => {
    e.preventDefault();
    const [year, month] = dateToYearMonth(selectedDate).split('-');
    const params = new URLSearchParams({ code: selectedCountry.code, year, month });
    setLoading(true);
    router.push(`/results?${params.toString()}`);
  };

  const setCountry = (code) => {
    const country = countries.find((c) => c.code === code);
    setSelectedCountry(country);
    setSelectedCountryFirstDate(country ? country.first.split('-') : [new Date().getFullYear(), '01']);
  };

  const setDate = (value) => {
    const date = new Date(value);
    setSelectedDate(date);
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
  }, [router.isReady]);

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
