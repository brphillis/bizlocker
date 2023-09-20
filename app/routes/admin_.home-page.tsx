import { redirect, type ActionArgs } from "@remix-run/node";
import { getHomePage, upsertHomePageInfo } from "~/models/homePage.server";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
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
import { getAvailableColors } from "~/models/enums.server";

export const loader = async () => {
  const homePage = await getHomePage();
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const articleCategories = await getArticleCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  return {
    homePage,
    productCategories,
    productSubCategories,
    articleCategories,
    brands,
    colors,
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

    case "updateMeta":
      let metaValidationError: string[] = [];

      if (!title) {
        metaValidationError.push("Title is Required");
      }

      if (!description) {
        metaValidationError.push("Description is Required");
      }

      if (metaValidationError.length > 0) {
        return { metaValidationError };
      }

      await upsertHomePageInfo(
        title as string,
        description as string,
        pageId ? parseInt(pageId.toString()) : undefined
      );

      return redirect("/admin/home-page");

    case "update":
      const newBlockData = getBlockUpdateValues(form);
      // console.log("NEWBLOCKDATA", newBlockData);

      let blockValidationError: string[] = [];

      if (newBlockData.contentType && !newBlockData.contentData) {
        blockValidationError.push("Content Selection is Required.");
      }

      if (blockValidationError.length > 0) {
        return { blockValidationError };
      }

      const updateSuccess = await updatePageBlock(
        "homePage",
        parseInt(pageId as string),
        newBlockData as NewBlockData,
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
    colors,
  } = useLoaderData() || {};

  const {
    searchResults,
    updateSuccess,
    metaValidationError,
    blockValidationError,
  } = useActionData() || {};

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
                  <input name="_action" value="updateMeta" hidden readOnly />

                  {metaValidationError && metaValidationError?.length > 0 && (
                    <div className="pb-3">
                      {metaValidationError.map((error: string, i: number) => {
                        return (
                          <p
                            key={error + i}
                            className="my-2 text-center text-xs text-red-500"
                          >
                            {error}
                          </p>
                        );
                      })}
                    </div>
                  )}

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
                  colors={colors}
                  blockValidationError={blockValidationError}
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
