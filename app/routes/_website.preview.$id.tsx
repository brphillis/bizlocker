import {
  redirect,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import { getBlocks } from "~/helpers/blockHelpers";
import { getPreviewPage } from "~/models/previewPage";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Page Preview" },
    {
      name: "description",
      content: "Page Preview",
    },
  ];
};

export const loader = async ({ params }: LoaderArgs) => {
  const pageId = params.id;
  if (pageId && !isNaN(parseInt(pageId))) {
    const webPage = await getPreviewPage(parseInt(pageId));
    let backgroundColor, blocks;

    if (webPage) {
      blocks = await getBlocks(webPage as any, true);

      backgroundColor = webPage?.backgroundColor;
    }

    return { blocks, backgroundColor };
  } else return redirect("/admin/home");
};

const Preview = () => {
  const { blocks, backgroundColor } = useLoaderData();

  return (
    <PageWrapper gap="medium" backgroundColor={backgroundColor}>
      <BlockRenderer blocks={blocks} />
    </PageWrapper>
  );
};

export default Preview;
