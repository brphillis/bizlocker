import { prisma } from "~/db.server";
import { getOrderBy } from "~/helpers/sortHelpers";
import { Image, ProductSubCategory } from "@prisma/client";
import { uploadImage_Integration } from "~/integrations/_master/storage";
import { NewProductSubCategory, ProductSubCategoryWithDetails } from "./types";
import { buildImageUpdateQuery } from "../Images/index.server";

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
  id: string,
): Promise<ProductSubCategoryWithDetails | null> => {
  return await prisma.productSubCategory.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      tileImage: true,
      maleImage: true,
      femaleImage: true,
      kidImage: true,
    },
  });
};

export const upsertProductSubCategory = async (
  categoryData: NewProductSubCategory,
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
    tileImage,
    maleImage,
    femaleImage,
    kidImage,
    gender,
  } = categoryData;

  if (!id && tileImage) {
    const buildImageCreateQuery = async (image?: Image | null) => {
      if (image) {
        const repoLink = await uploadImage_Integration(image);

        if (repoLink) {
          return {
            create: {
              href: repoLink,
              altText: image?.altText,
            },
          };
        } else return undefined;
      } else return undefined;
    };

    const maleImageCreateQuery = await buildImageCreateQuery(maleImage);

    const createdProductSubCategory = await prisma.productSubCategory.create({
      data: {
        name: name,
        index,
        displayInNavigation,
        isActive,
        gender: gender || undefined,
        tileImage: await buildImageCreateQuery(tileImage),
        maleImage: maleImageCreateQuery,
        femaleImage: await buildImageCreateQuery(femaleImage),
        kidImage: await buildImageCreateQuery(kidImage),
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
        tileImage: true,
        maleImage: true,
        femaleImage: true,
        kidImage: true,
      },
    });

    if (!productSubCategory) {
      throw new Error("Category not found");
    }

    const maleImageUpdateQuery = await buildImageUpdateQuery(
      maleImage,
      productSubCategory?.maleImage,
    );

    const updatedProductSubCategory = await prisma.productSubCategory.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        index,
        displayInNavigation,
        isActive,
        gender: gender || undefined,
        tileImage: await buildImageUpdateQuery(
          tileImage,
          productSubCategory?.tileImage,
        ),
        maleImage: maleImageUpdateQuery,
        femaleImage: await buildImageUpdateQuery(
          femaleImage,
          productSubCategory?.femaleImage,
        ),
        kidImage: await buildImageUpdateQuery(
          kidImage,
          productSubCategory?.kidImage,
        ),
        productCategory: productCategory
          ? {
              connect: {
                id: parseInt(productCategory),
              },
            }
          : undefined,
      },
      include: {
        tileImage: true,
      },
    });

    return { updatedProductSubCategory, createdProductSubCategory: null };
  } else throw new Error("No ID Provided");
};

export const deleteProductSubCategory = async (
  id: string,
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
  url?: URL,
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
  const take = perPage;

  const whereClause: { [key: string]: unknown } = {};

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
