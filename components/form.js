import { Calendar } from 'primereact/calendar';

import useInflationData from '../logic/useInflation';
import CountrySelect from './CountrySelect';

export default function Form({ countries }) {
  const [setCountryCode, setDate, selectedCountry, date] =
    useInflationData(countries);
  console.log(`🐛 -> selectedCountry`, selectedCountry);

  return (
    <div className='flex justify-content-center'>
      <div className='card'>
        <h5 className='text-center'>Register</h5>
        <form onSubmit={console.log} className='p-fluid'>
          <CountrySelect
            countries={countries}
            onChange={(country) => setCountryCode(country.code)}
          />

          <div className='field col-12 md:col-4'>
            <label htmlFor='monthpicker'>Month Picker</label>
            <Calendar
              id='monthpicker'
              value={date}
              onChange={(e) => setDate(e.value)}
              view='month'
              dateFormat='mm/yy'
            />
          </div>
        </form>
      </div>
    </div>
  );
}
