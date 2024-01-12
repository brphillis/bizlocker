import type { Params } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { getBrands } from "~/models/brands.server";
import { getBlocks } from "~/models/blocks.server";
import { sortPreviewPages } from "~/helpers/sortHelpers";
import { getAvailableColors } from "~/models/enums.server";
import type { BlockOptions, PreviewPage } from "@prisma/client";
import { type PageNotification } from "~/hooks/PageNotification";
import type { BlockContentType } from "~/utility/blockMaster/types";
import { getProductCategories } from "~/models/productCategories.server";
import { getArticleCategories } from "~/models/articleCategories.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import {
  addPreviewPage,
  deletePage,
  deletePreviewPage,
  getPreviewPage,
} from "~/models/previewPage";
import {
  getBlockUpdateValues,
  getFormBlockOptions,
  searchContentData,
  type NewBlockData,
  type PageType,
} from "~/utility/pageBuilder";
import {
  changeBlockOrder,
  disconnectBlock,
  getPageType,
  publishPage,
  revertPreviewChanges,
  type BlockWithContent,
  type Page,
  updateBlock,
  upsertPageMeta,
} from "~/models/pageBuilder.server";

export const pageBuilderLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const articleCategories = await getArticleCategories();
  const brands = await getBrands();
  const colors = await getAvailableColors();

  const pageType = params?.pagetype?.replace(/p/g, "P");

  const url = new URL(request.url);
  const id = url.searchParams.get("id") || undefined;

  let page = {} as Page;

  if (id !== "add") {
    page = await getPageType(pageType as PageType, true, id);
  }

  let previewPages: PreviewPage[] | null | undefined = null;
  let blocks: BlockWithContent[] | null = null;
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

export const pageBuilderAction = async (
  request: Request,
  params: Params<string>,
) => {
  const pageType = params?.pagetype?.replace(/p/g, "P");

  const form = Object.fromEntries(await request.formData());
  const {
    articleCategories,
    backgroundColor,
    blockId,
    contentType,
    description,
    index,
    isActive,
    name,
    blocks,
    pageId,
    previewPageId,
    thumbnail,
    title,
    blockLabel,
  } = form;

  let actionPreview, actionBlocks;
  let notification: PageNotification;

  const blockOptions: BlockOptions = getFormBlockOptions(form);

  switch (form._action) {
    case "search":
      const searchResults = await searchContentData(
        contentType as BlockContentType,
        (name as string) || undefined,
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

      if (pageType === "article" && !articleCategories) {
        metaValidationError.push("Select at least 1 Article Category");
      }

      if (metaValidationError.length > 0) {
        return json({ metaValidationError });
      }

      const newId = await upsertPageMeta(
        pageType as PageType,
        title as string,
        description as string,
        backgroundColor as string,
        isActive as string,
        thumbnail ? JSON.parse(thumbnail as string) : undefined,
        previewPageId ? (previewPageId as string) : undefined,
        articleCategories ? JSON.parse(articleCategories as string) : undefined,
      );

      notification = {
        type: "success",
        message: "Meta Added.",
      };

      if (!previewPageId) {
        return redirect(`/admin/pagebuilder/${pageType}?id=${newId}`);
      } else {
        actionPreview = await getPreviewPage(previewPageId as string);
        actionBlocks = await getBlocks(actionPreview as any);

        return json({
          metaUpdateSuccess: newId,
          notification,
          actionPreview,
          actionBlocks,
        });
      }

    case "addpreview":
      const addPreviewSuccess = await addPreviewPage(
        pageType as PageType,
        pageId as string,
      );

      notification = {
        type: "warning",
        message: "Version Added.",
      };

      return { addPreviewSuccess, notification };

    case "deletepreview":
      const deletePreviewSuccess = await deletePreviewPage(
        previewPageId as string,
      );

      notification = {
        type: "warning",
        message: "Version Deleted.",
      };

      return json({ deletePreviewSuccess, notification });

    case "deletepage":
      await deletePage(pageId as string, pageType as PageType);

      if (pageType === "article") return redirect("/admin/articles");
      if (pageType === "webPage") return redirect("/admin/pages");

    case "changecurrentpreview":
      actionPreview = await getPreviewPage(pageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      if (actionPreview && actionBlocks) {
        notification = {
          type: "info",
          message: "Version Changed.",
        };

        return json({ actionPreview, actionBlocks, notification });
      } else {
        console.log("ERROR HAS OCCURED");
        return json({ previewChangeError: true });
      }

    case "update":
      const newBlockData = getBlockUpdateValues(form);

      const updateSuccess = await updateBlock(
        pageType as PageType,
        previewPageId as string,
        newBlockData as NewBlockData,
        blockOptions,
        blockLabel as string,
      );
      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      notification = {
        type: "success",
        message: "Block Updated.",
      };

      return json({ updateSuccess, actionPreview, actionBlocks, notification });

    case "publish":
      const publishSuccess = await publishPage(
        pageType as PageType,
        previewPageId as string,
        pageId as string,
        request,
      );

      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      notification = {
        type: "success",
        message: "Page Published.",
      };

      return json({
        actionPreview,
        actionBlocks,
        publishSuccess,
        notification,
      });

    case "revert":
      const revertSuccess = await revertPreviewChanges(
        pageType as PageType,
        previewPageId as string,
        pageId as string,
      );

      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      notification = {
        type: "warning",
        message: "Reverted To Published.",
      };

      return json({ actionPreview, actionBlocks, revertSuccess, notification });

    case "rearrange":
      const { direction } = form;

      await changeBlockOrder(
        previewPageId as string,
        blocks as string,
        parseInt(index as string),
        direction as "up" | "down",
      );

      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      return json({ actionPreview, actionBlocks });

    case "delete":
      await disconnectBlock(blockId as string, previewPageId as string);
      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as any);

      notification = {
        type: "success",
        message: "Block Removed.",
      };

      return json({ actionPreview, actionBlocks, notification });

    default:
      return null;
  }
};
