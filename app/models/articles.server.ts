import { redirect } from "@remix-run/server-runtime";
import { prisma } from "~/db.server";
import { getOrderBy } from "./products.server";

export const getArticle = async (id?: string, title?: string) => {
  let whereClause;

  if (id) {
    whereClause = { id: parseInt(id) };
  } else if (title) {
    whereClause = { title: title };
  } else {
    throw new Error("Either id or name must be specified");
  }

  return await prisma.article.findUnique({
    where: whereClause,
    include: {
      blocks: {
        include: {
          bannerBlock: {
            include: {
              campaign: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
              promotion: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
            },
          },
          tileBlock: {
            include: {
              campaigns: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
              promotions: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
            },
          },
          textBlock: true,
          productBlock: {
            include: {
              content: {
                include: {
                  rootCategory: true,
                  productCategory: true,
                  brand: true,
                },
              },
            },
          },
        },
      },
      articleCategories: {
        select: {
          id: true,
          name: true,
        },
      },
      thumbnail: true,
    },
  });
};

export const upsertArticleInfo = async (
  title: string,
  articleCategories: string[],
  thumbnail: Image,
  articleId?: number
) => {
  let article;

  if (!articleId) {
    article = await prisma.article.create({
      // Provide the desired properties for the new article
      data: {
        title: title,
        articleCategories: {
          connect: articleCategories.map((category: string) => ({
            id: parseInt(category),
          })),
        },
        thumbnail: {
          create: {
            url: thumbnail.url,
            altText: thumbnail.altText,
          },
        },
      },
    });
  } else {
    // Retrieve the article by articleId
    article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!article) {
      throw new Error(`Article not found for articleId: ${articleId}`);
    }

    // Disconnect the existing categories from the article
    await prisma.article.update({
      where: { id: articleId },
      data: {
        articleCategories: { set: [] },
        // thumbnail: { disconnect: true },
      },
    });

    // Update the existing article's title and thumbnail
    article = await prisma.article.update({
      where: {
        id: article.id,
      },
      data: {
        title: title,
        articleCategories: {
          connect: articleCategories.map((category: string) => ({
            id: parseInt(category),
          })),
        },
        thumbnail: {
          update: {
            url: thumbnail.url,
            altText: thumbnail.altText,
          },
        },
      },
    });
  }

  return article.id;
};

export const deleteArticle = async (id: number) => {
  const article = await prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      blocks: {
        include: {
          bannerBlock: true,
          tileBlock: true,
          textBlock: true,
          blockOptions: true,
        },
      },
    },
  });

  if (!article) {
    return false;
  }

  // Delete blockOptions associated with each block
  for (const block of article.blocks) {
    if (block.blockOptions) {
      await prisma.blockOptions.delete({
        where: { id: block.blockOptions.id },
      });
    }
  }

  // Delete bannerBlocks, tileBlocks, and textBlocks associated with each block
  for (const block of article.blocks) {
    if (block.bannerBlock) {
      await prisma.bannerBlock.delete({ where: { id: block.bannerBlock.id } });
    }
    if (block.tileBlock) {
      await prisma.tileBlock.delete({ where: { id: block.tileBlock.id } });
    }
    if (block.textBlock) {
      await prisma.textBlock.delete({ where: { id: block.textBlock.id } });
    }
  }

  // Delete blocks associated with the article
  await prisma.block.deleteMany({ where: { articleId: id } });

  // Delete the article
  await prisma.article.delete({
    where: {
      id,
    },
  });

  return redirect("/admin/articles");
};

export const searchArticles = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
) => {
  const title =
    formData?.title || (url && url.searchParams.get("title")?.toString()) || "";
  const articleCategory =
    formData?.articleCategory || url?.searchParams.get("articleCategory") || "";
  const sortBy = formData?.sortBy || url?.searchParams.get("sortBy") || "";
  const sortOrder =
    formData?.sortOrder || url?.searchParams.get("sortOrder") || "";
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

  // Construct a filter based on the search parameters provided
  const filter: { [key: string]: any } = {};

  if (title) {
    filter.title = {
      contains: title,
      mode: "insensitive",
    };
  }

  if (articleCategory) {
    filter.articleCategories = {
      some: {
        id: parseInt(articleCategory as string),
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
        thumbnail: true,
      },
      skip,
      take,
      orderBy: getOrderBy(sortBy as SortBy, sortOrder as SortOrder),
    }),
    prisma.article.count({
      where: filter,
    }),
  ]);

  const totalPages = Math.ceil(totalArticles / perPage);

  return { articles, totalPages };
};
