import { InputNumber } from 'primereact/inputnumber';

export default function SalaryInput({ salary, setSalary, selectedCountry }) {
  return (
    <div>
      <label htmlFor='salaryInput'>Monthly Income</label>
      <InputNumber
        inputId='salaryInput'
        value={salary}
        onValueChange={(e) => setSalary(e.value)}
        mode='currency'
        currency={selectedCountry?.currencyCode || 'USD'}
        disabled={!selectedCountry}
        tooltipOptions={{ position: 'bottom', appendTo: 'self' }}
        tooltip="What's your monthly income, in the selected country currency?"
      />
    </div>
  );
}
