import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/PageWrapper";
import { getArticle } from "~/models/articles.server";
import {
  getArticlesForPage,
  getProductsForPage,
} from "~/models/blockHelpers.server";
import { getBlocks } from "~/utility/blockHelpers";

export const meta: V2_MetaFunction = ({ data }) => [
  { title: data.articleName },
];

export const loader = async ({ params }: LoaderArgs) => {
  const articleName = params.name;
  const article = await getArticle(undefined, articleName);

  let blocks;
  let productBlockProducts: Product[][] = [];
  let articleBlockArticles: Article[][] = [];

  if (article) {
    blocks = getBlocks(article as any);
  }
  if (blocks) {
    productBlockProducts = await getProductsForPage(blocks);
    articleBlockArticles = await getArticlesForPage(blocks);
  }
  return { blocks, productBlockProducts, articleBlockArticles, articleName };
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
