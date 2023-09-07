export const calculatePercentageChange = (
  currentValue: number,
  previousValue: number
) => {
  const change = currentValue - previousValue;
  const percentageChange = (change / previousValue) * 100;
  return percentageChange;
};

export const minusPercentage = (
  initialNumber: number,
  minusPercentage: number
): number => {
  if (
    typeof initialNumber !== "number" ||
    typeof minusPercentage !== "number"
  ) {
    throw new Error("Price and percentage must be numbers.");
  }

  if (minusPercentage < 0 || minusPercentage > 100) {
    throw new Error("Percentage must be between 0 and 100.");
  }

  const discountAmount: number = (initialNumber * minusPercentage) / 100;
  return initialNumber - discountAmount;
};

export const calculateCartTotal = (cartItems: CartItem[]): number => {
  let total = 0;

  cartItems?.forEach((e) => {
    if (e.variant.isOnSale && e.variant.salePrice) {
      total += e.variant.salePrice * e.quantity;
    } else {
      let variantTotalPrice = e.variant.price;
      if (e.variant.isPromoted) {
        const discountPercentage =
          e.variant.product.promotion?.discountPercentage;

        if (discountPercentage) {
          variantTotalPrice = minusPercentage(
            variantTotalPrice,
            discountPercentage
          );
        }

        total += variantTotalPrice * e.quantity;
      } else {
        total += e.variant.price * e.quantity;
      }
    }
  });

  return total;
};

export const getVariantUnitPrice = (
  variant: ProductVariant,
  product: Product
): string | undefined => {
  const { isOnSale, salePrice, price, isPromoted } = variant;

  let unitPrice = isOnSale ? salePrice : price;

  if (unitPrice && isPromoted && !isOnSale) {
    const { discountPercentage } = product.promotion || {};
    if (discountPercentage) {
      unitPrice = minusPercentage(unitPrice, discountPercentage);
    }
  }

  return unitPrice?.toFixed(2);
};

export const getRandomOneOrTwo = (): number => {
  const randomValue = Math.random();

  if (randomValue < 0.5) {
    return 1;
  } else {
    return 2;
  }
};

export const extractNumbersFromString = (inputString: string): number => {
  const matches: RegExpMatchArray | null = inputString.match(/\d+/g);

  if (!matches) {
    return 0;
  }

  const numericString: string = matches.join("");

  const numericValue: number = parseInt(numericString, 10);

  return numericValue;
};
