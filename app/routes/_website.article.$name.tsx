import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import { getArticle } from "~/models/articles.server";
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

export const loader = async ({ params }: LoaderArgs) => {
  const articleName = params.name;
  const article = await getArticle(undefined, articleName);

  let title, description, blocks;

  if (article) {
    blocks = await getBlocks(article as any);
    title = article.title;
    description = article.description;
  }

  return {
    title,
    description,
    blocks,
    articleName,
  };
};

const Home = () => {
  const { blocks } = useLoaderData();

  return (
    <PageWrapper gap="medium">
      <BlockRenderer blocks={blocks} />
    </PageWrapper>
  );
};

export default Home;
