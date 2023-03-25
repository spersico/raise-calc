import { Calendar } from 'primereact/calendar';


export default function DateSelect({ firstDate, setDate, selectedDate, disabled = true }) {
    return (
        <>
            <label htmlFor='monthPicker'>Select a Date</label>
            <Calendar
                inputId='monthPicker'
                value={selectedDate}
                disabled={disabled}
                onChange={(e) => setDate(e.value)}
                view='month'
                minDate={new Date(`${firstDate[0]}-${firstDate[1]}-15`)}
                maxDate={new Date()}
                dateFormat='mm/yy'
            />
        </>);
}
