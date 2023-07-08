import type { ActionArgs } from "@remix-run/node";
import { getHomePage, updateHomePage } from "~/models/homePage.server";
import { useActionData, useLoaderData } from "@remix-run/react";
import { searchCampaigns } from "~/models/campaigns.server";
import { searchPromotions } from "~/models/promotions.server";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import ContentBuilder from "~/components/PageBuilder/ContentBuilder";
import { removeBlock } from "~/models/pageBuilder.server";
import Icon from "~/components/Icon";
import LargeCollapse from "~/components/Collapse/LargeCollapse";
import { getBrands } from "~/models/brands.server";
import { getRootCategories } from "~/models/rootCategories.server";
import { getProductCategories } from "~/models/productCategories.server";

export const loader = async () => {
  const homePage = await getHomePage();
  const rootCategories = await getRootCategories();
  const productCategories = await getProductCategories();
  const brands = await getBrands();

  return { homePage, rootCategories, productCategories, brands };
};

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());
  const {
    pageId,
    itemIndex,
    blockName,
    contentType,
    contentData,
    stringData,
    name,
  } = form;

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
      if (blockName && pageId) {
        let contentDataParsed = JSON.parse(contentData as string) as
          | Campaign[]
          | Promotion[];

        contentDataParsed = Array.isArray(contentDataParsed)
          ? contentDataParsed
          : [contentDataParsed];

        return await updateHomePage(
          parseInt(itemIndex as string),
          blockName as BlockName,
          parseInt(pageId as string),
          contentType as BlockContentType,
          contentDataParsed,
          stringData as string
        );
      }

    case "delete":
      return await removeBlock(
        parseInt(pageId as string),
        parseInt(itemIndex as string)
      );
  }
};

const ManageHomePage = () => {
  const { homePage, rootCategories, productCategories, brands } =
    (useLoaderData() as {
      homePage: HomePage;
      rootCategories: RootCategory[];
      productCategories: ProductCategory[];
      brands: Brand[];
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

            <LargeCollapse
              title="Page Content"
              content={
                <ContentBuilder
                  page={homePage}
                  searchResults={searchResults}
                  rootCategories={rootCategories}
                  productCategories={productCategories}
                  brands={brands}
                />
              }
            />
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default ManageHomePage;
