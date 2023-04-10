import { Calendar } from 'primereact/calendar';

export default function DateSelect({
  firstDate,
  setDate,
  selectedDate,
  disabled = true,
}) {
  return (
    <div>
      <label htmlFor='monthPicker'>Starting Date</label>
      <Calendar
        inputId='monthPicker'
        value={selectedDate}
        disabled={disabled}
        onChange={(e) => setDate(e.value)}
        view='month'
        minDate={new Date(`${firstDate[0]}-${firstDate[1]}-15`)}
        maxDate={new Date()}
        dateFormat='mm/yy'
        tooltipOptions={{ position: 'mouse' }}
        tooltip='Since when do you have that income?'
      />
    </div>
  );
}
