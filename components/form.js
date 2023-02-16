import useInflationData from '../hooks/useInflation';
import CountrySelect from './CountrySelect';
import styles from '../styles/Form.module.css';
import DateSelect from './DateSelect';

export default function Form({ countries, router }) {
  const { setCountry, setDate, firstDate, selectedCountry, selectedDate } =
    useInflationData(countries, router);


  return (
    <form onSubmit={console.log} className='p-fluid'>
      <div className={styles.formWrapper}>
        <div className='card'>
          <CountrySelect
            value={selectedCountry}
            countries={countries}
            onChange={(country) => setCountry(country?.code)}
          />
        </div>
        <div className='card'>
          <DateSelect
            selectedDate={selectedDate}
            setDate={setDate}
            firstDate={firstDate}
            disabled={!selectedCountry}
          />
        </div>
      </div >
    </form>
  );
}
