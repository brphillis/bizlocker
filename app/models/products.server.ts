import { prisma } from "~/db.server";
import { getOrderBy } from "~/utility/sortHelpers";

export const getProducts = async (count?: string) => {
  if (count) {
    return await prisma.product.findMany({
      include: {
        productSubCategories: {
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
        productSubCategories: {
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
      productSubCategories: {
        select: {
          id: true,
          name: true,
          productCategory: {
            select: {
              id: true,
              name: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      images: true,
      heroImage: true,
      brand: true,
      variants: true,
      promotion: true,
    },
  });
};

// Function to calculate discount percentage
const calculateDiscountPercentage = (price: number, salePrice: number) => {
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

export const upsertProduct = async (productData: any) => {
  const {
    name,
    description,
    infoURL,
    productSubCategories,
    gender,
    isActive,
    images,
    heroImage,
    brand,
    promotion,
    variants,
    id,
  } = productData;

  let product;

  // Compute the discountPercentageHigh and discountPercentageLow for the product from the variants

  const activeVariants = variants.filter(
    (variant: ProductVariant) => variant.isActive
  );
  const discountPercentages = activeVariants.map((variant: ProductVariant) =>
    calculateDiscountPercentage(variant.price, variant.salePrice!)
  );
  const discountPercentageHigh =
    discountPercentages.length > 0 ? Math.max(...discountPercentages) : 0;
  const discountPercentageLow =
    discountPercentages.length > 0 ? Math.min(...discountPercentages) : 0;

  const data: any = {
    name,
    description,
    infoURL,
    gender,
    isActive,
    discountPercentageHigh,
    discountPercentageLow,
    productSubCategories: {
      connect: productSubCategories
        .filter((categoryId: any) => !isNaN(parseInt(categoryId)))
        .map((categoryId: any) => ({
          id: parseInt(categoryId),
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
    heroImage: {
      create: {
        url: heroImage.url,
        altText: heroImage.altText,
      },
    },
  };

  if (!id) {
    // Create a new product with variants
    data.variants = {
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
    };

    product = await prisma.product.create({
      data,
      include: {
        brand: true,
        promotion: true,
        productSubCategories: true,
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
        productSubCategories: true,
        images: true,
        variants: true,
      },
    });

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Delete existing images
    if (images) {
      await prisma.image.deleteMany({
        where: { productId: parseInt(id) },
      });
    }

    // Disconnect existing connections
    await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        productSubCategories: {
          disconnect: existingProduct.productSubCategories.map((category) => ({
            id: category.id,
          })),
        },
        brand: {
          disconnect: true,
        },
        promotion: {
          disconnect: true,
        },
      },
    });

    // Update the product
    data.variants = {
      create: variants
        .filter((variant: ProductVariant) => !variant.id)
        .map((variant: ProductVariant) => ({
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
      updateMany: variants
        .filter((variant: ProductVariant) => !!variant.id)
        .map((variant: ProductVariant) => ({
          where: { id: variant.id },
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
        })),
    };

    if (brand) {
      data.brand = {
        connect: { id: parseInt(brand) },
      };
    }
    if (promotion) {
      data.promotion = {
        connect: { id: parseInt(promotion) },
      };
    }

    product = await prisma.product.update({
      where: { id: parseInt(id) },
      data,
      include: {
        brand: true,
        promotion: true,
        productSubCategories: true,
        images: true,
        variants: true,
      },
    });
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

export const searchProducts = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
) => {
  const name =
    formData?.name || (url && url.searchParams.get("name")?.toString()) || "";
  const department =
    formData?.department || url?.searchParams.get("department") || "";
  const category =
    formData?.productCategory || url?.searchParams.get("productCategory") || "";
  const subCategory =
    formData?.productSubCategory ||
    url?.searchParams.get("productSubCategory") ||
    "";
  const brand = formData?.brand || url?.searchParams.get("brand") || "";
  const gender = formData?.gender || url?.searchParams.get("gender") || "";
  const color = formData?.color || url?.searchParams.get("color") || "";
  const isActive =
    formData?.isActive || url?.searchParams.get("isActive") || "";
  const onSale = formData?.onSale || url?.searchParams.get("onSale") || "";
  const isPromoted =
    formData?.isPromoted || url?.searchParams.get("isPromoted") || "";
  const promotionId =
    formData?.promotionId || url?.searchParams.get("promotionId") || "";
  const sortBy = formData?.sortBy || url?.searchParams.get("sortBy") || "";
  const sortOrder =
    formData?.sortOrder || url?.searchParams.get("sortOrder") || "";

  const pageNumber =
    (formData?.pageNumber && parseInt(formData.pageNumber as string)) ||
    Number(url?.searchParams.get("pageNumber")) ||
    1;
  const perPage =
    (formData?.perPage && parseInt(formData.perPage as string)) ||
    Number(url?.searchParams.get("perPage")) ||
    8;

  const excludeId =
    formData?.excludeId || url?.searchParams.get("excludeId") || "";

  // const includeVariants =
  //   formData?.includeVariants || url?.searchParams.get("includeVariants") || "";

  const skip = (pageNumber - 1) * perPage;
  const take = perPage;

  // Construct a filter based on the search parameters provided
  const filter: { [key: string]: any } = {};

  if (name) {
    filter.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (department) {
    const productSubCategories = await prisma.productSubCategory.findMany({
      where: {
        productCategory: {
          department: {
            name: {
              equals: department as string,
              mode: "insensitive",
            },
          },
        },
      },
      select: {
        name: true,
      },
    });
    filter.productSubCategories = {
      some: {
        name: {
          in: productSubCategories.map((category) => category.name),
        },
      },
    };
  }

  if (category && !subCategory) {
    if (isNaN(parseInt(category as string))) {
      const productSubCategories = await prisma.productSubCategory.findMany({
        where: {
          productCategory: {
            name: {
              equals: category as string,
              mode: "insensitive",
            },
          },
        },
        select: {
          name: true,
        },
      });
      filter.productSubCategories = {
        some: {
          name: {
            in: productSubCategories.map((category) => category.name),
          },
        },
      };
    } else {
      const productSubCategories = await prisma.productSubCategory.findMany({
        where: {
          productCategory: {
            id: {
              equals: parseInt(category as string),
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
            in: productSubCategories.map((category) => category.id),
          },
        },
      };
    }
  }

  if (subCategory) {
    if (isNaN(parseInt(subCategory as string))) {
      filter.productSubCategories = {
        some: {
          name: {
            equals: subCategory as string,
            mode: "insensitive", // Use 'insensitive' mode for case-insensitive comparison
          },
        },
      };
    } else {
      const categoryId = parseInt(subCategory as string);
      filter.productSubCategories = {
        some: {
          id: categoryId,
        },
      };
    }
  }

  if (brand) {
    if (isNaN(parseInt(brand as string))) {
      filter.brand = {
        name: {
          equals: brand as string,
          mode: "insensitive", // Use 'insensitive' mode for case-insensitive comparison
        },
      };
    } else {
      const brandId = parseInt(brand as string);
      filter.brand = {
        id: brandId,
      };
    }
  }

  if (gender) {
    filter.gender = gender as string;
  }

  if (isActive) {
    filter.isActive = true;
  }

  if (color) {
    filter.variants = {
      some: {
        color: {
          equals: color,
        },
      },
    };
  }

  if (onSale) {
    filter.variants = {
      some: {
        isOnSale: true,
      },
    };
  }

  if (isPromoted) {
    filter.variants = {
      some: {
        isPromoted: true,
      },
    };
  }

  if (promotionId) {
    const id = parseInt(promotionId as string);
    filter.promotion = {
      id: {
        equals: id,
      },
    };
  }

  if (excludeId) {
    filter.id = {
      not: {
        equals: parseInt(excludeId as string),
      },
    };
  }

  // Find and count the products
  const [fetchedProducts, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where: filter,
      include: {
        productSubCategories: {
          select: {
            id: true,
            name: true,
            productCategory: {
              include: {
                department: true,
              },
            },
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
        promotion: {
          select: {
            name: true,
            discountPercentage: true,
            isActive: true,
          },
        },
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

  const totalPages = Math.ceil(totalProducts / (perPage || 1));

  return { products, totalPages };
};
