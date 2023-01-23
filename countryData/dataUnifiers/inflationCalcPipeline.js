const calculateChangeRate = (current, previous) => {
  return ((current - previous) / previous) * 100;
};

const calculateAverage = (arrayOfNumbers) => {
  const cleanArray = arrayOfNumbers.filter(Number.isFinite);
  return (
    cleanArray.reduce((acum, cur) => acum + cur, 0) / cleanArray.length || null
  );
};

/** Gets the last 2 months of CPIs, be them estimated or actual CPIs*/
const getLastMonthsOfData = (monthlyData) => {
  return monthlyData
    .slice()
    .reverse()
    .filter(({ cpi }) => Number.isFinite(cpi))
    .slice(0, monthlyData.length - 2)
    .map(({ inflation }) => inflation);
};


const estimateMissingCPI = (monthlyData, lastPeriodsCPI) => {
  const previousInflations = getLastMonthsOfData(monthlyData);
  const avg = calculateAverage(previousInflations);
  return (avg / 100) * lastPeriodsCPI + lastPeriodsCPI;
};


const calculateInflationPerProvider = (periods) => {
  if (!periods.length) return {};
  let monthlyData = [];

  for (let index = 0; index < periods.length; index++) {
    const [date, cpi] = periods[index];
    let monthlyInflation = 0;
    let estimation = {};
    if (index !== 0) {
      const { cpi: lastCPI } = monthlyData[index - 1];

      if (!Number.isFinite(cpi)) {
        estimation = { cpi: estimateMissingCPI(monthlyData, lastCPI), estimated: true };
        monthlyInflation = calculateChangeRate(estimation.cpi, lastCPI);
      } else {
        // otherwise we can use the cpi we already have
        monthlyInflation = calculateChangeRate(cpi, lastCPI);
      }
    }
    monthlyData.push({ date, inflation: monthlyInflation, cpi, ...estimation });
  }

  return monthlyData;
};

function getAverageOrSelectedCPIPeriods(
  periods,
  providerIndex
) {
  const withProvider = providerIndex !== -1;
  return periods.map(([date, data]) => {
    const cpi = withProvider ? data[providerIndex] : calculateAverage(data);
    return [date, cpi];
  });
}

function inflationCalcPipeline(data) {
  const result = {};
  for (const code in data) {
    const { periods, meta } = data[code];

    const inflation = {};
    meta.forEach((provider, index) => {
      inflation[provider.provider] = calculateInflationPerProvider(getAverageOrSelectedCPIPeriods(periods, index));
    });

    if (meta.length > 1) {
      inflation.average = calculateInflationPerProvider(getAverageOrSelectedCPIPeriods(periods, -1));
    }

    result[code] = { meta, inflation };
  }
  return result;
}


module.exports = { inflationCalcPipeline };

