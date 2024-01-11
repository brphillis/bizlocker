import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { getArticleCategories } from "~/models/articleCategories.server";
import { searchArticles } from "~/models/articles.server";

export const articleSearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const { articles, totalPages } = await searchArticles(undefined, url);
  const articleCategories = await getArticleCategories();

  return json({ articles, totalPages, articleCategories });
};
