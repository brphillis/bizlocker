import type { ActionArgs } from "@remix-run/node";
import { getHomePage } from "~/models/homePage.server";
import { Outlet, useActionData, useLoaderData } from "@remix-run/react";
import { searchCampaigns } from "~/models/campaigns.server";
import { searchPromotions } from "~/models/promotions.server";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import ContentBuilder from "~/components/PageBuilder/ContentBuilder";
import { removeBlock, updatePage } from "~/models/pageBuilder.server";
import HomePageBannerBuilder from "~/components/PageBuilder/BannerBuilder";

export const loader = async () => {
  const homePage = await getHomePage();

  return { homePage };
};

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());
  const { pageId, itemIndex, blockName, contentType, contentData, name } = form;

  switch (form._action) {
    case "search":
      const searchQuery = {
        name: name as string,
        page: 1,
        perPage: 10,
      };

      let searchResults;

      switch (contentType) {
        case "promotion":
          const { promotions } = await searchPromotions(searchQuery);
          searchResults = promotions;
          return { searchResults };
        case "campaign":
          const { campaigns } = await searchCampaigns(searchQuery);
          searchResults = campaigns;

          return { searchResults };

        default:
          return { searchResults };
      }

    case "update":
      let updateData = JSON.parse(contentData as string) as
        | Campaign[]
        | Promotion[];

      updateData = Array.isArray(updateData) ? updateData : [updateData];

      return await updatePage(
        parseInt(pageId as string),
        parseInt(itemIndex as string),
        blockName as BlockName,
        contentType as BlockContentType,
        updateData
      );

    case "delete":
      return await removeBlock(
        parseInt(pageId as string),
        parseInt(itemIndex as string)
      );
  }
};

const ManageHomePage = () => {
  const { homePage } =
    (useLoaderData() as {
      homePage: Page;
    }) || {};

  const { searchResults } =
    (useActionData() as {
      searchResults: Promotion[] | Campaign[];
    }) || {};

  return (
    <AdminPageWrapper>
      <div className="relative h-full w-full bg-base-300 p-6">
        <AdminPageHeader title="Manage Home Page" />

        <div className="flex flex-col gap-6">
          <div className="collapse-plus collapse w-[800px] rounded-none bg-base-200 py-3 pr-3">
            <input type="checkbox" />
            <div className="collapse-title ml-3 text-xl font-medium">
              Banner
            </div>
            <div className=" collapse-content flex justify-center">
              <HomePageBannerBuilder
                homePage={homePage}
                searchResults={searchResults}
              />
            </div>
          </div>

          <div className="collapse-plus collapse w-[800px] rounded-none bg-base-200 py-3 pr-3">
            <input type="checkbox" />
            <div className="collapse-title ml-3 text-xl font-medium">
              Page Content
            </div>
            <div className="collapse-content flex justify-center">
              <ContentBuilder page={homePage} searchResults={searchResults} />
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageHomePage;
