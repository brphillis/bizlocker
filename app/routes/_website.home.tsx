import { useLoaderData } from "@remix-run/react";
import { getBlocks } from "~/helpers/blockHelpers";
import { json, type MetaFunction } from "@remix-run/node";
import BlockRenderer from "~/components/BlockRenderer";
import { getHomePage } from "~/models/homePage.server";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.title },
    {
      name: data?.title,
      content: data?.description,
    },
  ];
};

export const loader = async () => {
  const homePage = await getHomePage();
  let title, description, backgroundColor, blocks;

  if (homePage) {
    blocks = await getBlocks(homePage, true);
    title = homePage.title;
    description = homePage.description;
    backgroundColor = homePage.backgroundColor;
  }

  return json({
    blocks,
    title,
    description,
    backgroundColor,
  });
};

const Home = () => {
  const { blocks, backgroundColor } = useLoaderData<typeof loader>();

  return (
    <PageWrapper gap="medium" backgroundColor={backgroundColor}>
      <>{blocks && <BlockRenderer blocks={blocks} />}</>
    </PageWrapper>
  );
};

export default Home;
