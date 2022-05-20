import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';

const filterOptions = createFilterOptions({
  stringify: (option) => option.names.join(' || '),
  limit: 10,
});

export default function CountrySelect({ countries, onChange }) {
  return (
    <Autocomplete
      id='country-select'
      sx={{ width: 200 }}
      options={countries}
      onChange={onChange}
      disableClearable
      autoHighlight
      filterOptions={filterOptions}
      getOptionLabel={(option) => option.names[0]}
      renderInput={(params) => (
        <TextField
          {...params}
          label='Choose a country'
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password', // this is to disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}
