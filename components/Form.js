import useFormData from '../hooks/useFormData.js';
import CountrySelect from './CountrySelect.js';
import styles from '../styles/Form.module.css';
import DateSelect from './DateSelect.js';
import SalaryInput from './SalaryInput.js';
import { Button } from 'primereact/button';

export default function Form({ countries, compact }) {
  const { salary, setSalary, setCountry, setDate, firstDate, selectedCountry, selectedDate, showResults } =
    useFormData(countries);

  return (
    <form className='p-fluid'>
      <div className={styles.formWrapper}>
        <div className='card'>
          <CountrySelect
            value={selectedCountry}
            countries={countries}
            onChange={setCountry}
          />
        </div>
        <div className='card'>
          <SalaryInput
            salary={salary}
            setSalary={setSalary}
            selectedCountry={selectedCountry}
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
        <Button onClick={showResults}>
          Show me my buying power evolution
        </Button>
      </div >
    </form>
  );
}
