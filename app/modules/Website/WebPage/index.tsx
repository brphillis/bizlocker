import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";
import { webPageLoader } from "~/modules/Website/WebPage/index.server";

const WebPage = () => {
  const { blocks, backgroundColor } = useLoaderData<typeof webPageLoader>();

  return (
    <PageWrapper gap="medium" backgroundColor={backgroundColor}>
      <>{blocks && <BlockRenderer blocks={blocks} />}</>
    </PageWrapper>
  );
};

export default WebPage;
