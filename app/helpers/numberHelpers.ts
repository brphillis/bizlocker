import { ProductVariant, Promotion } from "@prisma/client";
import { CartItemWithDetails } from "~/models/Cart/types";
import { ProductWithDetails } from "~/models/Products/types";

export const isDecimal = (number: number): boolean => {
  return number % 1 !== 0;
};

export const getRandomOneOrTwo = (): number => {
  const randomValue = Math.random();

  if (randomValue < 0.5) {
    return 1;
  } else {
    return 2;
  }
};

export const calculateDiscountPercentage = (
  price: number,
  salePrice: number,
): number => {
  if (
    !price ||
    !salePrice ||
    price <= 0 ||
    salePrice <= 0 ||
    salePrice >= price
  ) {
    return 0;
  }
  return ((price - salePrice) / price) * 100;
};

export const calculatePercentageChange = (
  currentValue: number,
  previousValue: number,
): number => {
  const change = currentValue - previousValue;
  const percentageChange = (change / previousValue) * 100;
  return percentageChange;
};

export const minusPercentage = (
  initialNumber: number,
  minusPercentage: number,
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

export const addPercentage = (
  initialNumber: number,
  addPercentage: number,
): number => {
  if (typeof initialNumber !== "number" || typeof addPercentage !== "number") {
    throw new Error("Price and percentage must be numbers.");
  }

  if (addPercentage < 0) {
    throw new Error("Percentage cannot be negative.");
  }

  const increaseAmount: number = (initialNumber * addPercentage) / 100;
  return initialNumber + increaseAmount;
};

export const calculateCartTotal = (
  cartItems: CartItemWithDetails[],
): number => {
  let total = 0;

  cartItems?.forEach((e) => {
    if (e.variant)
      if (e.variant.isOnSale && e.variant.salePrice) {
        total += e.variant.salePrice * e.quantity;
      } else {
        let variantTotalPrice = e.variant.price;
        if (e.variant.isPromoted && e.variant.product) {
          const discountPercentage =
            e.variant.product.promotion?.discountPercentage;

          if (discountPercentage) {
            variantTotalPrice = minusPercentage(
              variantTotalPrice,
              discountPercentage,
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
  product?: ProductWithDetails,
  promotion?: Promotion | null,
): string => {
  const { isOnSale, salePrice, price, isPromoted } = variant || {};

  let unitPrice = isOnSale && salePrice ? salePrice : price;

  if (unitPrice && isPromoted && !isOnSale) {
    const { discountPercentage } = product?.promotion || promotion || {};
    if (discountPercentage) {
      unitPrice = minusPercentage(unitPrice, discountPercentage);
    }
  }

  return unitPrice.toFixed(2);
};
