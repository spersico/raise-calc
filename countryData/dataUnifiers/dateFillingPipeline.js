import { getAllMonthsSince } from "../../utils/date.js";

export function dateFillingPipeline(data) {
  const result = {};
  for (const code in data) {
    const { periods, meta } = data[code];
    const orderedCountryPeriods = Object.entries(periods).sort(
      ([periodA], [periodB]) => String(periodA).localeCompare(periodB)
    );
    const [year, month] = orderedCountryPeriods[0][0].split("-");

    const providersAmount = meta.length;
    const emptyPeriodFiller = new Array(providersAmount).fill(null);
    const filledPeriods = getAllMonthsSince(year, month).map((date) => [
      date,
      periods[date] || emptyPeriodFiller,
    ]);

    result[code] = { ...data[code], periods: filledPeriods };
  }
  return result;
}
