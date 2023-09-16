import { prisma } from "~/db.server";
import { getOrderBy } from "~/utility/sortHelpers";
export type { ProductCategory } from "@prisma/client";

export const getProductCategories = async () => {
  return prisma.productCategory.findMany({
    include: {
      productSubCategories: true,
      articleCategories: true,
      department: true,
    },
  });
};

export const getProductCategory = async (id: string) => {
  return await prisma.productCategory.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      articleCategories: true,
      productSubCategories: true,
      department: true,
    },
  });
};

export const upsertProductCategory = async (categoryData: any) => {
  const {
    id,
    index,
    name,
    displayInNavigation,
    isActive,
    department,
    articleCategories,
    productSubCategories,
  } = categoryData;

  const data: any = {
    name,
    index,
    displayInNavigation,
    isActive,
  };

  if (department) {
    data.department = {
      connect: { id: parseInt(department) },
    };
  }

  if (articleCategories && articleCategories.length > 0) {
    data.articleCategories = {
      set: articleCategories
        .filter((categoryId: any) => !isNaN(parseInt(categoryId)))
        .map((categoryId: any) => ({
          id: parseInt(categoryId),
        })),
    };
  }

  if (productSubCategories && productSubCategories.length > 0) {
    data.productSubCategories = {
      set: productSubCategories
        .filter((categoryId: any) => !isNaN(parseInt(categoryId)))
        .map((categoryId: any) => ({
          id: parseInt(categoryId),
        })),
    };
  }

  if (!id) {
    return await prisma.productCategory.create({
      data,
      include: {
        articleCategories: true,
        productSubCategories: true,
      },
    });
  } else {
    const existingProductCategory = await prisma.productCategory.findUnique({
      where: { id: parseInt(id) },
      include: {
        articleCategories: true,
        productSubCategories: true,
      },
    });

    if (!existingProductCategory) {
      throw new Error("Root category not found");
    }

    // Disconnect old article and product categories
    await prisma.productCategory.update({
      where: { id: parseInt(id) },
      data: {
        articleCategories: {
          disconnect: existingProductCategory.articleCategories.map(
            (category) => ({
              id: category.id,
            })
          ),
        },
        productSubCategories: {
          disconnect: existingProductCategory.productSubCategories.map(
            (category) => ({
              id: category.id,
            })
          ),
        },
      },
    });

    return await prisma.productCategory.update({
      where: { id: parseInt(id) },
      data,
      include: {
        articleCategories: true,
        productSubCategories: true,
      },
    });
  }
};

export const searchProductCategories = async (searchArgs: BasicSearchArgs) => {
  const {
    name,
    department,
    productSubCategory,
    page = 1,
    perPage = 10,
    sortBy,
    sortOrder,
  } = searchArgs;

  const skip = (page - 1) * perPage;
  const take = perPage;

  // Construct a where clause based on the search parameters provided
  const whereClause: { [key: string]: any } = {};

  if (name) {
    whereClause.name = {
      contains: name,
      mode: "insensitive",
    };
  }
  if (department) {
    whereClause.department = {
      id: parseInt(department),
    };
  }

  if (productSubCategory) {
    whereClause.productSubCategories = {
      some: {
        id: parseInt(productSubCategory),
      },
    };
  }

  // Find and count the root categories
  const [productCategories, totalProductCategories] = await Promise.all([
    prisma.productCategory.findMany({
      where: whereClause,
      include: {
        department: true,
        articleCategories: true,
        productSubCategories: true,
      },
      skip,
      take,
      orderBy: getOrderBy(sortBy as CategorySortBy, sortOrder as SortOrder),
    }),
    prisma.productCategory.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalProductCategories / perPage);

  return { productCategories, totalPages };
};
