export const getAvailableSizes = (product: Product): (string | undefined)[] => {
  const sizeSet = new Set();
  const sizes = [];

  for (const variant of product.variants) {
    const size = variant.size;
    if (!sizeSet.has(size)) {
      sizeSet.add(size);
      sizes.push(size);
    }
  }
  return sizes;
};

export const getAvailableColors = (
  product: Product,
  size: string
): string[] | undefined => {
  const colorSet = new Set();
  const colors = [];

  for (const variant of product.variants) {
    const color = variant.color;
    if (!colorSet.has(color) && variant.size === size) {
      colorSet.add(color);
      colors.push(color);
    }
  }
  return colors;
};

export const calculateVariantStock = (variant: ProductVariant): TotalStock => {
  const stockLevels: StockLevel[] | undefined = variant.stock;

  let totalStock: TotalStock = {
    totalStock: 0,
    storeStock: [],
  };

  stockLevels?.forEach(({ quantity, storeId, store }: StockLevel) => {
    const { name } = store;

    const storeStock: StoreStock = {
      total: quantity,
      storeName: name,
      storeId: storeId,
    };

    totalStock.totalStock += quantity;
    totalStock.storeStock.push(storeStock);
  });

  return totalStock;
};

export const calculateProductStock = (product: Product): number => {
  let total: number = 0;

  product.variants.forEach((variant: ProductVariant) => {
    const variantTotalStock = calculateVariantStock(variant);

    if (variantTotalStock.totalStock) {
      total += variantTotalStock.totalStock;
    }
  });

  return total;
};
