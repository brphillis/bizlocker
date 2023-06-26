import { prisma } from "~/db.server";

export const searchArticles = async (searchArgs: BasicSearchArgs) => {
  const { title, category, page, perPage } = searchArgs;

  let articles;
  let totalArticles;

  if (perPage !== undefined) {
    const skip = (page - 1) * perPage;
    const take = perPage;
    const filter: any = {};

    if (title) {
      // Filter articles based on title
      filter.title = {
        contains: title,
        mode: "insensitive",
      };
    }

    if (category) {
      // Filter articles based on category
      filter.categories = {
        some: {
          name: {
            equals: category,
            mode: "insensitive",
          },
        },
      };
    }

    // Retrieve articles based on the filter
    articles = await prisma.article.findMany({
      where: filter,
      include: {
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
        images: true,
      },
      skip,
      take,
    });

    // Count total articles matching the filter
    totalArticles = await prisma.article.count({
      where: filter,
    });
  } else {
    // Retrieve all articles without pagination
    articles = await prisma.article.findMany({
      include: {
        categories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    totalArticles = articles.length;
  }

  const totalPages = Math.ceil(totalArticles / (Number(perPage) || 10));

  return { articles, totalPages };
};
