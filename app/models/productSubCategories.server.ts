import type { CampaignWithContent } from "./campaigns.server";
import type { ProductCategoryWithDetails } from "./productCategories.server";
import type { ProductWithDetails } from "./products.server";
import type { ProductSubCategory, Image, BlockContent } from "@prisma/client";
import { prisma } from "~/db.server";
import { getOrderBy } from "~/helpers/sortHelpers";
import {
  updateImage_Integration,
  uploadImage_Integration,
} from "~/integrations/_master/storage";

export interface ProductSubCategoryWithDetails extends ProductSubCategory {
  campaigns?: CampaignWithContent[] | null;
  image?: Image | null;
  blockContent?: BlockContent | null;
  productCategory?: ProductCategoryWithDetails | null;
  products?: ProductWithDetails[] | null;
}

export type NewProductSubCategory = {
  name: string;
  image?: Image;
  productCategory: string;
  index: number;
  displayInNavigation: boolean;
  isActive: boolean;
  id?: string;
};

export const getProductSubCategories = async (): Promise<
  ProductSubCategoryWithDetails[]
> => {
  return await prisma.productSubCategory.findMany({
    include: {
      productCategory: {
        include: {
          productSubCategories: true,
          department: true,
        },
      },
    },
    orderBy: {
      index: "asc",
    },
  });
};

export const getProductSubCategory = async (
  id: string
): Promise<ProductSubCategoryWithDetails | null> => {
  return await prisma.productSubCategory.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      image: true,
    },
  });
};

export const upsertProductSubCategory = async (
  categoryData: NewProductSubCategory
): Promise<{
  createdProductSubCategory: ProductSubCategory | null;
  updatedProductSubCategory: ProductSubCategory | null;
}> => {
  const {
    id,
    index,
    productCategory,
    displayInNavigation,
    isActive,
    name,
    image,
  } = categoryData;

  if (!id && image) {
    const repoLink = await uploadImage_Integration(image);
    const createdProductSubCategory = await prisma.productSubCategory.create({
      data: {
        name: name,
        index,
        displayInNavigation,
        isActive,
        image: {
          create: {
            href: repoLink,
            altText: image.altText,
          },
        },
        productCategory: productCategory
          ? {
              connect: {
                id: parseInt(productCategory),
              },
            }
          : undefined,
      },
    });

    return { createdProductSubCategory, updatedProductSubCategory: null };
  } else if (!id && !image) {
    const createdProductSubCategory = await prisma.productSubCategory.create({
      data: {
        name: name,
        index,
        displayInNavigation,
        isActive,
        productCategory: productCategory
          ? {
              connect: {
                id: parseInt(productCategory),
              },
            }
          : undefined,
      },
    });

    return { createdProductSubCategory, updatedProductSubCategory: null };
  } else if (id) {
    const productSubCategory = await prisma.productSubCategory.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        image: true,
      },
    });

    if (!productSubCategory) {
      throw new Error("Category not found");
    }

    let imageData = {};

    if (image && productSubCategory.image) {
      const repoLink = await updateImage_Integration(
        productSubCategory.image as Image,
        image
      );

      imageData = {
        update: {
          url: repoLink,
          altText: image.altText,
        },
      };
    }
    if (image && !productSubCategory.image) {
      const repoLink = await uploadImage_Integration(image);

      imageData = {
        create: {
          url: repoLink,
          altText: image.altText,
        },
      };
    }
    if (!image && productSubCategory.image) {
      imageData = {
        delete: true,
      };
    }

    const updatedProductSubCategory = await prisma.productSubCategory.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        index,
        displayInNavigation,
        isActive,
        image: imageData,
        productCategory: productCategory
          ? {
              connect: {
                id: parseInt(productCategory),
              },
            }
          : undefined,
      },
      include: {
        image: true,
      },
    });

    return { updatedProductSubCategory, createdProductSubCategory: null };
  } else throw new Error("No ID Provided");
};

export const deleteProductSubCategory = async (
  id: string
): Promise<ProductSubCategory> => {
  const productSubCategory = await prisma.productSubCategory.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!productSubCategory) {
    throw new Error("Product Sub Category Not Found");
  }
  // Delete the productSubCategory
  return await prisma.productSubCategory.delete({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchProductSubCategories = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
): Promise<{
  productSubCategories: ProductSubCategory[];
  totalPages: number;
}> => {
  const name =
    formData?.name || (url && url.searchParams.get("name")?.toString()) || "";
  const productCategory =
    formData?.name ||
    (url && url.searchParams.get("productCategory")?.toString()) ||
    "";
  const sortBy =
    formData?.name || (url && url.searchParams.get("sortBy")?.toString()) || "";
  const sortOrder =
    formData?.name ||
    (url && url.searchParams.get("sortOrder")?.toString()) ||
    "";
  const pageNumber =
    (formData?.pageNumber && parseInt(formData.pageNumber as string)) ||
    (url && Number(url.searchParams.get("pageNumber"))) ||
    1;
  const perPage =
    (formData?.perPage && parseInt(formData.perPage as string)) ||
    (url && Number(url.searchParams.get("perPage"))) ||
    10;

  const skip = (pageNumber - 1) * perPage;
  let take = perPage;

  const whereClause: { [key: string]: any } = {};

  if (name) {
    whereClause.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (productCategory) {
    whereClause.productCategory = {
      id: parseInt(productCategory as string),
    };
  }

  // Find and count the root categories
  const [productSubCategories, totalProductSubCategories] = await Promise.all([
    prisma.productSubCategory.findMany({
      where: whereClause,
      include: {
        productCategory: true,
      },
      skip,
      take,
      orderBy: getOrderBy(sortBy as SortBy, sortOrder as SortOrder),
    }),
    prisma.productSubCategory.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalProductSubCategories / perPage);

  return { productSubCategories, totalPages };
};
