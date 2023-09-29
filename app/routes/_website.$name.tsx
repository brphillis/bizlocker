import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import { getWebPage } from "~/models/webPages.server";
import { getBlocks } from "~/helpers/blockHelpers";

export const meta: V2_MetaFunction = ({ data }) => {
  return [
    { title: data.title },
    {
      name: "description",
      content: data.description,
    },
  ];
};

export const loader = async ({ params }: LoaderArgs) => {
  const pageName = params.name;
  const webPage = await getWebPage(undefined, pageName);
  let title, description, backgroundColor, blocks;

  if (webPage) {
    blocks = await getBlocks(webPage as any);
    title = webPage.title;
    description = webPage.description;
    backgroundColor = webPage.backgroundColor;
  }

  return {
    blocks,
    title,
    description,
    backgroundColor,
    pageName,
  };
};

const WebPage = () => {
  const { blocks, backgroundColor } = useLoaderData();

  return (
    <PageWrapper gap="medium" backgroundColor={backgroundColor}>
      <BlockRenderer blocks={blocks} />
    </PageWrapper>
  );
};

export default WebPage;
