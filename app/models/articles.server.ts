import { prisma } from "~/db.server";

export const getArticle = async (id: string) => {
  return await prisma.article.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      articleCategories: {
        select: {
          id: true,
          name: true,
        },
      },
      images: true,
    },
  });
};

export const upsertArticle = async (articleData: any) => {
  const { title, content, articleCategories, isActive, images, id } =
    articleData;

  if (!id) {
    return await prisma.article.create({
      data: {
        title,
        content,
        isActive,
        articleCategories: {
          connect: articleCategories.map((category: string) => ({
            name: category,
          })),
        },
        images:
          images && images.length > 0
            ? {
                create: images.map((image: Image) => ({
                  url: image.url,
                  altText: image.altText,
                })),
              }
            : undefined,
      },
      include: {
        images: true,
      },
    });
  } else {
    // Retrieve the existing article including the associated images and categories
    const existingArticle = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        articleCategories: true,
        images: true,
      },
    });

    // Delete the old images associated with the article
    await prisma.image.deleteMany({
      where: {
        id: { in: existingArticle?.images.map((image) => image.id) },
      },
    });

    // Disconnect the existing categories from the article
    await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        articleCategories: { set: [] },
      },
    });

    // Update the article with new images and categories
    return await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        isActive,
        articleCategories: {
          connect: articleCategories.map((articleCategory: string) => ({
            name: articleCategory,
          })),
        },
        images:
          images && images.length > 0
            ? {
                create: images.map((image: Image) => ({
                  url: image.url,
                  altText: image.altText,
                })),
              }
            : undefined,
      },
      include: {
        images: true,
      },
    });
  }
};

export const deleteArticle = async (id: string) => {
  const brand = await prisma.article.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!brand) {
    return false;
  }

  return await prisma.article.delete({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchArticles = async (searchArgs: BasicSearchArgs) => {
  const { title, category, page = 1, perPage = 10 } = searchArgs;

  const skip = (page - 1) * perPage;
  const take = perPage;

  // Construct a filter based on the search parameters provided
  const filter: { [key: string]: any } = {};

  if (title) {
    filter.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  if (category) {
    filter.categories = {
      some: {
        name: {
          equals: category,
          mode: "insensitive",
        },
      },
    };
  }

  // Find and count the articles
  const [articles, totalArticles] = await Promise.all([
    prisma.article.findMany({
      where: filter,
      include: {
        articleCategories: {
          select: {
            id: true,
            name: true,
          },
        },
        images: true,
      },
      skip,
      take,
    }),
    prisma.article.count({
      where: filter,
    }),
  ]);

  const totalPages = Math.ceil(totalArticles / perPage);

  return { articles, totalPages };
};
