const calculateInflationPercentageChange = (current, previous) => {
  return ((current - previous) / previous) * 100;
};

export const getAccumulatedInflation = ({ period }) => {
  if (!period.length) return {};
  const monthly = period.map((current, index) => {
    if (!index) return [current[0], 0];
    return [
      current[0],
      calculateInflationPercentageChange(current[1], period[index - 1][1]),
    ];
  });

  const total = calculateInflationPercentageChange(
    period[period.length - 1][1],
    period[0][1]
  );
  return { monthly, total };
};
