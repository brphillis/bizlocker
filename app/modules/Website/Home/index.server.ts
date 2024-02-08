import { getBlocks } from "~/models/Blocks/index.server";
import { getHomePage } from "~/models/HomePage/index.server";
import { json } from "@remix-run/node";

export const homeLoader = async () => {
  const homePage = await getHomePage();

  let title, description, backgroundColor, blocks;

  if (homePage) {
    blocks = await getBlocks(homePage);
    title = homePage.title;
    description = homePage.description;
    backgroundColor = homePage.backgroundColor;
  }

  const meta = {
    title,
    description,
  };

  return json({
    meta,
    blocks,
    title,
    description,
    backgroundColor,
  });
};
