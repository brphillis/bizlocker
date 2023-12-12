import { getBlocks } from "~/helpers/blockHelpers";
import { getWebPage } from "~/models/webPages.server";
import BlockRenderer from "~/components/BlockRenderer";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { capitalizeWords } from "~/helpers/stringHelpers";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import { type MetaFunction, useLoaderData } from "@remix-run/react";

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
  const pageName = params.name?.replace("-", " ");
  const webPage = await getWebPage(undefined, pageName);

  if (!webPage) {
    throw new Response(null, {
      status: 404,
      statusText: "Page Not Found",
    });
  }

  let title, description, backgroundColor, blocks;

  if (webPage) {
    blocks = await getBlocks(webPage as any, true);
    title = capitalizeWords(webPage.title);
    description = capitalizeWords(webPage.description);
    backgroundColor = webPage.backgroundColor;
  }

  return json({
    blocks,
    title,
    description,
    backgroundColor,
    pageName,
  });
};

const WebPage = () => {
  const { blocks, backgroundColor } = useLoaderData<typeof loader>();

  return (
    <PageWrapper gap="medium" backgroundColor={backgroundColor}>
      <>{blocks && <BlockRenderer blocks={blocks} />}</>
    </PageWrapper>
  );
};

export default WebPage;
