import { redirect, type ActionArgs } from "@remix-run/node";
import { getHomePage, upsertHomePageInfo } from "~/models/homePage.server";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import PageBuilder from "~/components/PageBuilder";
import {
  changeBlockOrder,
  removeBlock,
  updatePageBlock,
} from "~/models/pageBuilder.server";
import LargeCollapse from "~/components/Collapse/LargeCollapse";
import { getBrands } from "~/models/brands.server";
import { getProductCategories } from "~/models/productCategories.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import {
  getFormBlockOptions,
  getBlockUpdateValues,
  searchContentData,
} from "~/utility/pageBuilder";
import { getArticleCategories } from "~/models/articleCategories.server";

export const loader = async () => {
  const homePage = await getHomePage();
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const articleCategories = await getArticleCategories();
  const brands = await getBrands();

  return {
    homePage,
    productCategories,
    productSubCategories,
    articleCategories,
    brands,
  };
};

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());
  const { title, description, pageId, itemIndex, contentType, name } = form;

  const blockOptions: NewBlockOptions = getFormBlockOptions(form);

  switch (form._action) {
    case "search":
      return await searchContentData(
        contentType as BlockContentType,
        (name as string) || undefined
      );

    case "update":
      if (title || description) {
        await upsertHomePageInfo(
          title as string,
          description as string,
          pageId ? parseInt(pageId.toString()) : undefined
        );

        return redirect("/admin/home-page");
      }

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
        parseInt(itemIndex as string),
        "homePage"
      );

    default:
      return null;
  }
};

const ManageHomePage = () => {
  const {
    homePage,
    productCategories,
    productSubCategories,
    articleCategories,
    brands,
  } = useLoaderData() || {};

  const { searchResults, updateSuccess } = useActionData() || {};

  return (
    <AdminPageWrapper>
      <div className="relative h-full bg-base-200 p-6 max-sm:p-3 sm:w-full">
        <div className="flex w-full justify-center">
          <div className="flex flex-col gap-6 rounded-none text-brand-white">
            <div className="flex justify-center gap-3 pt-6 text-center text-2xl font-bold text-brand-black">
              Edit Home Page
            </div>

            <LargeCollapse
              title="Meta Information"
              content={
                <Form
                  method="POST"
                  className="flex w-full flex-col items-center gap-6"
                >
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-brand-white">Title</span>
                    </label>
                    <input
                      name="title"
                      type="text"
                      placeholder="Title"
                      defaultValue={homePage?.title}
                      className="input input-bordered w-[95vw] text-brand-black sm:w-[320px]"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-brand-white">
                        Description
                      </span>
                    </label>
                    <textarea
                      name="description"
                      placeholder="Description"
                      defaultValue={homePage?.description}
                      className="textarea textarea-bordered flex w-[95vw] rounded-none text-brand-black sm:w-[320px]"
                    />
                  </div>

                  <input name="pageId" value={homePage.id} hidden readOnly />
                  <input name="_action" value="update" hidden readOnly />
                  <button
                    type="submit"
                    className="btn-primary btn-md mx-auto block w-max"
                  >
                    {homePage ? "Submit" : "Next Step"}
                  </button>
                </Form>
              }
            />

            <LargeCollapse
              title="Page Content"
              content={
                <PageBuilder
                  page={homePage}
                  searchResults={searchResults}
                  updateSuccess={updateSuccess}
                  productCategories={productCategories}
                  productSubCategories={productSubCategories}
                  articleCategories={articleCategories}
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
