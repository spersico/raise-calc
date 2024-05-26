import { Calendar } from 'primereact/calendar';
import formStyles from './../Form.module.css';

export default function DateSelect({
  firstDate,
  setDate,
  selectedDate,
  disabled = true,
}) {
  return (
    <div>
      <label htmlFor='monthPicker' className={formStyles.label}>3 - Since when are you earning that?</label>
      <Calendar
        inputId='monthPicker'
        value={selectedDate}
        disabled={disabled}
        onChange={(e) => setDate(e.value)}
        view='month'
        minDate={new Date(`${firstDate[0]}-${firstDate[1]}-15`)}
        maxDate={new Date()}
        dateFormat='mm/yy'
        appendTo='self'
        data-cy="form-date-picker"
      />
    </div>
  );
}
