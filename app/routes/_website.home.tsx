import { type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import PageWrapper from "~/components/Layout/PageWrapper";
import { getHomePage } from "~/models/homePage.server";
import { getBlocks } from "~/utility/blockHelpers";
import { randomId } from "~/utility/stringHelpers";

export const meta: V2_MetaFunction = () => [{ title: "CLUTCH - clothing." }];

export const loader = async () => {
  const homePage = await getHomePage();

  return { homePage };
};

const Home = () => {
  const navigate = useNavigate();
  const { homePage } =
    (useLoaderData() as {
      homePage: Page;
    }) || {};

  const blocks: Block[] = getBlocks(homePage);

  return (
    <PageWrapper>
      <div className="max-w-screen flex w-screen flex-col gap-3 sm:w-[1280px]"></div>
      <>
        {blocks.map((_, index: number) => {
          const { content } = blocks[index];

          if (blocks[index].name === "banner") {
            return (
              <div
                key={"bannerBlock_" + randomId()}
                className="max-w-screen w-screen sm:w-[1280px]"
              >
                <img
                  src={content[0].bannerImage.url}
                  alt={"campaign_bannerImage"}
                  className="max-w-screen h-[120px] w-full object-cover sm:h-max"
                />
              </div>
            );
          }

          if (blocks[index].name === "tile") {
            return (
              <div
                key={"tileBlock_" + randomId()}
                className="max-w-screen grid grid-cols-2 gap-3 gap-y-6 px-2 py-3 sm:gap-6 sm:py-6 "
              >
                {content?.map(({ tileImage, name }: Promotion | Campaign) => {
                  return (
                    <img
                      key={"tileImage_" + randomId()}
                      className="h-[12rem] w-[12rem] cursor-pointer transition duration-300 ease-in-out hover:scale-[1.01] sm:h-[39rem] sm:w-[39rem]"
                      onClick={() => navigate(`/promotion/${name}`)}
                      src={tileImage.url}
                      alt={"tileImage_" + name}
                    />
                  );
                })}
              </div>
            );
          } else return null;
        })}
      </>
    </PageWrapper>
  );
};

export default Home;
