export const calculateOrderTotalInLamports = (
  orderPriceAUD: number,
  solanaPriceAUD: number,
): number => {
  const lamportValueAUD = solanaPriceAUD / 1_000_000_000;

  const lamportsNeeded = Math.round(orderPriceAUD / lamportValueAUD);

  return lamportsNeeded;
};
