import { InputNumber } from 'primereact/inputnumber';
import formStyles from './../Form.module.css';

export default function SalaryInput({ salary, setSalary, selectedCountry }) {
  return (
    <div>
      <label htmlFor='salaryInput' className={formStyles.label}>2 - What&apos;s your monthly income</label>
      <InputNumber
        inputId='salaryInput'
        value={salary}
        onValueChange={(e) => setSalary(e.value)}
        mode='currency'
        currency={selectedCountry?.currencyCode || 'USD'}
        disabled={!selectedCountry}
        data-cy="form-salary-input"
      />
    </div>
  );
}
