import { Params } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { Page } from "~/models/PageBuilder/types";
import { getBrands } from "~/models/Brands/index.server";
import { getBlocks } from "~/models/Blocks/index.server";
import { sortPreviewPages } from "~/helpers/sortHelpers";
import { BlockWithContent } from "~/models/Blocks/types";
import { BlockOptions, PreviewPage } from "@prisma/client";
import { BlockContentType } from "~/utility/blockMaster/types";
import { type PageNotification } from "~/hooks/PageNotification";
import { capitalizeFirstLetterOfWordInString } from "~/helpers/stringHelpers";
import { getProductCategories } from "~/models/ProductCategories/index.server";
import { getArticleCategories } from "~/models/ArticleCategories/index.server";
import { getProductSubCategories } from "~/models/ProductSubCategories/index.server";
import {
  addPreviewPage,
  deletePage,
  deletePreviewPage,
  getPreviewPage,
} from "~/models/PreviewPage/index.server";
import {
  getBlockUpdateValues,
  getFormBlockOptions,
  NewBlockData,
  PageType,
  searchContentData,
} from "~/utility/pageBuilder";
import {
  changeBlockOrder,
  disconnectBlock,
  getPageByPageType,
  publishPage,
  revertPreviewChanges,
  updateBlock,
  upsertPageMeta,
} from "~/models/PageBuilder/index.server";

export const pageBuilderLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const productCategories = await getProductCategories();
  const productSubCategories = await getProductSubCategories();
  const articleCategories = await getArticleCategories();
  const brands = await getBrands();

  const pageType = params?.pagetype?.replace(/p/g, "P") as PageType;

  const url = new URL(request.url);
  const id = url.searchParams.get("id") || undefined;

  let publishedPage = {} as Page;

  if (id !== "add") {
    publishedPage = await getPageByPageType(pageType, id);
  }

  let previewPages: PreviewPage[] | null | undefined = null;
  let blocks: BlockWithContent[] | null = null;
  let currentPreviewPage: Page | null = null;

  if (publishedPage) {
    previewPages =
      publishedPage.previewPage && sortPreviewPages(publishedPage.previewPage);

    if (previewPages && previewPages[0].id) {
      currentPreviewPage =
        (await getPreviewPage(previewPages[0].id.toString())) || null;
    }

    if (currentPreviewPage) {
      blocks = await getBlocks(currentPreviewPage);
    }
  }

  return json({
    articleCategories,
    blocks,
    brands,
    currentPreviewPage,
    publishedPage,
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
  let pageType;

  if (params?.pagetype) {
    pageType = capitalizeFirstLetterOfWordInString(params?.pagetype, "page");
  }

  const form = Object.fromEntries(await request.formData());
  const {
    articleCategories,
    backgroundColor,
    blockId,
    blockLabel,
    blocks,
    contentType,
    description,
    index,
    isActive,
    name,
    pageId,
    previewPageId,
    thumbnail,
    title,
    urlSegment,
  } = form;

  let actionPreview, actionBlocks;
  let notification: PageNotification;

  const blockOptions: BlockOptions = getFormBlockOptions(form);

  switch (form._action) {
    case "search": {
      const searchResults = await searchContentData(
        contentType as BlockContentType,
        (name as string) || undefined,
      );

      actionPreview = (await getPreviewPage(previewPageId as string)) as Page;
      actionBlocks = await getBlocks(actionPreview);

      return json({ searchResults, actionPreview, actionBlocks });
    }

    case "updateMeta": {
      const metaValidationError: string[] = [];

      if (!title) {
        metaValidationError.push("Title is Required");
      }

      if (!urlSegment && pageType !== "homePage") {
        metaValidationError.push("URL Segment is Required");
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
        urlSegment ? (urlSegment as string) : undefined,
      );

      notification = {
        type: "success",
        message: "Page Settings Updated.",
      };

      if (!previewPageId) {
        return redirect(`/admin/pagebuilder/${pageType}?id=${newId}`);
      } else {
        actionPreview = (await getPreviewPage(previewPageId as string)) as Page;
        actionBlocks = await getBlocks(actionPreview);

        return json({
          metaUpdateSuccess: newId,
          notification,
          actionPreview,
          actionBlocks,
        });
      }
    }

    case "addpreview": {
      const addPreviewSuccess = await addPreviewPage(
        pageType as PageType,
        pageId as string,
      );

      notification = {
        type: "warning",
        message: "Version Added.",
      };

      return { addPreviewSuccess, notification };
    }

    case "deletepreview": {
      const deletePreviewSuccess = await deletePreviewPage(
        previewPageId as string,
      );

      notification = {
        type: "warning",
        message: "Version Deleted.",
      };

      return json({ deletePreviewSuccess, notification });
    }

    case "deletePage": {
      await deletePage(pageId as string, pageType as PageType);

      if (pageType === "article") return redirect("/admin/articles");
      if (pageType === "webPage") return redirect("/admin/pages");
      return null;
    }

    case "changecurrentpreview": {
      actionPreview = (await getPreviewPage(pageId as string)) as Page;
      actionBlocks = await getBlocks(actionPreview);

      if (actionPreview && actionBlocks) {
        notification = {
          type: "info",
          message: "Version Changed.",
        };

        return json({ actionPreview, actionBlocks, notification });
      } else {
        return json({ previewChangeError: true });
      }
    }

    case "update": {
      const newBlockData = getBlockUpdateValues(form);

      const updateSuccess = await updateBlock(
        pageType as PageType,
        previewPageId as string,
        newBlockData as NewBlockData,
        blockOptions,
        blockLabel as string,
      );
      actionPreview = (await getPreviewPage(previewPageId as string)) as Page;
      actionBlocks = await getBlocks(actionPreview);

      notification = {
        type: "success",
        message: "Block Updated.",
      };

      return json({ updateSuccess, actionPreview, actionBlocks, notification });
    }

    case "publish": {
      const publishSuccess = await publishPage(
        pageType as PageType,
        previewPageId as string,
        pageId as string,
        request,
      );

      actionPreview = (await getPreviewPage(previewPageId as string)) as Page;
      actionBlocks = await getBlocks(actionPreview);

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
    }

    case "revert": {
      const revertSuccess = await revertPreviewChanges(
        pageType as PageType,
        previewPageId as string,
        pageId as string,
      );

      actionPreview = (await getPreviewPage(previewPageId as string)) as Page;
      actionBlocks = await getBlocks(actionPreview);

      notification = {
        type: "warning",
        message: "Reverted To Published.",
      };

      return json({ actionPreview, actionBlocks, revertSuccess, notification });
    }

    case "rearrange": {
      const { direction } = form;

      await changeBlockOrder(
        previewPageId as string,
        blocks as string,
        parseInt(index as string),
        direction as "up" | "down",
      );

      actionPreview = await getPreviewPage(previewPageId as string);
      actionBlocks = await getBlocks(actionPreview as Page);

      return json({ actionPreview, actionBlocks });
    }

    case "delete": {
      await disconnectBlock(blockId as string, previewPageId as string);
      actionPreview = (await getPreviewPage(previewPageId as string)) as Page;
      actionBlocks = await getBlocks(actionPreview);

      notification = {
        type: "success",
        message: "Block Removed.",
      };

      return json({ actionPreview, actionBlocks, notification });
    }

    default:
      return null;
  }
};
