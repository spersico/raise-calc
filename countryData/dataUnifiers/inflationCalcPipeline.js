import { calculateAverage, calculateChangeRate, round } from '../../utils/math.js';
import { MONTHS_TO_AVERAGE_ESTIMATED_CPI } from '../constants.js';


function estimateMissingCPI(monthlyData, lastPeriodsCPI) {
  const previousInflations = monthlyData
    .slice()
    .reverse()
    .filter(({ cpi }) => Number.isFinite(cpi))
    .slice(0, MONTHS_TO_AVERAGE_ESTIMATED_CPI)
    .map(({ inflation }) => inflation);
  const avg = calculateAverage(previousInflations);
  const estimatedNextValue = (avg / 100) * lastPeriodsCPI + lastPeriodsCPI;
  return estimatedNextValue;
}


function calculateInflationPerProvider(periods) {
  if (!periods.length)
    return {};
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
    monthlyData.push({ date, inflation: round(monthlyInflation), cpi, ...estimation });
  }

  return monthlyData;
}

// TODO: This assumes that the methodology and the initial CPI count is the same. 
// I'm not sure that's true. 
// A probable better way would be to get the average inflation, and use that
// and for the CPI of that one, select one of the provider CPI's, and modify it according to inflation (the avg one)
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

export function inflationCalcPipeline(data) {
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
