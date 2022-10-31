export const toMonth = (month = new Date().getMonth() + 1) =>
  String(month).padStart(2, '0');
export const toYearMonth = (year, month) => `${year}-${toMonth(month)}`;

export const dateToYearMonth = (date) => {
  const value = new Date(date);
  return toYearMonth(value.getFullYear(), value.getMonth() + 1);
};

export const thisMonthOneBased = new Date().getMonth() + 1;
export const thisYear = new Date().getFullYear();
export const thisMonth = toMonth(thisMonthOneBased);
export const thisYearAndMonth = thisYear + '-' + thisMonth;

export const generateNextDate = (year, month) => {
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

export const generatePreviousDate = (year, month) => {
  const toPreviousYear = month === 1 || month === 0;
  const resultMonth = toPreviousYear ? 12 : month - 1;
  const resultYear = year - (toPreviousYear ? 1 : 0);

  return [resultYear, resultMonth];
};

const generateNextDateAndCheck = (year, month) => {
  const [nextYear, nextMonth] = generateNextDate(year, month);

  if (isFuture(nextYear, nextMonth)) return null;
  return [nextYear, nextMonth];
};

export const getAllMonthsSince = (year, month) => {
  if (isFuture(Number(year), Number(month))) return [];
  let nextDate = [Number(year), !month ? 1 : Number(month)];
  const results = [toYearMonth(nextDate[0], nextDate[1])];
  while (true) {
    nextDate = generateNextDateAndCheck(nextDate[0], nextDate[1]);
    if (!nextDate?.length) break;
    results.push(toYearMonth(nextDate[0], nextDate[1]));
  }

  return results;
};
