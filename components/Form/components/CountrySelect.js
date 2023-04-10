import { useState, useEffect } from 'react';
import { AutoComplete } from 'primereact/autocomplete';

import styles from '../Form.module.css';

const ItemTemplate = ({ item }) => {
  const primaryName = item.names.length > 1 ? item.names[1] : item.names[0];
  const secondaryName = item.names.length > 1 ? item.names[0] : '';
  return (
    <div className={styles.item}>
      <div>
        {primaryName}
        <span className={styles.secondaryNames}>{secondaryName}</span>
      </div>
    </div>
  );
};

const buildCountryLookup = (countries = []) => {
  return countries.map((country) => ({
    ...country,
    search: country.names.join('||').toLowerCase(),
  }));
};

const compareByName = (country = {}, query = '') =>
  country.search.includes(query);

export default function CountrySelect({ value, countries, onChange }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countriesLookup] = useState(buildCountryLookup(countries));
  const [filteredCountries, setFilteredCountries] = useState([]);

  const searchCountry = (event) => {
    const query = event.query.trim().toLowerCase();

    const result = query
      ? countriesLookup.filter((country) => compareByName(country, query))
      : [...countriesLookup];
    setFilteredCountries(result);
  };

  useEffect(() => {
    if (!value) return;
    if (selectedCountry?.code === value) return;
    setSelectedCountry(value);
  }, [value]);

  useEffect(() => {
    onChange(selectedCountry?.code ? selectedCountry : null);
  }, [selectedCountry]);

  return (
    <div>
      <label htmlFor='countryPicker'>Country</label>
      <AutoComplete
        id='countryPicker'
        value={selectedCountry}
        field='code'
        suggestions={filteredCountries}
        completeMethod={searchCountry}
        dropdown
        dropdownAutoFocus
        onBlur={(event) => {
          const value = event.target.value;
          if (!value) {
            setSelectedCountry(null);
            return;
          }
          if (!selectedCountry?.code && typeof value === 'string') {
            const query = value.trim().toLowerCase();
            const maybeCountry = countriesLookup.find((country) =>
              compareByName(country, query)
            );
            setSelectedCountry(maybeCountry);
          }
        }}
        itemTemplate={(item) => <ItemTemplate item={item} />}
        selectedItemTemplate={(item) => item.names[0]}
        onChange={(e) => setSelectedCountry(e.value)}
        aria-label='Countries'
        tooltipOptions={{ position: 'bottom' }}
        tooltip="Select a Country, it should be the one of the currency you're earning"
      />
    </div>
  );
}
