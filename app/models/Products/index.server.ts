import { prisma } from "../../db.server";
import { getOrderBy } from "../../helpers/sortHelpers";
import { calculateDiscountPercentage } from "../../helpers/numberHelpers";
import {
  deleteImage_Integration,
  uploadImage_Integration,
} from "../../integrations/_master/storage/index.server";
import { Gender, Image, Product, ProductVariant, Staff } from "@prisma/client";
import {
  getUserDataFromSession,
  STAFF_SESSION_KEY,
} from "../../session.server";
import {
  NewProduct,
  ProductCreateQuery,
  ProductUpdateQuery,
  ProductUpsertQuery,
  ProductVariantWithDetails,
  ProductWithDetails,
} from "./types";
import { NewProductVariant } from "../../modules/Admin/Upsert/ProductUpsert/ProductVariantUpsert";
import { removeS3Image } from "../../integrations/aws/s3/s3.server";
import { returnCorrectGender } from "../../helpers/stringHelpers";

export const getProducts = async (
  count?: string,
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
  id: string,
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

export const getProductVariant = async (
  id: string,
): Promise<ProductVariantWithDetails | null> => {
  return await prisma.productVariant.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      product: true,
      stock: true,
    },
  });
};

export const upsertProduct = async (
  request: Request,
  productData: NewProduct,
) => {
  const {
    name,
    description,
    dropshipURL,
    dropshipSKU,
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
    (variant: NewProductVariant) => variant.isActive,
  );
  const discountPercentages = activeVariants.map((variant: NewProductVariant) =>
    calculateDiscountPercentage(variant.price!, variant.salePrice!),
  );
  const discountPercentageHigh =
    discountPercentages.length > 0 ? Math.max(...discountPercentages) : 0;
  const discountPercentageLow =
    discountPercentages.length > 0 ? Math.min(...discountPercentages) : 0;

  const repoLinksProduct: string[] = [];

  if (images) {
    for (const e of images) {
      const repoLink = await uploadImage_Integration(e);
      repoLinksProduct.push(repoLink);
    }
  }

  let heroRepoLink = "";

  if (heroImage) {
    heroRepoLink = await uploadImage_Integration(heroImage);
  }

  const data: ProductUpsertQuery = {
    name,
    description,
    dropshipURL,
    dropshipSKU,
    gender: gender as Gender,
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
        .filter((categoryId: string) => !isNaN(parseInt(categoryId)))
        .map((categoryId: string) => ({
          id: parseInt(categoryId),
        })),
    },
    images:
      images && images.length > 0
        ? {
            create: images.map((image: Image, i: number) => ({
              href: repoLinksProduct[i],
              altText: image.altText,
              tags: image.tags,
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
      //@ts-expect-error:exists on product
      create: variants.map((variant: Partial<ProductVariant>) => ({
        name: variant.name,
        sku: variant.sku,
        price: variant.price && parseFloat(variant.price.toString()),
        salePrice:
          variant?.salePrice && parseFloat(variant?.salePrice?.toString()),
        isOnSale: variant.isOnSale,
        isPromoted: variant.isPromoted,
        isFragile: variant.isFragile,
        length: variant.length,
        width: variant.width,
        height: variant.height,
        weight: variant.weight && parseFloat(variant.weight.toString()),
        stock: {
          create: {
            store: {
              connect: {
                id: storeId,
              },
            },
            //@ts-expect-error: checking for newvariant or existing
            quantity: Array.isArray(variant?.stock)
              ? //@ts-expect-error: checking for newvariant or existing
                variant?.stock?.[0]?.quantity
              : //@ts-expect-error: checking for newvariant or existing
                variant?.stock,
          },
        },
        ...(variant.color && { color: variant.color }),
        ...(variant.size && { size: variant.size }),
      })),
    };

    const createData = data as ProductCreateQuery;

    product = await prisma.product.create({
      data: createData,
      include: {
        brand: true,
        promotion: true,
        productSubCategories: true,
        images: true,
        variants: true,
      },
    });
  } else {
    const updateData = data as ProductUpdateQuery;

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

    updateData.images = {};

    const createImages = [];

    if (images) {
      for (let i = 0; i < images.length; i++) {
        const image = images?.[i];

        createImages.push({
          href: repoLinksProduct[i],
          altText: image.altText,
          tags: image.tags,
        });
      }
    }

    if (createImages.length > 0) {
      updateData.images.create = createImages.map(
        ({ href, altText, tags }) => ({
          href,
          altText,
          tags,
        }),
      );
    }

    updateData.heroImage = {};

    if (!existingProduct?.heroImage && heroImage) {
      updateData.heroImage = {
        create: {
          href: heroRepoLink,
          altText: heroImage.altText,
        },
      };
    }

    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // disconnect existing connections
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
        images:
          existingProduct.images && existingProduct.images.length > 0
            ? {
                set: [],
              }
            : undefined,
      },
    });

    const existingImageIds = existingProduct.images.map((e) => e.id);
    const newImageIds = images?.map((e) => e.id);

    const removedImageIds = existingImageIds.filter(
      (id) => !newImageIds?.includes(id),
    );

    // remove old images from bucket
    if (existingProduct.images && existingProduct.images.length > 0) {
      for (let i = 0; i < existingProduct.images.length; i++) {
        if (
          removedImageIds.includes(existingProduct.images[i].id) &&
          existingProduct.images[i].href
        ) {
          await removeS3Image(existingProduct.images[i].href!);
        }
      }
    }

    // Update the product
    updateData.variants = {
      //@ts-expect-error:exists on new product
      create: variants
        .filter((variant: NewProductVariant) => !variant.id)
        .map((variant: Partial<ProductVariant>) => ({
          name: variant.name,
          sku: variant.sku,
          price: variant.price && parseFloat(variant.price?.toString()),
          salePrice:
            variant.salePrice && parseFloat(variant.salePrice?.toString()),
          isOnSale: variant.isOnSale,
          isPromoted: variant.isPromoted,
          isFragile: variant.isFragile,
          length: variant.length,
          width: variant.width,
          height: variant.height,
          weight: variant.weight && parseFloat(variant.weight.toString()),
          stock: {
            create: {
              store: {
                connect: {
                  id: storeId,
                },
              },
              //@ts-expect-error: checking for newvariant or existing
              quantity: Array.isArray(variant?.stock)
                ? //@ts-expect-error: checking for newvariant or existing
                  variant?.stock?.[0]?.quantity
                : //@ts-expect-error: checking for newvariant or existing
                  variant?.stock,
            },
          },
          ...(variant.color && { color: variant.color }),
          ...(variant.size && { size: variant.size }),
        })),
      updateMany: variants
        .filter((variant: NewProductVariant) => !!variant.id)
        .map((variant: Partial<ProductVariant>) => ({
          where: { id: variant.id },
          data: {
            name: variant.name,
            sku: variant.sku,
            price: variant.price && parseFloat(variant.price.toString()),
            salePrice:
              variant.salePrice && parseFloat(variant.salePrice.toString()),
            isOnSale: variant.isOnSale,
            isPromoted: variant.isPromoted,
            isFragile: variant.isFragile,
            length: variant.length,
            width: variant.width,
            height: variant.height,
            weight: variant.weight && parseFloat(variant.weight.toString()),
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
      updateData.brand = {
        connect: { id: parseInt(brand) },
      };
    }
    if (promotion) {
      updateData.promotion = {
        connect: { id: parseInt(promotion) },
      };
    }

    // Update stock quantity for existing variants
    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i];

      const currentStockLevel = existingProduct.variants?.[i]?.stock.find(
        (e) => e.storeId === storeId,
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
      data: updateData,
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
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        images: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // delete the stockLevels associated with product variants
    const productVariants = await prisma.productVariant.findMany({
      where: {
        productId: parseInt(id),
      },
    });

    const variantIds: number[] = productVariants.map((variant) => variant.id);

    await prisma.stockLevel.deleteMany({
      where: {
        productVariantId: {
          in: variantIds,
        },
      },
    });

    // delete the product variants
    await prisma.productVariant.deleteMany({
      where: {
        productId: parseInt(id),
      },
    });

    // delete the images from the bucket
    for (let i = 0; i < product.images.length; i++) {
      if (product?.images[i].href) {
        await deleteImage_Integration(product.images[i].href!);
      }
    }

    // delete the image data from the db
    await prisma.image.deleteMany({
      where: {
        productId: parseInt(id),
      },
    });

    // delete the product
    await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });
  } catch (error) {
    console.error("Error deleting product:", error);
  } finally {
    await prisma.$disconnect();
  }
};

export const searchProducts = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL,
  activeOnly?: boolean,
): Promise<{
  products: Product[] | null;
  totalPages: number;
  count: number;
}> => {
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
  let gender = formData?.gender || url?.searchParams.get("gender") || "";
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
  const filter: { [key: string]: unknown } = {};

  gender = returnCorrectGender(gender as string);

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

      filter.productSubCategories = {
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

  if (gender && gender !== "UNISEX") {
    filter.gender = {
      in: [gender as string, "UNISEX"],
    };
  }

  if (gender && gender === "KIDS") {
    filter.gender = gender;
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
        variants: {
          orderBy: {
            price: "asc",
          },
        },
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
      orderBy: getOrderBy(sortBy as SortBy, sortOrder as SortOrder, "product"),
    }),
    prisma.product.count({
      where: filter,
    }),
  ]);

  let products = null;

  products = fetchedProducts as Product[];

  // If sorting by price is required, sort the products array after fetching
  if (sortBy === "price" && sortOrder) {
    products = fetchedProducts.sort((a, b) => {
      // Assume each product has at least one variant
      const aPrice = a.variants?.[0].price;
      const bPrice = b.variants?.[0].price;

      // If the price is the same, sort by totalSold
      if (aPrice === bPrice) {
        return sortOrder === "asc"
          ? a.totalSold - b.totalSold
          : b.totalSold - a.totalSold;
      }

      return sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice;
    }) as Product[];
  }

  if (isPromoted || promotionId) {
    products = fetchedProducts
      .map((product) => {
        const promotedVariants = product.variants?.filter(
          (variant) => variant.isPromoted,
        );

        return {
          ...product,
          variants: promotedVariants,
        };
      })
      .filter((product) => product.variants.length > 0);
  }

  if (onSale) {
    products = fetchedProducts
      .map((product) => {
        const promotedVariants = product.variants?.filter(
          (variant) => variant.isOnSale,
        );

        return {
          ...product,
          variants: promotedVariants,
        };
      })
      .filter((product) => product.variants.length > 0);
  }

  const totalPages = Math.ceil(totalProducts / (perPage || 1)) || 0;
  const count = totalProducts;

  return { products, totalPages, count };
};
