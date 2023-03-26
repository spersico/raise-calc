const toMonth = (month = new Date().getMonth() + 1) =>
    String(month).padStart(2, '0');


const thisMonthOneBased = new Date().getMonth() + 1;
const thisYear = new Date().getFullYear();


const generateNextDate = (year, month) => {
    const toNextYear = month === 12;
    const nextMonth = toNextYear ? 1 : month + 1;
    const nextYear = year + (toNextYear ? 1 : 0);

    return [nextYear, nextMonth];
};

const isFuture = (year, month) => {
    if (year === thisYear && month > thisMonthOneBased) return true;
    if (year > thisYear) return true;
    return false;
};

const generateNextDateAndCheck = (year, month) => {
    const [nextYear, nextMonth] = generateNextDate(year, month);
    if (isFuture(nextYear, nextMonth)) return null;
    return [nextYear, nextMonth];
};

export function toYearMonth(year, month) {
    return `${year}-${toMonth(month)}`;
}

export function percentageOfCurrentMonth() {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const dayOfMonth = today.getDate();
    return ((dayOfMonth / daysInMonth)).toFixed(2);
}

export function getAllMonthsSince(year, month) {
    if (isFuture(Number(year), Number(month)))
        return [];
    let nextDate = [Number(year), !month ? 1 : Number(month)];
    const results = [toYearMonth(nextDate[0], nextDate[1])];
    while (true) {
        nextDate = generateNextDateAndCheck(nextDate[0], nextDate[1]);
        if (!nextDate?.length)
            break;
        results.push(toYearMonth(nextDate[0], nextDate[1]));
    }

    return results;
}