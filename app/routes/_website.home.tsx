import { type V2_MetaFunction } from "@remix-run/node";
import PageWrapper from "~/components/Layout/PageWrapper";

export const meta: V2_MetaFunction = () => [{ title: "CLUTCH - clothing." }];

const Home = () => {
  return (
    <PageWrapper>
      <div className="h-[800px]">content</div>
    </PageWrapper>
  );
};

export default Home;
