import { type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/PageWrapper";
import {
  getArticlesForPage,
  getProductsForPage,
} from "~/models/blockHelpers.server";
import { getHomePage } from "~/models/homePage.server";
import { getBlocks } from "~/utility/blockHelpers";

export const meta: V2_MetaFunction = () => [{ title: "CLUTCH - clothing." }];

export const loader = async () => {
  const homePage = await getHomePage();
  let blocks;
  let productBlockProducts: Product[][] = [];
  let articleBlockArticles: Article[][] = [];

  if (homePage) {
    blocks = getBlocks(homePage as any);
  }
  if (blocks) {
    productBlockProducts = await getProductsForPage(blocks);
    articleBlockArticles = await getArticlesForPage(blocks);
  }
  return { blocks, productBlockProducts, articleBlockArticles };
};

const Home = () => {
  const { blocks, productBlockProducts, articleBlockArticles } =
    useLoaderData();

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
