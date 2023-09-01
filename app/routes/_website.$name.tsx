import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/PageWrapper";
import {
  getArticlesForPage,
  getProductsForPage,
} from "~/models/blockHelpers.server";
import { getWebPage } from "~/models/webPages.server";
import { getBlocks } from "~/utility/blockHelpers";

export const meta: V2_MetaFunction = ({ data }) => [{ title: data.pageName }];

export const loader = async ({ params }: LoaderArgs) => {
  const pageName = params.name;
  const webPage = await getWebPage(undefined, pageName);
  let blocks;
  let productBlockProducts: Product[][] = [];
  let articleBlockArticles: Article[][] = [];

  if (webPage) {
    blocks = getBlocks(webPage as any);
  }
  if (blocks) {
    productBlockProducts = await getProductsForPage(blocks);
    articleBlockArticles = await getArticlesForPage(blocks);
  }
  return { blocks, productBlockProducts, articleBlockArticles, pageName };
};

const WebPage = () => {
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

export default WebPage;
