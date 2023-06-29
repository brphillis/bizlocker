import { prisma } from "~/db.server";

export const getProducts = async (count?: string) => {
  if (count) {
    return await prisma.product.findMany({
      include: {
        productCategories: {
          select: {
            id: true,
            name: true,
          },
        },
        images: true,
        brand: true,
      },
      take: parseInt(count as string),
    });
  } else {
    return await prisma.product.findMany({
      include: {
        productCategories: {
          select: {
            id: true,
            name: true,
          },
        },
        brand: true,
        variants: true,
      },
    });
  }
};

export const getProduct = async (id: string) => {
  return await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      productCategories: {
        select: {
          id: true,
          name: true,
        },
      },
      images: true,
      brand: true,
      variants: true,
      promotion: true,
    },
  });
};

export const upsertProduct = async (productData: any) => {
  const {
    name,
    description,
    productCategories,
    gender,
    isActive,
    images,
    brand,
    promotion,
    variants,
    id,
  } = productData;

  let product;

  if (!id) {
    // Create a new product with variants
    product = await prisma.product.create({
      data: {
        name,
        description,
        gender,
        isActive,
        brand: {
          connect: { name: brand },
        },
        ...(promotion && {
          // Connect the promotion if provided
          promotion: {
            connect: { id: promotion },
          },
        }),
        productCategories: {
          connect: productCategories.map((category: ProductCategory) => ({
            name: category,
          })),
        },
        images:
          images && images?.length > 0
            ? {
                create: images.map((image: Image) => ({
                  url: image.url,
                  altText: image.altText,
                })),
              }
            : undefined,
        variants: {
          create: variants.map((variant: ProductVariant) => ({
            name: variant.name,
            sku: variant.sku,
            price: variant.price,
            salePrice: variant.salePrice,
            isOnSale: variant.isOnSale,
            isPromoted: variant.isPromoted,
            stock: variant.stock,
            ...(variant.color && { color: variant.color }),
            ...(variant.size && { size: variant.size }),
          })),
        },
      },
      include: {
        brand: true,
        promotion: true,
        productCategories: true,
        images: true,
        variants: true,
      },
    });
  } else {
    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        brand: true,
        promotion: true,
        productCategories: true,
        images: true,
        variants: true,
      },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    if (images) {
      // Delete existing images
      await prisma.image.deleteMany({
        where: { productId: parseInt(id) },
      });
    }

    // Disconnect existing categories
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        productCategories: {
          disconnect: existingProduct.productCategories.map((category) => ({
            name: category.name,
          })),
        },
        ...(promotion === undefined && {
          // Disconnect the existing promotion if promotion is undefined
          promotion: {
            disconnect: true,
          },
        }),
      },
    });

    // Update the product
    product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        gender,
        isActive,
        brand: {
          connect: { name: brand },
        },
        ...(promotion && {
          // Connect the new promotion if provided
          promotion: {
            connect: { id: promotion },
          },
        }),
        productCategories: {
          connect: productCategories.map((category: ProductCategory) => ({
            name: category,
          })),
        },
        images:
          images && images.length > 0
            ? {
                create: images.map((image: Image) => ({
                  url: image.url,
                  altText: image.altText,
                })),
              }
            : undefined,
      },
      include: {
        brand: true,
        promotion: true,
        productCategories: true,
        images: true,
        variants: true,
      },
    });

    // Update existing variants and create new variants if they don't exist
    for (let variant of variants) {
      const existingVariant = await prisma.productVariant.findUnique({
        where: { sku: variant.sku },
      });

      if (existingVariant) {
        // If variant exists, update it
        await prisma.productVariant.update({
          where: { sku: variant.sku },
          data: {
            name: variant.name,
            sku: variant.sku,
            price: variant.price,
            salePrice: variant.salePrice,
            isOnSale: variant.isOnSale,
            isPromoted: variant.isPromoted,
            stock: variant.stock,
            ...(variant.color === undefined || variant.color === ""
              ? { color: null }
              : { color: variant.color }),
            ...(variant.size === undefined || variant.size === ""
              ? { size: null }
              : { size: variant.size }),
          },
        });
      } else {
        // If variant doesn't exist, create it
        await prisma.productVariant.create({
          data: {
            name: variant.name,
            sku: variant.sku,
            price: variant.price,
            salePrice: variant.salePrice,
            isOnSale: variant.isOnSale,
            isPromoted: variant.isPromoted,
            stock: variant.stock,
            ...(variant.color && { color: variant.color }),
            ...(variant.size && { size: variant.size }),
            product: { connect: { id: parseInt(id) } }, // connect it to the product being updated
          },
        });
      }
    }

    // Include variants in the response
    product = { ...product, variants };
  }

  return product;
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Delete the variants
  await prisma.productVariant.deleteMany({
    where: {
      productId: parseInt(id),
    },
  });

  // Delete the product
  return await prisma.product.deleteMany({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchProducts = async (searchArgs: BasicSearchArgs) => {
  const {
    name,
    rootCategory,
    category,
    brand,
    promotion,
    gender,
    page,
    perPage,
    sortBy,
    sortOrder,
  } = searchArgs;

  const skip = (page - 1) * perPage;
  const take = perPage;

  // Construct a filter based on the search parameters provided
  const filter: { [key: string]: any } = {};

  if (name) {
    filter.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (rootCategory && !category) {
    const productCategories = await prisma.productCategory.findMany({
      where: {
        rootCategory: {
          name: {
            equals: rootCategory,
            mode: "insensitive",
          },
        },
      },
      select: {
        id: true,
      },
    });

    filter.productCategories = {
      some: {
        id: {
          in: productCategories.map((category) => category.id),
        },
      },
    };
  }

  if (category) {
    filter.productCategories = {
      some: {
        name: {
          equals: category,
          mode: "insensitive",
        },
      },
    };
  }

  if (brand) {
    filter.brand = {
      name: {
        equals: brand,
        mode: "insensitive",
      },
    };
  }

  if (promotion) {
    filter.promotion = {
      isActive: true,
      name: {
        contains: promotion,
        mode: "insensitive",
      },
    };
  }

  if (gender) {
    filter.gender = gender;
  }

  // Find and count the products
  const [fetchedProducts, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where: filter,
      include: {
        productCategories: {
          select: {
            id: true,
            name: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        images: true,
        variants: true,
      },
      skip,
      take,
      orderBy: getOrderBy(sortBy as SortBy, sortOrder as SortOrder),
    }),
    prisma.product.count({
      where: filter,
    }),
  ]);

  let products;

  // If sorting by price is required, sort the products array after fetching
  if (sortBy === "price" && sortOrder) {
    products = fetchedProducts.sort((a, b) => {
      // Assume each product has at least one variant
      const aPrice = a.variants[0].price;
      const bPrice = b.variants[0].price;

      // If the price is the same, sort by totalSold
      if (aPrice === bPrice) {
        return sortOrder === "asc"
          ? a.totalSold - b.totalSold
          : b.totalSold - a.totalSold;
      }

      return sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice;
    });
  } else {
    products = fetchedProducts;
  }

  const totalPages = Math.ceil(totalProducts / (Number(perPage) || 1));

  return { products, totalPages };
};

const getOrderBy = (sortBy?: SortBy, sortOrder?: SortOrder) => {
  if (sortBy && sortOrder) {
    switch (sortBy) {
      case "createdAt":
        return { createdAt: sortOrder };
      case "totalSold":
        return { totalSold: sortOrder };
      case "name":
        return { name: sortOrder };
      default:
        return undefined;
    }
  }
  return undefined;
};
