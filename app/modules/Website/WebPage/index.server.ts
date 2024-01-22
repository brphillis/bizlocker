import { json, redirect } from "@remix-run/node";
import { Params } from "@remix-run/react";
import { getBlocks } from "~/models/blocks.server";
import { type MetaFunction } from "@remix-run/react";
import { getWebPage } from "~/models/webPages.server";
import { capitalizeWords } from "~/helpers/stringHelpers";

export const meta: MetaFunction<typeof webPageLoader> = ({ data }: any) => {
  return [
    { title: data?.title },
    {
      name: data?.title,
      content: data?.description,
    },
  ];
};

export const webPageLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const pageName = params.pagel1?.replace("-", " ");

  if (pageName === "favicon.ico") {
    return redirect("/");
  }

  const webPage = await getWebPage(undefined, pageName);

  if (!webPage || (webPage && !webPage.isActive)) {
    throw new Response(null, {
      status: 404,
      statusText: "Page Not Found",
    });
  }

  let title, description, backgroundColor, blocks;

  if (webPage) {
    blocks = await getBlocks(webPage as any, true);
    title = capitalizeWords(webPage.title);
    description = capitalizeWords(webPage.description);
    backgroundColor = webPage.backgroundColor;
  }

  return json({
    blocks,
    title,
    description,
    backgroundColor,
    pageName,
  });
};
