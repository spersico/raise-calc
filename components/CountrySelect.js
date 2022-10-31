import * as React from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { useState } from 'react';
import { useEffect } from 'react';

const itemTemplate = (item, coso) => {
  return (
    <div className='country-item'>
      <div>{item.names[0]}</div>
    </div>
  );
};

export default function CountrySelect({ value, countries, onChange }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);

  const searchCountry = (event) => {
    setTimeout(() => {
      let _filteredCountries;
      if (!event.query.trim().length) {
        _filteredCountries = [...countries];
      } else {
        _filteredCountries = countries.filter((country) => {
          return country.names
            .join('||')
            .toLowerCase()
            .includes(event.query.toLowerCase());
        });
      }

      setFilteredCountries(_filteredCountries);
    }, 150);
  };

  useEffect(() => {
    if (!value) return;
    if (selectedCountry?.code === value?.code) return;

    setSelectedCountry(value.names[0]);
  }, [value]);

  return (
    <AutoComplete
      value={selectedCountry}
      suggestions={filteredCountries}
      completeMethod={searchCountry}
      dropdown
      dropdownAutoFocus
      itemTemplate={itemTemplate}
      onSelect={(e) => {
        console.log(`🐛 | CountrySelect | e`, e);
        e.value?.code && setSelectedCountry(e.value.names[0]);
        e.value?.code && onChange(e.value);
      }}
      aria-label='Countries'
    />
  );
}
