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
      homePage: Page;
    }) || {};

  const blocks: Block[] = getBlocks(homePage);

  return (
    <PageWrapper>
      <div className="max-w-screen flex w-screen flex-col gap-6 sm:w-[1280px]">
        <BlockRenderer blocks={blocks} />
      </div>
    </PageWrapper>
  );
};

export default Home;
