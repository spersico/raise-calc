const toMonth = (month = new Date().getMonth() + 1) =>
  String(month).padStart(2, '0');

const thisMonth = toMonth();
const thisYear = new Date().getFullYear();

const thisYearAndMonth = thisYear + '-' + toMonth();

const monthsAsPaddedNumbers = [...Array(13).keys()].map(toMonth).slice(1);

function hasHoles(arr, start, end = thisYearAndMonth) {
  // TODO: implement
}

export {
  toMonth,
  thisMonth,
  thisYearAndMonth,
  monthsAsPaddedNumbers,
  hasHoles,
};
