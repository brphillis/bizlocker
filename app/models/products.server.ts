import { prisma } from "~/db.server";
import { getOrderBy } from "~/helpers/sortHelpers";
import { calculateDiscountPercentage } from "~/helpers/numberHelpers";
import { uploadImage_Integration } from "~/integrations/_master/storage";
import type {
  HeroBlockContent,
  Image,
  Product,
  ProductVariant,
  Staff,
} from "@prisma/client";
import { getUserDataFromSession, STAFF_SESSION_KEY } from "~/session.server";
import type { CartItemWithDetails } from "./cart.server";
import type { OrderItemWithDetails } from "./orders.server";
import type { CampaignWithContent } from "./campaigns.server";
import type { BrandWithContent } from "./brands.server";
import type { PromotionWithContent } from "./promotions.server";
import type { ProductSubCategoryWithDetails } from "./productSubCategories.server";
import type {
  StockLevelWithDetails,
  StockTransferRequestWithDetails,
} from "./stock.server";

export interface ProductWithDetails extends Product {
  promotion?: PromotionWithContent | null;
  productVariant?: ProductVariantWithDetails | null;
  brand?: BrandWithContent | null;
  campaigns?: CampaignWithContent[] | null;
  heroBlockContent?: HeroBlockContent[] | null;
  heroImage?: Image | null;
  images?: Image[] | null;
  productSubCategories?: ProductSubCategoryWithDetails[] | null;
  variants?: ProductVariantWithDetails[] | null;
}

export interface ProductVariantWithDetails extends ProductVariant {
  product?: ProductWithDetails | null;
  stock?: StockLevelWithDetails[] | null;
  stockTransferRequest?: StockTransferRequestWithDetails[] | null;
  cartItems?: CartItemWithDetails[] | null;
  orderItems?: OrderItemWithDetails[] | null;
}

export const getProducts = async (
  count?: string
): Promise<ProductWithDetails[]> => {
  if (count) {
    return await prisma.product.findMany({
      include: {
        productSubCategories: true,
        images: true,
        brand: true,
      },
      take: parseInt(count as string),
    });
  } else {
    return await prisma.product.findMany({
      include: {
        productSubCategories: true,
        brand: true,
        variants: true,
      },
    });
  }
};

export const getProduct = async (
  id: string
): Promise<ProductWithDetails | null> => {
  return await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      productSubCategories: {
        include: {
          productCategory: {
            include: {
              department: true,
            },
          },
        },
      },
      images: true,
      heroImage: true,
      brand: true,
      variants: {
        include: {
          stock: {
            include: {
              store: true,
            },
          },
        },
      },
      promotion: true,
    },
  });
};

export const upsertProduct = async (request: Request, productData: any) => {
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

  const { storeId } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

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

  const repoLinksProduct: string[] = [];

  for (const e of images) {
    const repoLink = await uploadImage_Integration(e);
    repoLinksProduct.push(repoLink);
  }

  let heroRepoLink = "";

  if (heroImage) {
    heroRepoLink = await uploadImage_Integration(heroImage);
  }

  const data: any = {
    name,
    description,
    infoURL,
    gender,
    isActive,
    discountPercentageHigh,
    discountPercentageLow,
    promotion: promotion
      ? {
          connect: { id: parseInt(promotion) },
        }
      : undefined,
    brand: brand
      ? {
          connect: { id: parseInt(brand) },
        }
      : undefined,
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
            create: images.map((image: Image, i: number) => ({
              href: repoLinksProduct[i],
              altText: image.altText,
            })),
          }
        : undefined,
    heroImage: heroImage
      ? {
          create: {
            href: heroRepoLink,
            altText: heroImage.altText,
          },
        }
      : undefined,
  };

  if (!id) {
    // Create a new product with variants
    data.variants = {
      create: variants.map((variant: any) => ({
        name: variant.name,
        sku: variant.sku,
        price: parseFloat(variant.price),
        salePrice: parseFloat(variant.salePrice),
        isOnSale: variant.isOnSale,
        isPromoted: variant.isPromoted,
        isFragile: variant.isFragile,
        length: variant.length,
        width: variant.width,
        height: variant.height,
        weight: parseFloat(variant.weight),
        stock: {
          create: {
            store: {
              connect: {
                id: storeId,
              },
            },
            quantity: Array.isArray(variant?.stock)
              ? variant?.stock?.[0]?.quantity
              : variant?.stock,
          },
        },
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
        heroImage: true,
        variants: {
          include: {
            stock: true,
          },
        },
      },
    });

    data.images = {};

    const createImages = [];
    const updateImages = [];

    for (let i = 0; i < images.length; i++) {
      const existingImage = existingProduct?.images[i];
      const image = images[i];

      if (existingImage) {
        updateImages.push({
          id: existingImage.id,
          href: repoLinksProduct[i],
          altText: image.altText,
        });
      } else {
        createImages.push({
          href: repoLinksProduct[i],
          altText: image.altText,
        });
      }
    }

    if (createImages.length > 0) {
      data.images.create = createImages.map(({ href, altText }) => ({
        href,
        altText,
      }));
    }

    if (updateImages.length > 0) {
      data.images.update = updateImages.map(({ id, href, altText }) => ({
        where: { id },
        data: {
          href,
          altText,
        },
      }));
    }

    data.heroImage = {};

    if (existingProduct?.heroImage && heroImage) {
      data.heroImage = {
        update: {
          where: { id: existingProduct.heroImage.id },
          data: {
            href: heroRepoLink,
            altText: heroImage.altText,
          },
        },
      };
    }
    if (!existingProduct?.heroImage && heroImage) {
      data.heroImage = {
        create: {
          href: heroRepoLink,
          altText: heroImage.altText,
        },
      };
    }

    if (!existingProduct) {
      throw new Error("Product not found");
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
        .map((variant: any) => ({
          name: variant.name,
          sku: variant.sku,
          price: parseFloat(variant.price),
          salePrice: parseFloat(variant.salePrice),
          isOnSale: variant.isOnSale,
          isPromoted: variant.isPromoted,
          isFragile: variant.isFragile,
          length: variant.length,
          width: variant.width,
          height: variant.height,
          weight: parseFloat(variant.weight),
          stock: {
            create: {
              store: {
                connect: {
                  id: storeId,
                },
              },
              quantity: Array.isArray(variant?.stock)
                ? variant?.stock?.[0]?.quantity
                : variant?.stock,
            },
          },
          ...(variant.color && { color: variant.color }),
          ...(variant.size && { size: variant.size }),
        })),
      updateMany: variants
        .filter((variant: ProductVariant) => !!variant.id)
        .map((variant: any) => ({
          where: { id: variant.id },
          data: {
            name: variant.name,
            sku: variant.sku,
            price: parseFloat(variant.price),
            salePrice: parseFloat(variant.salePrice),
            isOnSale: variant.isOnSale,
            isPromoted: variant.isPromoted,
            isFragile: variant.isFragile,
            length: variant.length,
            width: variant.width,
            height: variant.height,
            weight: parseFloat(variant.weight),
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

    // Update stock quantity for existing variants
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];

      const currentStockLevel = existingProduct.variants?.[i]?.stock.find(
        (e) => e.storeId === storeId
      )?.quantity;

      // Check if we should update stock / save on number of queries
      const shouldUpdateStock =
        currentStockLevel != variant.stock || !currentStockLevel;

      if (variant.id && variant.stock && shouldUpdateStock && storeId) {
        // Try to update the stock level; if it doesn't exist, create it
        const existingStockLevel = await prisma.stockLevel.findFirst({
          where: {
            productVariantId: variant.id,
            storeId: storeId,
          },
        });

        if (existingStockLevel) {
          // Stock level exists; update it

          await prisma.stockLevel.update({
            where: {
              id: existingStockLevel.id,
            },
            data: {
              quantity: Array.isArray(variant.stock)
                ? variant?.stock[0].quantity
                : variant?.stock,
            },
          });
        } else {
          // Stock level doesn't exist; create it

          await prisma.stockLevel.create({
            data: {
              productVariant: {
                connect: { id: variant.id },
              },
              store: {
                connect: { id: storeId },
              },
              quantity: Array.isArray(variant?.stock)
                ? variant?.stock[0].quantity
                : variant?.stock,
            },
          });
        }
      }
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
  url?: URL,
  activeOnly?: boolean
): Promise<{ products: Product[] | null; totalPages: number }> => {
  const name =
    formData?.name || (url && url?.searchParams.get("name")?.toString()) || "";
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
    12;

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

  if (isActive || activeOnly) {
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

  let products = null;

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
    }) as Product[];
  } else {
    products = fetchedProducts as Product[];
  }

  const totalPages = Math.ceil(totalProducts / (perPage || 1)) || 0;

  return { products, totalPages };
};
