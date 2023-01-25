import { Calendar } from 'primereact/calendar';

import useInflationData from '../logic/useInflation';
import CountrySelect from './CountrySelect';
import styles from './Form.module.css';

export default function Form({ countries, router }) {
  const { setCountry, setDate, selectedCountry, selectedDate } =
    useInflationData(countries, router);

  const [year, month] = selectedCountry ? selectedCountry.first.split('-') : [new Date().getFullYear(), '01'];

  return (
    <form onSubmit={console.log} className='p-fluid'>
      <div className={styles.formWrapper}>
        <div className='card'>
          <label htmlFor='countryPicker'>Select a Country</label>
          <CountrySelect
            value={selectedCountry}
            countries={countries}
            onChange={(country) => setCountry(country?.code)}
          />
        </div>
        <div className='card'>
          <label htmlFor='monthPicker'>Select a Date</label>
          <Calendar
            inputId='monthPicker'
            value={selectedDate}
            disabled={!selectedCountry}
            onChange={(e) => setDate(e.value)}
            view='month'
            minDate={new Date(`${year}-${month}-15`)}
            maxDate={new Date()}
            dateFormat='mm/yy'
          />
        </div>
      </div >
    </form>
  );
}
