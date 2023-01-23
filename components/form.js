import { Calendar } from 'primereact/calendar';

import useInflationData from '../logic/useInflation';
import CountrySelect from './CountrySelect';

export default function Form({ countries, router }) {
  const { setCountry, setDate, selectedCountry, selectedDate } =
    useInflationData(countries, router);

  const [year, month] = selectedCountry ? selectedCountry.first.split('-') : [new Date().getFullYear(), '01'];

  return (
    <div className='flex justify-content-center'>
      <div className='card'>
        <h5 className='text-center'>Select A Country</h5>
        <form onSubmit={console.log} className='p-fluid'>
          <CountrySelect
            value={selectedCountry}
            countries={countries}
            onChange={(country) => setCountry(country.code)}
          />

          <div className='field col-12'>
            <label htmlFor='monthpicker'>Month Picker</label>
            <Calendar
              id='monthpicker'
              value={selectedDate}
              disabled={!selectedCountry}
              onChange={(e) => setDate(e.value)}
              view='month'
              minDate={new Date(`${year}-${month}-15`)}
              maxDate={new Date()}
              dateFormat='mm/yy'
            />
          </div>
        </form>
      </div>
    </div>
  );
}
