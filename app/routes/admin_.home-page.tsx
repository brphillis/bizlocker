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
import { getBlocks } from "~/helpers/blockHelpers";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicSelect from "~/components/Forms/Select/BasicSelect";

export const loader = async () => {
  const homePage = await getHomePage();
  let blocks;
  if (homePage) {
    blocks = await getBlocks(homePage as any);
  }
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const articleCategories = await getArticleCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  return {
    homePage,
    blocks,
    productCategories,
    productSubCategories,
    articleCategories,
    brands,
    colors,
  };
};

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());
  const {
    backgroundColor,
    blockId,
    blockName,
    contentType,
    description,
    itemIndex,
    name,
    pageId,
    title,
  } = form;

  const blockOptions: BlockOptions = getFormBlockOptions(form);

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
        backgroundColor as string,
        pageId ? parseInt(pageId.toString()) : undefined
      );

      return redirect("/admin/home-page");

    case "update":
      const newBlockData = getBlockUpdateValues(form);

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
      return await removeBlock(blockId as string, blockName as BlockName);

    default:
      return null;
  }
};

const ManageHomePage = () => {
  const {
    homePage,
    blocks,
    productCategories,
    productSubCategories,
    articleCategories,
    brands,
    colors,
  } = useLoaderData() || {};

  const { searchResults, updateSuccess, metaValidationError } =
    useActionData() || {};

  return (
    <AdminPageWrapper>
      <div className="relative h-full bg-base-200 p-6 max-sm:p-3 sm:w-full">
        <div className="flex w-full justify-center">
          <div className="flex flex-col gap-6 rounded-none text-brand-white">
            <div className="flex justify-center gap-3 pt-6 text-center text-2xl font-bold text-brand-black max-md:pt-3">
              Edit Home Page
            </div>

            <LargeCollapse
              title="Page Options"
              content={
                <Form
                  method="POST"
                  className="flex w-full flex-col items-center gap-6"
                >
                  <BasicInput
                    name="title"
                    label="Title"
                    labelColor="text-brand-white"
                    placeholder="Title"
                    type="text"
                    defaultValue={homePage?.title}
                    customWidth="w-[320px]"
                  />

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
                      className="textarea textarea-bordered flex w-[95vw] rounded-sm text-brand-black sm:w-[320px]"
                    />
                  </div>

                  <BasicSelect
                    label="Background Color"
                    labelColor="text-brand-white"
                    customWidth="w-[320px]"
                    name="backgroundColor"
                    placeholder="Select a Color"
                    defaultValue={homePage?.backgroundColor}
                    selections={colors.map((color: string) => ({
                      id: color,
                      name: color,
                    }))}
                  />

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
                  blocks={blocks}
                  searchResults={searchResults}
                  updateSuccess={updateSuccess}
                  productCategories={productCategories}
                  productSubCategories={productSubCategories}
                  articleCategories={articleCategories}
                  brands={brands}
                  colors={colors}
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
