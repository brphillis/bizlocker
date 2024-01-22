import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";
import { articleLoader } from "~/modules/Website/Article/index.server";

const Article = () => {
  const { blocks, backgroundColor } = useLoaderData<typeof articleLoader>();

  return (
    <PageWrapper gap="medium" backgroundColor={backgroundColor}>
      <>{blocks && <BlockRenderer blocks={blocks} />}</>
    </PageWrapper>
  );
};

export default Article;
