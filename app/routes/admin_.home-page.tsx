import type { ActionArgs } from "@remix-run/node";
import { getHomePage, updateHomePage } from "~/models/homePage.server";
import { useActionData, useLoaderData } from "@remix-run/react";
import { searchCampaigns } from "~/models/campaigns.server";
import { searchPromotions } from "~/models/promotions.server";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import ContentBuilder from "~/components/PageBuilder/ContentBuilder";
import { removeBlock } from "~/models/pageBuilder.server";
import { IoReorderFour } from "react-icons/io5";
import Icon from "~/components/Icon";

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

      return await updateHomePage(
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
      homePage: HomePage;
    }) || {};

  const { searchResults } =
    (useActionData() as {
      searchResults: Promotion[] | Campaign[];
    }) || {};

  return (
    <AdminPageWrapper>
      <div className="relative h-full w-screen bg-base-300 p-6 sm:w-full">
        <AdminPageHeader title="Manage Home Page" />

        <div className="flex w-full justify-center">
          <div className="flex flex-col gap-6">
            <div className="flex justify-center gap-3 text-center text-2xl font-bold">
              <Icon iconName="IoHomeSharp" size={24} styles="mt-[5px]" />
              Home Page Editor
            </div>

            <div className="max-w-screen collapse-plus collapse w-screen rounded-none bg-base-200 py-3 sm:w-[800px]">
              <input type="checkbox" readOnly />
              <div className="collapse-title text-xl font-medium">
                <div className="ml-3 flex items-center gap-3">
                  <IoReorderFour className="mt-1" />
                  <p>Page Content</p>
                </div>
              </div>
              <div className="collapse-content w-screen sm:w-full">
                <div className="flex justify-center">
                  <ContentBuilder
                    page={homePage}
                    searchResults={searchResults}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default ManageHomePage;
