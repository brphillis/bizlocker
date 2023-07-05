import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { getHomePage } from "~/models/homePage.server";
import { Outlet, useLoaderData } from "@remix-run/react";
import { searchCampaigns } from "~/models/campaigns.server";
import { searchPromotions } from "~/models/promotions.server";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import ContentBuilder from "~/components/PageBuilder/ContentBuilder";
import { removeBlock, updatePage } from "~/models/pageBuilder.server";
import HomePageBannerBuilder from "~/components/PageBuilder/BannerBuilder";

export const loader = async ({ request }: LoaderArgs) => {
  const homePage = await getHomePage();
  const url = new URL(request.url);
  const contentType = url.searchParams.get("contentType") as string;

  const searchQuery = {
    name: url.searchParams.get("name")?.toString() as string,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("itemsPerPage")) || 10,
  };

  let searchResults;

  switch (contentType) {
    case "promotion":
      const { promotions } = await searchPromotions(searchQuery);
      searchResults = promotions;
      return { searchResults, homePage };
    case "campaign":
      const { campaigns } = await searchCampaigns(searchQuery);
      searchResults = campaigns;
      return { searchResults, homePage };

    default:
      return { searchResults, homePage };
  }
};

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());
  const { pageId, itemIndex, blockType, contentType, contentData } = form;

  switch (form._action) {
    case "updateBanner":
      let updateData = JSON.parse(contentData as string) as
        | Campaign[]
        | Promotion[];

      updateData = Array.isArray(updateData) ? updateData : [updateData];

      return await updatePage(
        parseInt(pageId as string),
        parseInt(itemIndex as string),
        blockType as BlockType,
        contentType as BlockData,
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
  const { searchResults, homePage } =
    (useLoaderData() as {
      searchResults: Promotion[] | Campaign[];
      homePage: Page;
    }) || {};

  return (
    <AdminPageWrapper>
      <div className="relative h-full w-full bg-base-300 p-6">
        <AdminPageHeader title="Manage Home Page" />
        <div className="flex flex-col gap-12">
          <div>
            <p className="text-2xl font-bold">Banner</p>

            <HomePageBannerBuilder
              homePage={homePage}
              searchResults={searchResults}
            />
          </div>

          <div>
            <p className="text-2xl font-bold">Content</p>

            <ContentBuilder page={homePage} searchResults={searchResults} />
          </div>
        </div>
      </div>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageHomePage;
