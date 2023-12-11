import {
  redirect,
  type ActionArgs,
  type LoaderArgs,
  json,
} from "@remix-run/node";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import type { BlockOptions, PreviewPage } from "@prisma/client";
import type { BlockContentType, BlockName } from "~/utility/blockMaster/types";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import PageBuilder from "~/components/PageBuilder";
import {
  type Page,
  type PageBlock,
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
  type PageType,
  type NewBlockData,
} from "~/utility/pageBuilder";
import { getArticleCategories } from "~/models/articleCategories.server";
import { getAvailableColors } from "~/models/enums.server";
import { getBlocks } from "~/helpers/blockHelpers";
import PatternBackground from "~/components/Layout/PatternBackground";
import { generateColor } from "~/utility/colors";
import { sortPreviewPages } from "~/helpers/sortHelpers";
import {
  addPreviewPage,
  deletePage,
  deletePreviewPage,
  getPreviewPage,
} from "~/models/previewPage";
import { useEffect, useState } from "react";
import VersionControl from "~/components/PageBuilder/VersionControl";
import Header from "~/components/PageBuilder/Header";
import SquareIconButton from "~/components/Buttons/SquareIconButton";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const articleCategories = await getArticleCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  const pageType = params?.pagetype?.replace(/p/g, "P");

  const url = new URL(request.url);
  const req = url.searchParams.get("req") || undefined;
  const id = url.searchParams.get("id") || undefined;
  const page = await getPageType(pageType as PageType, true, id);

  let previewPages: PreviewPage[] | null | undefined = null;
  let blocks: PageBlock[] | null = null;
  let currentPreviewPage: Page | null = null;

  if (page) {
    previewPages = page.previewPage && sortPreviewPages(page.previewPage);

    if (previewPages && previewPages[0].id) {
      currentPreviewPage = await getPreviewPage(previewPages[0].id.toString());
    }

    if (currentPreviewPage) {
      blocks = await getBlocks(currentPreviewPage);
    }
  }

  return json({
    articleCategories,
    pageToCreate: req || null,
    blocks,
    brands,
    colors,
    currentPreviewPage,
    page,
    pageType,
    previewPages,
    productCategories,
    productSubCategories,
  });
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const pageType = params?.pagetype?.replace(/p/g, "P");
  const url = new URL(request.url);
  const req = url?.searchParams.get("req") || pageType;

  const form = Object.fromEntries(await request.formData());
  const {
    articleCategories,
    backgroundColor,
    blockId,
    blockName,
    contentType,
    description,
    index,
    isActive,
    name,
    pageBlocks,
    pageId,
    previewPageId,
    thumbnail,
    title,
  } = form;

  let actionPreview, actionBlocks;

  const blockOptions: BlockOptions = getFormBlockOptions(form);

  switch (form._action) {
    case "search":
      const searchResults = await searchContentData(
        contentType as BlockContentType,
        (name as string) || undefined
      );

      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      return json({ searchResults, actionPreview, actionBlocks });

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
        return json({ metaValidationError });
      }

      const newId = await upsertPageMeta(
        req as PageType,
        title as string,
        description as string,
        backgroundColor as string,
        isActive as string,
        thumbnail ? JSON.parse(thumbnail as string) : undefined,
        previewPageId ? (previewPageId as string) : undefined,
        articleCategories ? JSON.parse(articleCategories as string) : undefined
      );

      if (!previewPageId) {
        return redirect(`/admin/pagebuilder/${req}?id=${newId}`);
      } else return json({ metaUpdateSuccess: newId });

    case "addpreview":
      const addPreviewSuccess = await addPreviewPage(
        pageType as PageType,
        pageId as string
      );

      return { addPreviewSuccess };

    case "deletepreview":
      const deletePreviewSuccess = await deletePreviewPage(
        previewPageId as string
      );

      return json({ deletePreviewSuccess });

    case "deletepage":
      await deletePage(pageId as string, pageType as PageType);

      if (pageType === "article") return redirect("/admin/articles");
      if (pageType === "webPage") return redirect("/admin/pages");

    case "changecurrentpreview":
      actionPreview = await getPreviewPage(pageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      if (actionPreview && actionBlocks) {
        return json({ actionPreview, actionBlocks });
      } else {
        return json({ previewChangeError: true });
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

      return json({ updateSuccess, actionPreview, actionBlocks });

    case "publish":
      const publishSuccess = await publishPage(
        pageType as PageType,
        previewPageId as string,
        pageId as string,
        request
      );

      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      return json({ actionPreview, actionBlocks, publishSuccess });

    case "revert":
      const revertSuccess = await revertPreviewChanges(
        pageType as PageType,
        previewPageId as string,
        pageId as string
      );

      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      return json({ actionPreview, actionBlocks, revertSuccess });

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

      return json({ actionPreview, actionBlocks });

    case "delete":
      await disconnectBlock(
        blockId as string,
        blockName as BlockName,
        previewPageId as string
      );
      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      return json({ actionPreview, actionBlocks });

    default:
      return null;
  }
};

const ManageHomePage = () => {
  const {
    articleCategories,
    pageToCreate,
    blocks,
    brands,
    colors,
    currentPreviewPage,
    page,
    pageType,
    previewPages,
    productCategories,
    productSubCategories,
  } = useLoaderData<typeof loader>();

  const {
    actionBlocks,
    actionPreview,
    metaValidationError,
    searchResults,
    updateSuccess,
    publishSuccess,
  } = (useActionData() as ActionReturnTypes) || {};

  const [currentVersion, setCurrentVersion] = useState<Page | null>(
    currentPreviewPage
  );

  const [currentBlocks, setCurrentBlocks] = useState<PageBlock[] | null>(
    blocks || null
  );

  const [isActive, setIsActive] = useState<string | undefined>(
    page?.isActive ? " " : ""
  );

  useEffect(() => {
    if (currentPreviewPage && !actionPreview) {
      setCurrentVersion(currentPreviewPage);
    }
    if (actionPreview) {
      setCurrentVersion(actionPreview);
    }
    if (blocks && !actionBlocks) {
      setCurrentBlocks(blocks);
    }
    if (actionBlocks) {
      setCurrentBlocks(actionBlocks);
    }
  }, [actionPreview, actionBlocks, blocks, currentPreviewPage]);

  return (
    <AdminPageWrapper>
      <div className="relative h-full p-6 max-sm:p-0 sm:w-full">
        <div className="absolute left-0 top-0 h-full w-full bg-brand-white"></div>
        <PatternBackground
          backgroundColor={generateColor("BLACK")}
          brightness={-1.5}
          name="isometric"
          patternColor={generateColor("WHITE")}
          patternOpacity={0.2}
          patternSize={140}
        />

        <div className="flex w-full justify-center">
          <div className="flex flex-col gap-6 rounded-none text-brand-white">
            <div className="relative flex flex-col items-center justify-center gap-6 bg-brand-black py-6 text-center text-xl font-bold text-brand-white max-sm:gap-3">
              <div className="w-full">
                {page.title ? page.title : "Add Page"}
              </div>
              {pageType !== "homePage" && (
                <Form method="POST" className="absolute right-3">
                  {page?.id && (
                    <input
                      hidden
                      readOnly
                      name="pageId"
                      value={page.id.toString()}
                    />
                  )}
                  <input hidden readOnly name="pageType" value={pageType} />
                  <SquareIconButton
                    color="error"
                    iconName="IoTrashBin"
                    name="_action"
                    size="small"
                    type="submit"
                    value="deletepage"
                  />
                </Form>
              )}
            </div>

            <Header
              articleCategories={articleCategories}
              colors={colors}
              currentVersion={currentVersion}
              isActive={isActive}
              metaValidationError={metaValidationError}
              pageToCreate={pageToCreate as PageType}
              pageType={pageType as PageType}
              setIsActive={setIsActive}
            />

            {page && currentVersion && (
              <LargeCollapse
                title="Content"
                forceOpen={true}
                content={
                  <PageBuilder
                    articleCategories={articleCategories}
                    blocks={currentBlocks}
                    brands={brands}
                    colors={colors}
                    previewPage={currentVersion}
                    productCategories={productCategories}
                    productSubCategories={productSubCategories}
                    searchResults={searchResults}
                    updateSuccess={updateSuccess}
                  />
                }
              />
            )}

            {page && (
              <VersionControl
                currentVersion={currentVersion}
                page={page as Page}
                previewPages={previewPages}
                updateSuccess={publishSuccess}
              />
            )}
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default ManageHomePage;
