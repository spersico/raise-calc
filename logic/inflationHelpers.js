const calculateChangeRate = (current, previous, preference = 0) => {
  return (
    ((current[preference] - previous[preference]) / previous[preference]) * 100
  );
};

export const getAccumulatedInflation = (periods) => {
  if (!periods.length) return {};
  const monthly = periods.map(([yearMonth, values], index) => {
    if (index === 0) return [yearMonth, 0];
    return [yearMonth, calculateChangeRate(values, periods[index - 1][1])];
  });

  const total = calculateChangeRate(
    periods[periods.length - 1][1],
    periods[0][1]
  );
  return { monthly, total };
};
