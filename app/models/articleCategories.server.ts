import { prisma } from "~/db.server";

export const getArticleCategories = async (articleId?: string) => {
  if (!articleId) {
    return await prisma.articleCategory.findMany({
      include: {
        productCategory: {
          include: {
            articleCategories: true,
            productSubCategories: true,
          },
        },
      },
    });
  } else {
    return await prisma.articleCategory.findUnique({
      where: {
        id: parseInt(articleId),
      },
    });
  }
};

export const upsertArticleCategories = async (name: string, id?: string) => {
  if (!id) {
    return await prisma.articleCategory.create({
      data: {
        name: name,
      },
    });
  } else {
    return await prisma.articleCategory.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
      },
    });
  }
};

export const deleteArticleCategory = async (id: string) => {
  const articleCategory = await prisma.articleCategory.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!articleCategory) {
    return false;
  }
  // Delete the brand
  return await prisma.articleCategory.delete({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchArticleCategories = async (searchArgs: BasicSearchArgs) => {
  const { name, page, perPage } = searchArgs;

  let articleCategories;
  let totalArticleCategories;

  const skip = (page - 1) * perPage;
  let take = perPage;
  if (perPage !== undefined) {
    if (name) {
      articleCategories = await prisma.articleCategory.findMany({
        where: {
          OR: [
            {
              name: {
                contains: name || "",
                mode: "insensitive",
              },
            },
          ],
        },
        skip,
        take,
      });

      const totalCount = await prisma.articleCategory.count({
        where: {
          OR: [
            {
              name: {
                contains: name || "",
                mode: "insensitive",
              },
            },
          ],
        },
      });

      totalArticleCategories = totalCount;
    } else {
      articleCategories = await prisma.articleCategory.findMany({
        skip,
        take,
      });

      totalArticleCategories = await prisma.articleCategory.count();
    }
    // Update `take` for the last page if needed
    if (skip + take > totalArticleCategories) {
      take = totalArticleCategories - skip;
    }
  } else {
    // Retrieve all articles without pagination
    articleCategories = await prisma.articleCategory.findMany();
    totalArticleCategories = articleCategories.length;
  }

  const totalPages = Math.ceil(
    totalArticleCategories / (Number(perPage) || 10)
  );

  return { articleCategories, totalPages };
};
