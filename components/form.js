import {
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from '@mui/material';
import useInflationData from '../logic/useInflation';
import styles from '../styles/Form.module.css';
import CountrySelect from './CountrySelect';

export default function Form({ countries }) {
  const [setCountryCode, setDate, selectedCountry] =
    useInflationData(countries);
  console.log(`🐛 -> selectedCountry`, selectedCountry);

  return (
    <Grid
      container
      rowSpacing={8}
      columnSpacing={{ xs: 1, sm: 2, md: 1 }}
      className={styles.container}
    >
      <Grid item xs={4}>
        <FormControl sx={{ minWidth: 120 }} size='small'>
          <CountrySelect
            countries={countries}
            onChange={(_, country) => setCountryCode(country.code)}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl sx={{ minWidth: 120 }} size='small'>
          <InputLabel id='demo-select-small'>Calendar</InputLabel>
          <Select
            labelId='demo-select-small'
            id='demo-select-small'
            label='Calendar'
          >
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            <MenuItem>Argentina</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <Switch />
      </Grid>
      <Grid item xs={4}>
        <TextField
          id='outlined-basic'
          label='Monto Origen'
          variant='outlined'
        />
      </Grid>
      <Grid item xs={2}>
        <TextField id='outlined-basic' label='Monto Final' variant='outlined' />
      </Grid>
    </Grid>
  );
}
