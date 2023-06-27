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
  const { id, name, departmentName, articleCategories, productCategories } =
    categoryData;

  if (!id) {
    // Create a new root category
    const createData: any = {
      name,
    };

    if (departmentName) {
      const existingDepartment = await prisma.department.findUnique({
        where: { name: departmentName },
      });

      if (!existingDepartment) {
        throw new Error("Department not found");
      }

      createData.department = {
        connect: {
          id: existingDepartment.id,
        },
      };
    }

    if (articleCategories) {
      const existingArticleCategories = await prisma.articleCategory.findMany({
        where: { name: { in: articleCategories } },
      });

      createData.articleCategories = {
        connect: existingArticleCategories.map((category) => ({
          id: category.id,
        })),
      };
    }

    if (productCategories) {
      const existingProductCategories = await prisma.productCategory.findMany({
        where: { name: { in: productCategories } },
      });

      createData.productCategories = {
        connect: existingProductCategories.map((category) => ({
          id: category.id,
        })),
      };
    }

    return await prisma.rootCategory.create({
      data: createData,
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

    const updateData: any = {
      name,
    };

    if (departmentName) {
      const existingDepartment = await prisma.department.findUnique({
        where: { name: departmentName },
      });

      if (!existingDepartment) {
        throw new Error("Department not found");
      }

      updateData.department = {
        connect: {
          id: existingDepartment.id,
        },
      };
    }

    if (articleCategories) {
      const existingArticleCategories = await prisma.articleCategory.findMany({
        where: { name: { in: articleCategories } },
      });

      // Disconnect old article categories
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
        },
      });

      updateData.articleCategories = {
        connect: existingArticleCategories.map((category) => ({
          id: category.id,
        })),
      };
    } else {
      // Disconnect old article categories
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
        },
      });

      updateData.articleCategories = {
        set: [],
      };
    }

    if (productCategories) {
      const existingProductCategories = await prisma.productCategory.findMany({
        where: { name: { in: productCategories } },
      });

      // Disconnect old product categories
      await prisma.rootCategory.update({
        where: { id: parseInt(id) },
        data: {
          productCategories: {
            disconnect: existingRootCategory.productCategories.map(
              (category) => ({
                id: category.id,
              })
            ),
          },
        },
      });

      updateData.productCategories = {
        connect: existingProductCategories.map((category) => ({
          id: category.id,
        })),
      };
    } else {
      // Disconnect old product categories
      await prisma.rootCategory.update({
        where: { id: parseInt(id) },
        data: {
          productCategories: {
            disconnect: existingRootCategory.productCategories.map(
              (category) => ({
                id: category.id,
              })
            ),
          },
        },
      });

      updateData.productCategories = {
        set: [],
      };
    }

    return await prisma.rootCategory.update({
      where: { id: parseInt(id) },
      data: updateData,
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
    productcategoryname,
    articlecategoryname,
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

  if (productcategoryname) {
    whereClause.productCategories = {
      some: {
        name: {
          contains: productcategoryname,
          mode: "insensitive",
        },
      },
    };
  }

  if (articlecategoryname) {
    whereClause.articleCategories = {
      some: {
        name: {
          contains: articlecategoryname,
          mode: "insensitive",
        },
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
