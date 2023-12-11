import type {
  ArticleBlockContent,
  ArticleCategory,
  PreviewPage,
} from "@prisma/client";
import type { ArticleWithContent } from "./articles.server";
import type { ProductCategoryWithDetails } from "./productCategories.server";
import { prisma } from "~/db.server";

export interface ArticleCategoryWithDetails extends ArticleCategory {
  articleBlockContent?: ArticleBlockContent[] | null;
  articles?: ArticleWithContent[] | null;
  previewPages?: PreviewPage[] | null;
  productCategory?: ProductCategoryWithDetails | null;
}

export const getArticleCategories = async (): Promise<
  ArticleCategoryWithDetails[]
> => {
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
};

export const getArticleCategory = async (
  articleId: string
): Promise<ArticleCategory | null> => {
  return await prisma.articleCategory.findUnique({
    where: {
      id: parseInt(articleId),
    },
  });
};

export const upsertArticleCategory = async (
  name: string,
  id?: string
): Promise<ArticleCategory> => {
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

export const deleteArticleCategory = async (
  id: string
): Promise<ArticleCategory | null> => {
  return await prisma.articleCategory.findUnique({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchArticleCategories = async (
  searchArgs: BasicSearchArgs
): Promise<{ articleCategories: ArticleCategory[]; totalPages: number }> => {
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
