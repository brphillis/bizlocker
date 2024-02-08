import { json, redirect } from "@remix-run/node";
import { Params } from "@remix-run/react";
import { getBlocks } from "~/models/Blocks/index.server";
import { getWebPage } from "~/models/WebPages/index.server";
import { capitalizeWords } from "~/helpers/stringHelpers";

export const webPageLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const pageUrlSegment = params.pagel1;

  if (pageUrlSegment === "favicon.ico") {
    return redirect("/");
  }

  const webPage = await getWebPage(undefined, pageUrlSegment);

  if (!webPage || (webPage && !webPage.isActive)) {
    throw new Response(null, {
      status: 404,
      statusText: "Page Not Found",
    });
  }

  let title, description, backgroundColor, blocks;

  if (webPage) {
    blocks = await getBlocks(webPage);
    title = capitalizeWords(webPage.title);
    description = capitalizeWords(webPage.description);
    backgroundColor = webPage.backgroundColor;
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
