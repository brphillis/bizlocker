import { useLoaderData } from "@remix-run/react";
import BlockRenderer from "~/components/BlockRenderer";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";
import { previewLoader } from "~/modules/Website/Preview/index.server";

const Preview = () => {
  const { blocks, backgroundColor } = useLoaderData<typeof previewLoader>();

  return (
    <PageWrapper gap="medium" backgroundColor={backgroundColor}>
      <>{blocks && <BlockRenderer blocks={blocks} />}</>
    </PageWrapper>
  );
};

export default Preview;
