import { useLoaderData } from "@remix-run/react";
import { getBlocks } from "~/helpers/blockHelpers";
import { getPreviewPage } from "~/models/previewPage";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Page Preview" },
    {
      name: "Page Preview",
      content: "Page Preview",
    },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const pageId = params.id;
  if (pageId && !isNaN(parseInt(pageId))) {
    const webPage = await getPreviewPage(pageId as string);
    let backgroundColor, blocks;

    if (webPage) {
      blocks = await getBlocks(webPage as any, true);

      backgroundColor = webPage?.backgroundColor;
    }

    return json({ blocks, backgroundColor });
  } else return redirect("/admin/home");
};

const Preview = () => {
  const { blocks, backgroundColor } = useLoaderData<typeof loader>();

  return (
    <PageWrapper gap="medium" backgroundColor={backgroundColor}>
      <>{blocks && <BlockRenderer blocks={blocks} />}</>
    </PageWrapper>
  );
};

export default Preview;
