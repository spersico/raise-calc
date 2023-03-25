import useFormData from '../hooks/useFormData';
import CountrySelect from './CountrySelect';
import styles from '../styles/Form.module.css';
import DateSelect from './DateSelect';

export default function Form({ countries }) {
  const { setCountry, setDate, firstDate, selectedCountry, selectedDate, showResults } =
    useFormData(countries);

  return (
    <form className='p-fluid'>
      <pre>{JSON.stringify({ selectedCountry, selectedDate })}</pre>
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
        <button onClick={showResults}>Submit</button>
      </div >
    </form>
  );
}
