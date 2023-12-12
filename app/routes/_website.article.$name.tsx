import { useLoaderData } from "@remix-run/react";
import { getBlocks } from "~/helpers/blockHelpers";
import { getArticle } from "~/models/articles.server";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.title },
    {
      name: data?.title,
      content: data?.description,
    },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const articleName = params.name;
  const article = await getArticle(undefined, articleName);

  let title, description, backgroundColor, blocks;

  if (article) {
    blocks = await getBlocks(article as any, true);
    title = article.title;
    description = article.description;
    backgroundColor = article.backgroundColor;
  }

  return json({
    title,
    description,
    backgroundColor,
    blocks,
    articleName,
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
