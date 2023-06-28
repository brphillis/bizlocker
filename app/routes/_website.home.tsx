import { type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import PageWrapper from "~/components/Layout/PageWrapper";
import { getCampaigns } from "~/models/campaigns.server";
import Campaigns from "./admin_.campaigns";

export const meta: V2_MetaFunction = () => [{ title: "CLUTCH - clothing." }];

export const loader = async () => {
  const campaigns = await getCampaigns(true);
  return { campaigns };
};

const Home = () => {
  const { campaigns } = (useLoaderData() as { campaigns: Campaign[] }) || {};
  const campaignTiles = campaigns?.map(({ tileImage }: Campaign) => tileImage);
  console.log(campaignTiles);
  return (
    // <div className="max-w-screen grid grid-cols-1 gap-6 gap-y-6 px-2 py-6 md:grid-cols-3">
    //   {articles?.map((article) => (
    //     <React.Fragment key={article.id}>
    //       <ArticleCard
    //         article={{ ...article, id: article.id }}
    //         hasDescription={hasDescription}
    //       />
    //     </React.Fragment>
    //   ))}
    // </div>

    <PageWrapper>
      <>
        <div className="max-w-screen grid grid-cols-1 gap-6 gap-y-6 px-2 py-6 md:grid-cols-2">
          {campaignTiles?.map(({ url, altText }) => {
            return (
              <div key={url}>
                <img className="h-[32rem] w-[32rem]" src={url} alt={altText} />
              </div>
            );
          })}
        </div>
      </>

      <div className="h-[200px]" />
    </PageWrapper>
  );
};

export default Home;
