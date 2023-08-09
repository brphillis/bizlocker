export const getAvailableSizes = (product: Product): string[] | undefined => {
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
