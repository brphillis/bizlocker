import { prisma } from "~/db.server";
import { getOrderBy } from "~/utility/sortHelpers";

export const getProductSubCategories = async () => {
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

export const getProductSubCategory = async (id: string) => {
  return await prisma.productSubCategory.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      image: true,
    },
  });
};

export const upsertProductSubCategory = async (categoryData: any) => {
  const { id, index, displayInNavigation, isActive, name, image } =
    categoryData;

  let updatedProductSubCategory;

  if (!id && image) {
    updatedProductSubCategory = await prisma.productSubCategory.create({
      data: {
        name: name,
        index,
        displayInNavigation,
        isActive,
        image: {
          create: {
            url: image.url,
            altText: image.altText,
          },
        },
      },
    });
  }
  if (!id && !image) {
    updatedProductSubCategory = await prisma.productSubCategory.create({
      data: {
        name: name,
        index,
        displayInNavigation,
        isActive,
      },
    });
  } else if (id) {
    const existingProductSubCategory =
      await prisma.productSubCategory.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          image: true,
        },
      });

    if (!existingProductSubCategory) {
      throw new Error("Category not found");
    }

    let imageData = {};

    if (image && existingProductSubCategory.image) {
      imageData = {
        update: {
          url: image.url,
          altText: image.altText,
        },
      };
    }
    if (image && !existingProductSubCategory.image) {
      imageData = {
        create: {
          url: image.url,
          altText: image.altText,
        },
      };
    }
    if (!image && existingProductSubCategory.image) {
      imageData = {
        delete: true,
      };
    }

    updatedProductSubCategory = await prisma.productSubCategory.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        index,
        displayInNavigation,
        isActive,
        image: imageData,
      },
      include: {
        image: true,
      },
    });
  }

  return updatedProductSubCategory;
};

export const deleteProductSubCategory = async (id: string) => {
  const productSubCategory = await prisma.productSubCategory.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!productSubCategory) {
    return false;
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
) => {
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
      orderBy: getOrderBy(sortBy as CategorySortBy, sortOrder as SortOrder),
    }),
    prisma.productSubCategory.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalProductSubCategories / perPage);

  return { productSubCategories, totalPages };
};
