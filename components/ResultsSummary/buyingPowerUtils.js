/**
 * Returns the last accumulated inflation value from the data array.
 */
export function calculateTotalAcumulatedInflation(data) {
  const totalAcumulatedInflation = data[data.length - 1].acumulatedInflation;
  return `${totalAcumulatedInflation.toFixed(2)}%`;
}

export function calculateEquivalentSalaryToOriginalBuyingPower(
  data,
  initialSalary
) {
  return (
    ((100 + data[data.length - 2].acumulatedInflation) / 100) * initialSalary
  );
}

export function calculateTotalBuyingPowerLostInPercentage(data, initialSalary) {
  const totalBuyingPowerLostInPercentage =
    ((initialSalary -
      buyingPowerAtAPoint(initialSalary)(data[data.length - 1])) /
      initialSalary) *
    100;

  return `${totalBuyingPowerLostInPercentage.toFixed(2)}%`;
}

export function calculateBuyingPowerAtAPoint(initialSalary) {
  return (point) => initialSalary / (1 + point.acumulatedInflation / 100);
}
