import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import PageBuilder from "~/components/PageBuilder";
import {
  changeBlockOrder,
  disconnectBlock,
  getPageType,
  publishPage,
  revertPreviewChanges,
  updatePageBlock,
  upsertPageMeta,
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
import { formatDate } from "~/helpers/dateHelpers";
import { sortPreviewPages } from "~/helpers/sortHelpers";
import { addPreviewPage, getPreviewPage } from "~/models/previewPage";
import { useEffect, useState } from "react";
import { HiTrash } from "react-icons/hi2";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import UploadImage from "~/components/Forms/Upload/UploadImage";

export const loader = async ({ request, params }: LoaderArgs) => {
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const articleCategories = await getArticleCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  const pageType = params?.pagetype?.replace(/p/g, "P");

  const url = new URL(request.url);
  const req = url.searchParams.get("req") || undefined;

  if (pageType === "new") {
    return { pageToCreate: req, articleCategories };
  }

  const page = await getPageType(pageType as PageType, true, req);

  let previewPages;
  let blocks;
  let currentPreviewPage;
  if (page) {
    previewPages = sortPreviewPages(page.previewPage);
    currentPreviewPage = await getPreviewPage(previewPages[0].id.toString());
    blocks = await getBlocks(currentPreviewPage as any);
  }

  return {
    page,
    pageType,
    previewPages,
    currentPreviewPage,
    blocks,
    productCategories,
    productSubCategories,
    articleCategories,
    brands,
    colors,
  };
};

export const action = async ({ request, params }: ActionArgs) => {
  const pageType = params?.pagetype?.replace(/p/g, "P");
  const url = new URL(request.url);
  const req = url?.searchParams.get("req") || undefined;

  const form = Object.fromEntries(await request.formData());
  const {
    backgroundColor,
    articleCategories,
    thumbnail,
    isActive,
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

  let actionPreview, actionBlocks;

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

      if ((pageType === "article" || req === "article") && !articleCategories) {
        metaValidationError.push("Select at least 1 Article Category");
      }

      if (metaValidationError.length > 0) {
        return { metaValidationError };
      }

      const newId = await upsertPageMeta(
        req as PageType,
        title as string,
        description as string,
        backgroundColor as string,
        isActive as string,
        thumbnail ? JSON.parse(thumbnail as string) : undefined,
        pageId ? (pageId as string) : undefined,
        articleCategories ? JSON.parse(articleCategories as string) : undefined
      );

      if (pageType === "new") {
        return redirect(`/admin/pagebuilder/${req}?id=${newId}`);
      } else return null;

    case "addpreview":
      const addPreviewSuccess = await addPreviewPage(
        pageType as PageType,
        pageId as string
      );

      return { addPreviewSuccess };

    case "changecurrentpreview":
      actionPreview = await getPreviewPage(pageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      if (actionPreview && actionBlocks) {
        return { actionPreview, actionBlocks };
      } else {
        return { previewChangeError: true };
      }

    case "update":
      const newBlockData = getBlockUpdateValues(form);

      const updateSuccess = await updatePageBlock(
        pageType as PageType,
        previewPageId as string,
        newBlockData as NewBlockData,
        blockOptions
      );
      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      return { updateSuccess, actionPreview, actionBlocks };

    case "publish":
      const publishSuccess = await publishPage(
        pageType as PageType,
        previewPageId as string,
        pageId as string,
        request
      );

      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      return { actionPreview, actionBlocks, publishSuccess };

    case "revert":
      const revertSuccess = await revertPreviewChanges(
        pageType as PageType,
        previewPageId as string,
        pageId as string
      );

      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      return { actionPreview, actionBlocks, revertSuccess };

    case "rearrange":
      const { direction } = form;

      await changeBlockOrder(
        previewPageId as string,
        pageBlocks as string,
        parseInt(index as string),
        direction as "up" | "down"
      );

      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      return { actionPreview, actionBlocks };

    case "delete":
      await disconnectBlock(
        blockId as string,
        blockName as BlockName,
        previewPageId as string
      );
      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      return { actionPreview, actionBlocks };

    default:
      return null;
  }
};

const ManageHomePage = () => {
  const submit = useSubmit();
  const {
    page,
    pageType,
    pageToCreate,
    previewPages,
    currentPreviewPage,
    blocks,
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
    actionPreview,
    actionBlocks,
  } = useActionData() || {};

  const [currentVersion, setCurrentVersion] =
    useState<PreviewPage>(currentPreviewPage);
  const [currentBlocks, setCurrentBlocks] = useState<Block[]>(blocks);

  const [isActive, setIsActive] = useState<string | undefined>(
    page?.isActive ? " " : ""
  );

  useEffect(() => {
    if (actionPreview) {
      setCurrentVersion(actionPreview);
    }
    if (actionBlocks) {
      setCurrentBlocks(actionBlocks);
    }
  }, [actionPreview, actionBlocks]);

  return (
    <AdminPageWrapper>
      <div className="relative h-full p-6 max-sm:p-0 sm:w-full">
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
            <div className="relative flex flex-col items-center justify-center gap-6 bg-brand-black py-6 text-center text-xl font-bold text-brand-white max-sm:gap-3">
              <div className="w-full">{page ? page.title : "Add Page"}</div>
            </div>

            <LargeCollapse
              title="Meta"
              content={
                <Form
                  method="POST"
                  className="relative flex w-full flex-col items-center gap-6 max-md:px-3"
                >
                  {pageType !== "homePage" && (
                    <>
                      <label className="label absolute -top-11 right-16 z-10 mt-0 h-1 cursor-pointer max-md:-top-9 sm:mt-1">
                        <input
                          type="checkbox"
                          className="toggle toggle-sm ml-3"
                          checked={isActive ? true : false}
                          onChange={(e) =>
                            setIsActive(e.target.checked ? "true" : undefined)
                          }
                        />
                        <span className="label-text ml-3 text-brand-white">
                          Active
                        </span>
                      </label>
                      <input
                        name="isActive"
                        value={isActive || ""}
                        readOnly
                        hidden
                      />
                    </>
                  )}

                  <BasicInput
                    name="title"
                    label="Title"
                    labelColor="text-brand-white"
                    placeholder="Title"
                    type="text"
                    defaultValue={page?.title}
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
                      defaultValue={page?.description}
                      className="textarea textarea-bordered flex w-[95vw] rounded-sm text-brand-black sm:w-[320px]"
                    />
                  </div>

                  {pageToCreate === "article" && (
                    <BasicMultiSelect
                      name="articleCategories"
                      label="Categories"
                      selections={articleCategories}
                      defaultValues={page?.articleCategories}
                      customWidth="w-[320px]"
                      labelColor="text-brand-white"
                    />
                  )}

                  {colors && (
                    <BasicSelect
                      label="Background Color"
                      labelColor="text-brand-white"
                      customWidth="w-[320px]"
                      name="backgroundColor"
                      placeholder="Select a Color"
                      defaultValue={page?.backgroundColor}
                      selections={colors?.map((color: string) => ({
                        id: color,
                        name: color,
                      }))}
                    />
                  )}

                  {pageType !== "homePage" && (
                    <div className="form-control w-full max-w-xs">
                      <label className="label">
                        <span className="label-text text-brand-white">
                          Thumbnail
                        </span>
                      </label>
                      <div className="max-w-[500px]">
                        <UploadImage
                          defaultValue={page?.thumbnail}
                          name="thumbnail"
                        />
                      </div>
                    </div>
                  )}

                  <input name="pageId" value={page?.id} hidden readOnly />
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
                    {page ? "Submit" : "Next Step"}
                  </button>
                </Form>
              }
            />

            {page && (
              <LargeCollapse
                title="Content"
                forceOpen={true}
                content={
                  <PageBuilder
                    previewPage={currentVersion}
                    pageType={pageType as PageType}
                    blocks={currentBlocks}
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
            )}

            {page && (
              <div className="relative flex flex-col items-center justify-center gap-3 bg-brand-black py-6 text-center text-xl font-bold text-brand-white">
                <div className="self-start pb-3 pl-6 text-xl font-medium">
                  Version
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Form method="POST" className="flex items-center gap-3">
                    <button
                      type="submit"
                      name="_action"
                      value="addpreview"
                      className="flex !h-[32px] !min-h-[32px] !w-[32px] !min-w-[32px] items-center justify-center !rounded-sm bg-error hover:bg-red-500"
                    >
                      <HiTrash size={14} className="text-brand-white" />
                    </button>

                    <select
                      className="select select-sm !h-[32px] !min-h-[32px] w-full max-w-xs text-brand-black/75 max-md:max-w-[240px]"
                      onChange={(e) => {
                        const formData = new FormData();
                        formData.set("_action", "changecurrentpreview");
                        formData.set("pageId", e.target.value);
                        submit(formData, { method: "POST" });
                      }}
                    >
                      {previewPages
                        .slice()
                        .sort(
                          (a: any, b: any) =>
                            (b.publishedAt || 0) - (a.publishedAt || 0)
                        )
                        .map((previewPageData: PreviewPage, i: number) => {
                          const { id, publishedAt } = previewPageData;
                          const publishedDate = publishedAt
                            ? formatDate(publishedAt, true)
                            : "unpublished";

                          const optionLabel =
                            i === 0 ? "Current Version" : "Previous Version";

                          return (
                            <option
                              key={"preivewPageVersionSelection_" + i}
                              selected={i === 0}
                              value={id}
                            >
                              {optionLabel}: {publishedDate}
                            </option>
                          );
                        })}
                    </select>

                    <input
                      hidden
                      readOnly
                      name="pageId"
                      value={page?.id.toString()}
                    />
                    <button
                      type="submit"
                      name="_action"
                      value="addpreview"
                      className="btn-primary btn-md flex !h-[32px] !min-h-[32px] !w-[32px] items-center justify-center !rounded-sm"
                    >
                      +
                    </button>
                  </Form>

                  <div className="w-full select-none py-1 text-xs text-brand-white/75">
                    Last Published by : {currentVersion?.publisher}
                  </div>
                </div>

                <Form
                  method="POST"
                  className="flex flex-row justify-center gap-3"
                >
                  <input
                    hidden
                    readOnly
                    name="previewPageId"
                    value={currentVersion?.id.toString()}
                  />
                  <input
                    hidden
                    readOnly
                    name="pageId"
                    value={page?.id.toString()}
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
                    href={`/preview/${currentVersion?.id}`}
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
            )}
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default ManageHomePage;
