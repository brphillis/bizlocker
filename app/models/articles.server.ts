import { type TypedResponse, redirect } from "@remix-run/server-runtime";
import type { Article, ArticleCategory, PreviewPage } from "@prisma/client";
import { prisma } from "~/db.server";
import { includeBlocksData } from "~/utility/blockMaster";
import { getOrderBy } from "~/helpers/sortHelpers";
import { type PageBlock, removeBlock } from "./pageBuilder.server";
import { getBlocks } from "~/helpers/blockHelpers";
import type { ImageWithDetails } from "./images.server";

export interface ArticleWithContent extends Article {
  articleCategories: ArticleCategory[] | null;
  blocks: BlockWithBlockOptions[] | null;
  previewPage: PreviewPage[] | null;
  thumbnail: ImageWithDetails | null;
}

export const getArticle = async (
  id?: string,
  title?: string
): Promise<Article | null> => {
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
      blocks: includeBlocksData,
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

export const deleteArticle = async (
  id: number
): Promise<TypedResponse<never>> => {
  const article = await prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      blocks: includeBlocksData,
    },
  });

  if (!article) {
    throw new Error("Article Not Found");
  }

  //find and delete the associated blocks
  const articleBlocks = await getBlocks(article as any);

  articleBlocks.map((e: PageBlock) => removeBlock(e.id, e.name));

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
): Promise<{ articles: Article[]; totalPages: number }> => {
  const title =
    formData?.title || (url && url.searchParams.get("title")?.toString()) || "";
  const articleCategory =
    formData?.articleCategory || url?.searchParams.get("articleCategory") || "";
  const isActive =
    formData?.isActive || url?.searchParams.get("isActive") || "";

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

  if (isActive) {
    filter.isActive = true;
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
