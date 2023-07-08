import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/PageWrapper";
import { getArticle } from "~/models/articles.server";
import { getBlocks } from "~/utility/blockHelpers";

export const meta: V2_MetaFunction = () => [{ title: "Article Name" }];

export const loader = async ({ params }: LoaderArgs) => {
  const articleName = params.name;

  const article = await getArticle(undefined, articleName);
  return { article };
};

const Home = () => {
  const { article } =
    (useLoaderData() as {
      article: Article;
    }) || {};

  const blocks: Block[] = getBlocks(article);

  return (
    <PageWrapper gap="medium">
      <BlockRenderer blocks={blocks} />
    </PageWrapper>
  );
};

export default Home;
