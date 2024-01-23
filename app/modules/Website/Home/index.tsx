import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import { homeLoader } from "~/modules/Website/Home/index.server";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";

const Home = () => {
  const { blocks, backgroundColor } = useLoaderData<typeof homeLoader>();

  return (
    <PageWrapper gap="medium" backgroundColor={backgroundColor}>
      <>{blocks && <BlockRenderer blocks={blocks} />}</>
    </PageWrapper>
  );
};

export default Home;
