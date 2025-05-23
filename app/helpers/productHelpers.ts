import { StockLevelWithDetails } from "~/models/Stock/types";
import {
  ProductVariantWithDetails,
  ProductWithDetails,
} from "~/models/Products/types";

type TotalStock = {
  totalStock: number;
  storeStock: StoreStock[];
};

type StoreStock = {
  total: number;
  storeName: string;
  storeId: number;
};

export const getAvailableSizes = (
  product: ProductWithDetails,
): (string | undefined | null)[] => {
  const sizeSet = new Set();
  const sizes = [];

  if (product.variants) {
    for (const variant of product.variants) {
      const size = variant.size;
      if (!sizeSet.has(size)) {
        sizeSet.add(size);
        sizes.push(size);
      }
    }
  }

  return sizes;
};

export const getAvailableColors = (
  product: ProductWithDetails,
  size: string,
): (string | undefined | null)[] => {
  const colorSet = new Set<string | undefined | null>();
  const colors = [];

  if (product.variants) {
    for (const variant of product.variants) {
      if (variant && variant.color && variant.size === size) {
        const color = variant.color;

        if (!colorSet.has(color)) {
          colorSet.add(color);
          colors.push(color);
        }
      }
    }
  }

  return colors;
};

export const calculateVariantStock = (
  variant: ProductVariantWithDetails,
): TotalStock => {
  const stockLevels: StockLevelWithDetails[] | null | undefined = variant.stock;

  const totalStock: TotalStock = {
    totalStock: 0,
    storeStock: [],
  };

  stockLevels?.forEach(
    ({ quantity, storeId, store }: StockLevelWithDetails) => {
      const { name } = store || {};

      if (!name) {
        throw new Error("Invalid Stock Store Name");
      }

      const storeStock: StoreStock = {
        total: quantity,
        storeName: name,
        storeId: storeId,
      };

      totalStock.totalStock += quantity;
      totalStock.storeStock.push(storeStock);
    },
  );

  return totalStock;
};

export const calculateProductStock = (product: ProductWithDetails): number => {
  let total: number = 0;

  product?.variants?.forEach((variant: ProductVariantWithDetails) => {
    const variantTotalStock = calculateVariantStock(variant);

    if (variantTotalStock.totalStock) {
      total += variantTotalStock.totalStock;
    }
  });

  return total;
};
