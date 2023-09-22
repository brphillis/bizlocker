import { type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import { getHomePage } from "~/models/homePage.server";
import { getBlocks } from "~/utility/blockHelpers";

export const meta: V2_MetaFunction = ({ data }) => {
  return [
    { title: data.title },
    {
      name: "description",
      content: data.description,
    },
  ];
};

export const loader = async () => {
  const homePage = await getHomePage();
  let title, description, blocks;

  if (homePage) {
    blocks = await getBlocks(homePage as any);
    title = homePage.title;
    description = homePage.description;
  }

  return {
    blocks,
    title,
    description,
  };
};

const Home = () => {
  const { blocks } = useLoaderData() || {};

  return (
    <PageWrapper gap="medium">
      <BlockRenderer blocks={blocks} />
    </PageWrapper>
  );
};

export default Home;
