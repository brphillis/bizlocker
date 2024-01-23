import { getBlocks } from "~/models/Blocks/index.server";
import { getPreviewPage } from "~/models/PreviewPage/index.server";
import { json, redirect, type MetaFunction } from "@remix-run/node";
export const meta: MetaFunction = () => {
  return [
    { title: "Page Preview" },
    {
      name: "Page Preview",
      content: "Page Preview",
    },
  ];
};

export const previewLoader = async (request: Request) => {
  const url = new URL(request.url);
  const pageId = url.searchParams.get("id") || undefined;

  if (pageId && !isNaN(parseInt(pageId))) {
    const webPage = await getPreviewPage(pageId as string);
    let backgroundColor, blocks;

    if (webPage) {
      blocks = await getBlocks(webPage, true);

      backgroundColor = webPage?.backgroundColor;
    }

    return json({ blocks, backgroundColor });
  } else return redirect("/admin/home");
};
