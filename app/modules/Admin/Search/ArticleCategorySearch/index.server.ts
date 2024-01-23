import { json } from "@remix-run/node";
import { searchArticleCategories } from "~/models/ArticleCategories/index.server";

export const articleCategorySearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const searchQuery = {
    name: url.searchParams.get("name")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("perPage")) || 10,
  };

  const { articleCategories, totalPages } =
    await searchArticleCategories(searchQuery);

  return json({ articleCategories, totalPages });
};
