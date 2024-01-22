import { type TypedResponse, redirect } from "@remix-run/server-runtime";
import type {
  Article,
  ArticleCategory,
  Image,
  PreviewPage,
} from "@prisma/client";
import { getBlocks, type BlockWithBlockOptions } from "./blocks.server";
import { prisma } from "~/db.server";
import { buildBlocksContentQuery } from "~/utility/blockMaster/blockMaster";
import { getOrderBy } from "~/helpers/sortHelpers";
import {
  type BlockWithContent,
  disconnectBlock,
  Page,
} from "./pageBuilder.server";

export interface ArticleWithContent extends Article {
  articleCategories?: ArticleCategory[] | null;
  blocks?: BlockWithBlockOptions[] | null;
  previewPage?: PreviewPage[] | null;
  thumbnail?: Image | null;
}

export const getArticle = async (
  id?: string,
  title?: string,
): Promise<Article | null> => {
  let whereClause;

  if (id) {
    whereClause = { id: parseInt(id) };
  } else if (title) {
    whereClause = { title: title };
  } else {
    throw new Error("Either id or name must be specified");
  }

  // get the article
  const article = await prisma.article.findUnique({
    where: whereClause,
    include: {
      blocks: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!article) {
    throw new Error(`No article Found`);
  }

  // get the article with appropriate content
  // this avoids doing nested queries to all content types to begin with
  // and only querying for relevant content assosiated with the pages active blocks

  if (article.blocks) {
    // get the homepage
    const articleWithContent = (await prisma.article.findUnique({
      where: whereClause,
      include: {
        blocks: {
          include: {
            blockOptions: true,
            content: buildBlocksContentQuery(article.blocks),
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
    })) as unknown as Page;

    return articleWithContent;
  } else {
    throw new Error(`Page has No Content`);
  }
};

export const deleteArticle = async (
  id: number,
): Promise<TypedResponse<never>> => {
  const article = await prisma.article.findUnique({
    where: {
      id,
    },
    include: {
      blocks: {
        include: {
          blockOptions: true,
          content: true,
        },
      },
    },
  });

  if (!article) {
    throw new Error("Article Not Found");
  }

  //find and delete the associated blocks
  const articleBlocks = await getBlocks(article as any);

  if (articleBlocks) {
    await Promise.all(
      articleBlocks.map(
        async (e: BlockWithContent) =>
          await disconnectBlock(e.id.toString(), e.name),
      ),
    );

    // Delete the article
    await prisma.article.delete({
      where: {
        id,
      },
    });
  }

  return redirect("/admin/articles");
};

export const searchArticles = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL,
): Promise<{ articles: ArticleWithContent[]; totalPages: number }> => {
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
        articleCategories: true,
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
