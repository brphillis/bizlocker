import { redirect, type ActionArgs } from "@remix-run/node";
import { getHomePage, upsertHomePageInfo } from "~/models/homePage.server";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import PageBuilder from "~/components/PageBuilder";
import {
  changeBlockOrder,
  disconnectBlock,
  publishPage,
  revertPreviewChanges,
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
import PatternBackground from "~/components/Layout/PatternBackground";
import { generateColor } from "~/utility/colors";

export const loader = async () => {
  const homePage = await getHomePage(true);
  let previewPages;
  let blocks;
  if (homePage) {
    previewPages = homePage.previewPage;
    blocks = await getBlocks(previewPages[0] as any);
  }

  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const articleCategories = await getArticleCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  return {
    homePage,
    previewPages,
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
    name,
    pageId,
    pageBlocks,
    title,
    index,
    previewPageId,
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

    case "publish":
      const publishSuccess = await publishPage(
        "homePage",
        previewPageId as string,
        pageId as string
      );

      return { publishSuccess };

    case "revert":
      const revertSuccess = await revertPreviewChanges(
        "homePage",
        previewPageId as string,
        pageId as string
      );

      return { revertSuccess };

    case "rearrange":
      const { direction } = form;

      return await changeBlockOrder(
        previewPageId as string,
        pageBlocks as string,
        parseInt(index as string),
        direction as "up" | "down"
      );

    case "delete":
      return await disconnectBlock(
        blockId as string,
        blockName as BlockName,
        previewPageId as string
      );

    default:
      return null;
  }
};

const ManageHomePage = () => {
  const {
    homePage,
    previewPages,
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
      <div className="relative h-full p-6 max-sm:p-3 sm:w-full">
        <div className="absolute left-0 top-0 h-full w-full bg-brand-white"></div>
        <PatternBackground
          name="isometric"
          backgroundColor={generateColor("BLACK")}
          patternColor={generateColor("WHITE")}
          patternOpacity={0.2}
          patternSize={140}
          brightness={-1.5}
        />

        <div className="flex w-full justify-center">
          <div className="flex flex-col gap-6 rounded-none text-brand-white">
            <div className="relative flex justify-center gap-3 bg-brand-black py-6 text-center text-xl font-bold text-brand-white">
              <div className="w-full">Edit Home Page</div>
            </div>

            <LargeCollapse
              title="Page Options"
              content={
                <Form
                  method="POST"
                  className="relative flex w-full flex-col items-center gap-6"
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
                    className="btn-primary btn-md mx-auto block w-max !rounded-sm"
                  >
                    {homePage ? "Submit" : "Next Step"}
                  </button>
                </Form>
              }
            />

            <LargeCollapse
              title="Page Content"
              forceOpen={true}
              content={
                <PageBuilder
                  previewPage={previewPages[0]}
                  pageType="homePage"
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

            <Form
              method="POST"
              className="relative flex justify-center gap-3 bg-brand-black py-6 text-center text-xl font-bold text-brand-white"
            >
              <input
                hidden
                readOnly
                name="previewPageId"
                value={previewPages[0].id.toString()}
              />
              <input
                hidden
                readOnly
                name="pageId"
                value={homePage.id.toString()}
              />
              <button
                type="submit"
                name="_action"
                value="revert"
                className="btn-primary btn-md block w-max !rounded-sm"
              >
                Revert
              </button>
              <a
                type="button"
                className="btn-primary btn-md flex w-max items-center justify-center !rounded-sm"
                target="_blank"
                rel="noreferrer"
                href={`/preview/${previewPages[0].id}`}
              >
                Preview
              </a>
              <button
                type="submit"
                name="_action"
                value="publish"
                className="btn-primary btn-md block w-max !rounded-sm"
              >
                Publish
              </button>
            </Form>
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default ManageHomePage;
