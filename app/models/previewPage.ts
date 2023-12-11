import type { PreviewPage } from "@prisma/client";
import { prisma } from "~/db.server";
import {
  type Page,
  type PageBlock,
  disconnectBlock,
} from "./pageBuilder.server";
import { getBlocks } from "~/helpers/blockHelpers";
import { includeBlocksData } from "~/utility/blockMaster";
import type { PageType } from "~/utility/pageBuilder";

export const getPreviewPage = async (id: string): Promise<Page | null> => {
  return (await prisma.previewPage.findUnique({
    where: { id: parseInt(id) },
    include: {
      blocks: includeBlocksData,
      articleCategories: true,
      thumbnail: true,
    },
  })) as unknown as Page;
};

export const addPreviewPage = async (
  pageType: PageType,
  pageId: string
): Promise<PreviewPage> => {
  return await prisma.previewPage.create({
    data: {
      [pageType]: { connect: { id: parseInt(pageId) } },
    },
  });
};

export const deletePreviewPage = async (
  previewPageId: string
): Promise<PreviewPage> => {
  const previewPage = await prisma.previewPage.findUnique({
    where: { id: parseInt(previewPageId) },
    include: {
      blocks: includeBlocksData,
    },
  });

  if (previewPage && previewPage.blocks) {
    const blocks = await getBlocks(previewPage as any);

    // Use `Promise.all` to wait for all `disconnectBlock` promises to resolve.
    await Promise.all(
      blocks.map(async ({ id, name }: PageBlock) => {
        await disconnectBlock(id, name, previewPageId);
      })
    );
  }

  return await prisma.previewPage.delete({
    where: { id: parseInt(previewPageId) },
  });
};

export const deletePage = async (
  pageId: string,
  pageType: PageType
): Promise<{ success: true }> => {
  // Disconnect any removed blocks from published
  const findPage = prisma[`${pageType}`].findUnique as (args: any) => any;

  const page = await findPage({
    where: { id: parseInt(pageId) },
    include: {
      blocks: true,
      previewPage: true,
    },
  });

  const previewPages = page.previewPage;

  await Promise.all(
    previewPages.map(async ({ id }: PreviewPage) => {
      await deletePreviewPage(id.toString());
    })
  );

  const deletePageAsync = prisma[`${pageType}`].delete as (args: any) => any;

  await deletePageAsync({
    where: { id: parseInt(pageId) },
  });

  return { success: true };
};
