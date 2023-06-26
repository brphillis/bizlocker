import { prisma } from "~/db.server";
export type { RootCategory } from "@prisma/client";

export const getRootCategories = async (id?: RootCategory["id"]) => {
  let rootCategories;
  let rootCategory;

  if (!id) {
    rootCategories = prisma.rootCategory.findMany();
  } else {
    rootCategory = prisma.rootCategory.findUnique({
      where: {
        id: id,
      },
    });
    rootCategories = [rootCategory];
  }

  if (!id) {
    return rootCategories;
  } else {
    return rootCategory;
  }
};

export const searchRootCategories = async (searchArgs: BasicSearchArgs) => {
  const { name, productcategoryname, articlecategoryname, page, perPage } =
    searchArgs;

  let rootCategories;
  let totalRootCategories;

  const skip = (page - 1) * perPage;
  let take = perPage;

  let whereClause = {};

  // Construct a where clause based on the search parameters provided
  if (name) {
    whereClause = {
      name: {
        contains: name,
        mode: "insensitive",
      },
    };
  } else if (productcategoryname) {
    whereClause = {
      productCategories: {
        some: {
          name: {
            contains: productcategoryname,
            mode: "insensitive",
          },
        },
      },
    };
  } else if (articlecategoryname) {
    whereClause = {
      articleCategories: {
        some: {
          name: {
            contains: articlecategoryname,
            mode: "insensitive",
          },
        },
      },
    };
  }

  // Find and count the root categories
  rootCategories = await prisma.rootCategory.findMany({
    where: whereClause,
    include: {
      department: true,
      articleCategories: true,
      productCategories: true,
    },
    skip,
    take,
  });

  totalRootCategories = await prisma.rootCategory.count({
    where: whereClause,
  });

  // Update `take` for the last page if needed
  if (skip + take > totalRootCategories) {
    take = totalRootCategories - skip;
  }

  const totalPages = Math.ceil(totalRootCategories / (Number(perPage) || 10));

  return { rootCategories, totalPages };
};
