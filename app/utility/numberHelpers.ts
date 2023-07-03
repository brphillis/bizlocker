export const calculatePercentageChange = (
  currentValue: number,
  previousValue: number
) => {
  const change = currentValue - previousValue;
  const percentageChange = (change / previousValue) * 100;
  return percentageChange;
};
