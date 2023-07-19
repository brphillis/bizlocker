import { prisma } from "~/db.server";
export type { RootCategory } from "@prisma/client";

export const getRootCategories = async () => {
  return prisma.rootCategory.findMany({
    include: {
      productCategories: true,
      articleCategories: true,
      department: true,
    },
  });
};

export const getRootCategory = async (id: string) => {
  return await prisma.rootCategory.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      articleCategories: true,
      productCategories: true,
      department: true,
    },
  });
};

export const upsertRootCategory = async (categoryData: any) => {
  const { id, name, department, articleCategories, productCategories } =
    categoryData;

  const data: any = {
    name,
  };

  if (department) {
    data.department = {
      connect: { id: parseInt(department) },
    };
  }

  if (articleCategories && articleCategories.length > 0) {
    data.articleCategories = {
      connect: articleCategories
        .filter((categoryId: any) => !isNaN(parseInt(categoryId)))
        .map((categoryId: any) => ({
          id: parseInt(categoryId),
        })),
    };
  }

  if (productCategories && productCategories.length > 0) {
    data.productCategories = {
      connect: productCategories
        .filter((categoryId: any) => !isNaN(parseInt(categoryId)))
        .map((categoryId: any) => ({
          id: parseInt(categoryId),
        })),
    };
  }

  if (!id) {
    return await prisma.rootCategory.create({
      data,
      include: {
        articleCategories: true,
        productCategories: true,
      },
    });
  } else {
    const existingRootCategory = await prisma.rootCategory.findUnique({
      where: { id: parseInt(id) },
      include: {
        articleCategories: true,
        productCategories: true,
      },
    });

    if (!existingRootCategory) {
      throw new Error("Root category not found");
    }

    // Disconnect old article and product categories
    await prisma.rootCategory.update({
      where: { id: parseInt(id) },
      data: {
        articleCategories: {
          disconnect: existingRootCategory.articleCategories.map(
            (category) => ({
              id: category.id,
            })
          ),
        },
        productCategories: {
          disconnect: existingRootCategory.productCategories.map(
            (category) => ({
              id: category.id,
            })
          ),
        },
      },
    });

    return await prisma.rootCategory.update({
      where: { id: parseInt(id) },
      data,
      include: {
        articleCategories: true,
        productCategories: true,
      },
    });
  }
};

export const searchRootCategories = async (searchArgs: BasicSearchArgs) => {
  const {
    name,
    productCategory,
    articleCategory,
    page = 1,
    perPage = 10,
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

  if (productCategory) {
    whereClause.productCategories = {
      some: {
        id: parseInt(productCategory),
      },
    };
  }

  if (articleCategory) {
    whereClause.articleCategories = {
      some: {
        id: parseInt(articleCategory),
      },
    };
  }

  // Find and count the root categories
  const [rootCategories, totalRootCategories] = await Promise.all([
    prisma.rootCategory.findMany({
      where: whereClause,
      include: {
        department: true,
        articleCategories: true,
        productCategories: true,
      },
      skip,
      take,
    }),
    prisma.rootCategory.count({
      where: whereClause,
    }),
  ]);

  const totalPages = Math.ceil(totalRootCategories / perPage);

  return { rootCategories, totalPages };
};
