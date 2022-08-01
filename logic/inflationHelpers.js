import { getAllMonthsSince } from './utils';

const calculateChangeRate = (current, previous) => {
  return ((current - previous) / previous) * 100;
};

const calculateAverage = (arrayOfNumbers) => {
  const cleanArray = arrayOfNumbers.filter(Number.isFinite);
  return (
    cleanArray.reduce((acum, cur) => acum + cur, 0) / cleanArray.length || 0
  );
};

export const estimateNextValue = (lastInflations, lastPeriod) => {
  const avg = calculateAverage(lastInflations);

  return (avg / 100) * lastPeriod + lastPeriod;
};

export function cleanSelectAndFillData(
  arrayOfData,
  initialDate,
  providerIndex
) {
  const withProvider = Number.isInteger(providerIndex);
  const [year, month] = initialDate.split('-');

  const fullDatesList = getAllMonthsSince(year, month);

  const cleanData = arrayOfData.reduce((acum, [date, data]) => {
    const cpi = withProvider ? data[providerIndex] : calculateAverage(data);
    acum[date] = { cpi, date };
    return acum;
  }, {});

  const filledData = fullDatesList.map((date) => [date, cleanData[date]?.cpi]);

  return filledData;
}

export const getAccumulatedAndMonthlyInflations = (rawPeriods, initialDate) => {
  console.log(`🐛 |  rawPeriods`, rawPeriods);
  if (!rawPeriods.length) return {};
  const periods = cleanSelectAndFillData(rawPeriods, initialDate);
  let monthByMonth = [];
  let estimated = 0;
  console.log(`🐛 |  periods`, periods);

  for (let index = 0; index < periods.length; index++) {
    const [yearMonth, cpi] = periods[index];
    let monthlyInflation = 0;

    if (index !== 0) {
      const lastCPI = periods[index - 1][1];
      if (!Number.isFinite(cpi)) {
        const previousInflations = monthByMonth
          .slice()
          .reverse()
          .slice(0, monthByMonth.length - 2)
          .filter(([, cpi]) => Number.isFinite(cpi))
          .map(([, inflation]) => inflation);

        const estimatedCPI = estimateNextValue(previousInflations, lastCPI);
        periods[index] = [yearMonth, estimatedCPI, { estimated: true }];
        estimated++;
        monthlyInflation = calculateChangeRate(estimatedCPI, lastCPI);
      } else {
        monthlyInflation = calculateChangeRate(cpi, lastCPI);
      }
    }
    monthByMonth.push([yearMonth, monthlyInflation]);
  }
  monthByMonth = monthByMonth.sort(([dateA], [dateB]) =>
    dateA.localeCompare(dateB)
  );
  console.log(`🐛 |  monthByMonth`, monthByMonth);

  const lastMonth = periods[periods.length - 1][1];
  const firstMonth = periods[0][1];
  const totalInflation = calculateChangeRate(lastMonth, firstMonth);

  console.log(`🐛 |  monthByMonth`, totalInflation);

  return {
    inflation: { monthByMonth, totalInflation, cleanPeriods: periods },
    calculationMetric: { estimated },
  };
};
