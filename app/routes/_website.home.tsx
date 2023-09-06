import { type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import {
  getArticlesForPage,
  getProductsForPage,
} from "~/models/blockHelpers.server";
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
  let productBlockProducts: Product[][] = [];
  let articleBlockArticles: Article[][] = [];

  if (homePage) {
    blocks = getBlocks(homePage as any);
    title = homePage.title;
    description = homePage.description;
  }
  if (blocks) {
    productBlockProducts = await getProductsForPage(blocks);
    articleBlockArticles = await getArticlesForPage(blocks);
  }
  return {
    blocks,
    productBlockProducts,
    articleBlockArticles,
    title,
    description,
  };
};

const Home = () => {
  const { blocks, productBlockProducts, articleBlockArticles } =
    useLoaderData() || {};

  return (
    <PageWrapper gap="medium">
      <BlockRenderer
        blocks={blocks}
        productBlockProducts={productBlockProducts}
        articleBlockArticles={articleBlockArticles}
      />
    </PageWrapper>
  );
};

export default Home;
