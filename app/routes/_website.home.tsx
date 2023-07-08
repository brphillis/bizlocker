import { type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/PageWrapper";
import { getHomePage } from "~/models/homePage.server";
import { getBlocks } from "~/utility/blockHelpers";

export const meta: V2_MetaFunction = () => [{ title: "CLUTCH - clothing." }];

export const loader = async () => {
  const homePage = await getHomePage();
  return { homePage };
};

const Home = () => {
  const { homePage } =
    (useLoaderData() as {
      homePage: HomePage;
    }) || {};

  const blocks: Block[] = getBlocks(homePage);

  return (
    <PageWrapper gap="medium">
      <BlockRenderer blocks={blocks} />
    </PageWrapper>
  );
};

export default Home;
