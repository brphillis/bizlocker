import { Params } from "@remix-run/react";
import { getBlocks } from "~/models/blocks.server";
import { getArticle } from "~/models/articles.server";
import { json, type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction<typeof articleLoader> = ({ data }: any) => {
  return [
    { title: data?.title },
    {
      name: data?.title,
      content: data?.description,
    },
  ];
};

export const articleLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const articleName = params.pagel2;
  const article = await getArticle(undefined, articleName);

  if (!article || (article && !article.isActive)) {
    throw new Response(null, {
      status: 404,
      statusText: "Page Not Found",
    });
  }

  let title, description, backgroundColor, blocks;

  if (article) {
    blocks = await getBlocks(article as any, true);
    title = article.title;
    description = article.description;
    backgroundColor = article.backgroundColor;
  }

  return json({
    title,
    description,
    backgroundColor,
    blocks,
    articleName,
  });
};
