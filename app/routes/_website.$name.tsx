import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/PageWrapper";
import { getWebPage } from "~/models/webPages.server";
import { getBlocks } from "~/utility/blockHelpers";

export const meta: V2_MetaFunction = () => [{ title: "Page Name" }];

export const loader = async ({ params }: LoaderArgs) => {
  const articleName = params.name;

  const webPage = await getWebPage(undefined, articleName);
  return { webPage };
};

const Home = () => {
  const { webPage } = useLoaderData();
  const blocks: Block[] = getBlocks(webPage);

  return (
    <PageWrapper gap="medium">
      <BlockRenderer blocks={blocks} />
    </PageWrapper>
  );
};

export default Home;
