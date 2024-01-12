import { useLoaderData } from "@remix-run/react";
import { getArticle } from "~/models/articles.server";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";
import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { getBlocks } from "~/models/blocks.server";

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

  if (!article || (article && !article.isActive)) {
    throw new Response(null, {
      status: 404,
      statusText: "Page Not Found",
    });
  }

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
