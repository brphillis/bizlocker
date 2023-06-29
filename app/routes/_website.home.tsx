import { type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import PageWrapper from "~/components/Layout/PageWrapper";
import { getPromotions } from "~/models/promotions.server";

export const meta: V2_MetaFunction = () => [{ title: "CLUTCH - clothing." }];

export const loader = async () => {
  const promotions = await getPromotions(true);
  return { promotions };
};

const Home = () => {
  const navigate = useNavigate();
  const { promotions } = (useLoaderData() as { promotions: Promotion[] }) || {};
  const promotionTiles = promotions?.map(
    ({ tileImage }: Promotion) => tileImage
  );

  console.log(promotionTiles);

  return (
    <PageWrapper>
      <>
        <div className="max-w-screen grid grid-cols-2 gap-3 gap-y-6 px-2 py-3 sm:gap-6 sm:py-6 ">
          {promotionTiles?.map(({ url, altText }, index) => {
            return (
              <div
                key={url}
                onClick={() => navigate(`/promotion/${promotions[index].name}`)}
              >
                <img
                  className="h-[12rem] w-[12rem] cursor-pointer transition duration-300 ease-in-out hover:scale-[1.01] sm:h-[32rem] sm:w-[32rem]"
                  src={url}
                  alt={altText}
                />
              </div>
            );
          })}
        </div>
      </>

      <div className="h-[200px]" />

      {/* // <div className="max-w-screen grid grid-cols-1 gap-6 gap-y-6 px-2 py-6 md:grid-cols-3">
    //   {articles?.map((article) => (
    //     <React.Fragment key={article.id}>
    //       <ArticleCard
    //         article={{ ...article, id: article.id }}
    //         hasDescription={hasDescription}
    //       />
    //     </React.Fragment>
    //   ))}
    // </div> */}
    </PageWrapper>
  );
};

export default Home;
