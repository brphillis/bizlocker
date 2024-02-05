import { getBlocks } from "~/models/Blocks/index.server";
import { getHomePage } from "~/models/HomePage/index.server";
import { json, type MetaFunction } from "@remix-run/node";

export const meta: MetaFunction<typeof homeLoader> = ({ data }) => {
  const loaderData = data as MetaType;

  return [
    { title: loaderData?.title },
    {
      name: loaderData?.title,
      content: loaderData?.description,
    },
  ];
};

export const homeLoader = async () => {
  const homePage = await getHomePage();
  let title, description, backgroundColor, blocks;

  if (homePage) {
    blocks = await getBlocks(homePage);
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
