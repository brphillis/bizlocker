import { Params } from "@remix-run/react";
import { getBlocks } from "~/models/blocks.server";
import { getHomePage } from "~/models/homePage.server";
import { json, type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction<typeof homeLoader> = ({ data }: any) => {
  return [
    { title: data?.title },
    {
      name: data?.title,
      content: data?.description,
    },
  ];
};

export const homeLoader = async (request: Request, params: Params<string>) => {
  const homePage = await getHomePage();
  let title, description, backgroundColor, blocks;

  if (homePage) {
    blocks = await getBlocks(homePage, true);
    title = homePage.title;
    description = homePage.description;
    backgroundColor = homePage.backgroundColor;
  }

  return json({
    blocks,
    title,
    description,
    backgroundColor,
  });
};
