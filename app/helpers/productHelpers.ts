import type {
  ProductVariantWithDetails,
  ProductWithDetails,
} from "~/models/products.server";
import type { StockLevelWithDetails } from "~/models/stock.server";

export const getAvailableSizes = (
  product: ProductWithDetails
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
  size: string
): (string | undefined | null)[] => {
  const colorSet = new Set();
  const colors = [];

  if (product.variants) {
    for (const variant of product.variants) {
      const color = variant.color;
      if (!colorSet.has(color) && variant.size === size) {
        colorSet.add(color);
        colors.push(color);
      }
    }
  }

  return colors;
};

export const calculateVariantStock = (
  variant: ProductVariantWithDetails
): TotalStock => {
  const stockLevels: StockLevelWithDetails[] | null | undefined = variant.stock;

  let totalStock: TotalStock = {
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
    }
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
