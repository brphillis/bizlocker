import type { ActionArgs } from "@remix-run/node";
import { getHomePage } from "~/models/homePage.server";
import { useActionData, useLoaderData } from "@remix-run/react";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import PageBuilder from "~/components/PageBuilder";
import {
  changeBlockOrder,
  removeBlock,
  updatePageBlock,
} from "~/models/pageBuilder.server";
import Icon from "~/components/Icon";
import LargeCollapse from "~/components/Collapse/LargeCollapse";
import { getBrands } from "~/models/brands.server";
import { getRootCategories } from "~/models/rootCategories.server";
import { getProductCategories } from "~/models/productCategories.server";
import {
  getBlockOptions,
  getBlockUpdateValues,
  searchContentData,
} from "~/utility/pageBuilder";

export const loader = async () => {
  const homePage = await getHomePage();
  const rootCategories = await getRootCategories();
  const productCategories = await getProductCategories();
  const brands = await getBrands();

  return { homePage, rootCategories, productCategories, brands };
};

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());
  const { pageId, itemIndex, contentType, name } = form;

  const blockOptions: NewBlockOptions = getBlockOptions(form);

  switch (form._action) {
    case "search":
      return await searchContentData(
        name as string,
        contentType as BlockContentType
      );

    case "update":
      const newBlockData: NewBlockData = getBlockUpdateValues(form);

      const updateSuccess = await updatePageBlock(
        "homePage",
        parseInt(pageId as string),
        newBlockData,
        blockOptions
      );

      return { updateSuccess };

    case "rearrange":
      const { direction } = form;

      return await changeBlockOrder(
        "homePage",
        parseInt(pageId as string),
        parseInt(itemIndex as string),
        direction as "up" | "down"
      );

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

  const { searchResults, updateSuccess } =
    (useActionData() as {
      searchResults: Promotion[] | Campaign[];
      updateSuccess: boolean;
    }) || {};

  return (
    <AdminPageWrapper>
      <div className="relative h-full w-screen bg-base-300 p-6 sm:w-full">
        <div className="hidden sm:block">
          <AdminPageHeader title="Manage Home Page" />
        </div>

        <div className="flex w-full justify-center">
          <div className="flex flex-col gap-6">
            <div className="flex justify-center gap-3 text-center text-2xl font-bold">
              <Icon iconName="IoHomeSharp" size={24} styles="mt-[5px]" />
              Home Page Editor
            </div>

            <LargeCollapse
              title="Page Content"
              content={
                <PageBuilder
                  page={homePage}
                  searchResults={searchResults}
                  updateSuccess={updateSuccess}
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
