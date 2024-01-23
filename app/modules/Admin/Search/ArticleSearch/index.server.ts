import { json } from "@remix-run/node";
import { getArticleCategories } from "~/models/ArticleCategories/index.server";
import { searchArticles } from "~/models/Articles/index.server";

export const articleSearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const { articles, totalPages } = await searchArticles(undefined, url);
  const articleCategories = await getArticleCategories();

  return json({ articles, totalPages, articleCategories });
};
