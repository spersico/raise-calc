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