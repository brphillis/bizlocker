import { getBlocks } from "~/models/Blocks/index.server";
import { getPreviewPage } from "~/models/PreviewPage/index.server";
import { json, redirect } from "@remix-run/node";

export const previewLoader = async (request: Request) => {
  const url = new URL(request.url);
  const pageId = url.searchParams.get("id") || undefined;

  if (pageId && !isNaN(parseInt(pageId))) {
    const webPage = await getPreviewPage(pageId as string);
    let backgroundColor, blocks;

    if (webPage) {
      blocks = await getBlocks(webPage);

      backgroundColor = webPage?.backgroundColor;
    }

    const meta = {
      title: "CLUTCH | Preview",
      description: "CLUTCH Clothing Page Preview",
    };

    return json({ meta, blocks, backgroundColor });
  } else return redirect("/admin");
};
