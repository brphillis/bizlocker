import { type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import { getHomePage } from "~/models/homePage.server";
import { getBlocks } from "~/helpers/blockHelpers";

export const meta: V2_MetaFunction = ({ data }) => {
  return [
    { title: data.title },
    {
      name: data.title,
      content: data.description,
    },
  ];
};

export const loader = async () => {
  const homePage = await getHomePage();
  let title, description, backgroundColor, blocks;

  if (homePage) {
    blocks = await getBlocks(homePage as any, true);
    title = homePage.title;
    description = homePage.description;
    backgroundColor = homePage.backgroundColor;
  }

  return {
    blocks,
    title,
    description,
    backgroundColor,
  };
};

const Home = () => {
  const { blocks, backgroundColor } = useLoaderData() || {};

  return (
    <PageWrapper gap="medium" backgroundColor={backgroundColor}>
      <BlockRenderer blocks={blocks} />
    </PageWrapper>
  );
};

export default Home;
