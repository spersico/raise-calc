import { Button } from 'primereact/button';

import styles from './Form.module.css';
import useFormData from './useFormData.js';

import CountrySelect from './components/CountrySelect.js';
import DateSelect from './components/DateSelect.js';
import SalaryInput from './components/SalaryInput.js';

export default function Form({ countries }) {
  const {
    salary,
    setSalary,
    setCountry,
    setDate,
    firstDate,
    selectedCountry,
    selectedDate,
    showResults,
  } = useFormData(countries);

  return (
    <form className='p-fluid' >
      <div className={styles.formWrapper} data-cy="form-wrapper">
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
        <Button onClick={showResults} data-cy="form-button">Show me my buying power evolution</Button>
      </div>
    </form>
  );
}
