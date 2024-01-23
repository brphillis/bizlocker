import type { PreviewPage } from "@prisma/client";
import { prisma } from "~/db.server";
import { disconnectBlock } from "../PageBuilder/index.server";
import type { PageType } from "~/utility/pageBuilder";
import { buildBlocksContentQuery } from "~/utility/blockMaster/blockMaster";
import { getBlocks } from "../Blocks/index.server";
import { Page } from "../PageBuilder/types";
import { BlockWithContent } from "../Blocks/types";

export const getPreviewPage = async (id: string): Promise<Page | undefined> => {
  // get the homepage
  const previewPage = await prisma.previewPage.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      blocks: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (previewPage && previewPage.blocks) {
    // get the previewPage
    const previewPageWithContent = (await prisma.previewPage.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        blocks: {
          include: {
            blockOptions: true,
            content: buildBlocksContentQuery(previewPage.blocks),
          },
        },
        articleCategories: true,
        thumbnail: true,
      },
    })) as Page;

    return previewPageWithContent;
  }
};

export const addPreviewPage = async (
  pageType: PageType,
  pageId: string,
): Promise<PreviewPage> => {
  return await prisma.previewPage.create({
    data: {
      [pageType]: { connect: { id: parseInt(pageId) } },
    },
  });
};

export const deletePreviewPage = async (
  previewPageId: string,
): Promise<PreviewPage> => {
  const previewPage = (await prisma.previewPage.findUnique({
    where: { id: parseInt(previewPageId) },
    include: {
      blocks: {
        include: { content: true },
      },
    },
  })) as Page;

  if (previewPage && previewPage.blocks) {
    const blocks = await getBlocks(previewPage);

    // Use `Promise.all` to wait for all `disconnectBlock` promises to resolve.
    await Promise.all(
      blocks.map(async ({ id }: BlockWithContent) => {
        await disconnectBlock(id.toString(), previewPageId);
      }),
    );
  }

  return await prisma.previewPage.delete({
    where: { id: parseInt(previewPageId) },
  });
};

export const deletePage = async (
  pageId: string,
  pageType: PageType,
): Promise<{ success: true }> => {
  // Disconnect any removed blocks from published
  const findPage = prisma[`${pageType}`].findUnique as (
    args: unknown,
  ) => unknown;

  const page = (await findPage({
    where: { id: parseInt(pageId) },
    include: {
      blocks: true,
      previewPage: true,
    },
  })) as unknown as Page;

  const previewPages = page.previewPage;

  if (previewPages) {
    await Promise.all(
      previewPages.map(async ({ id }: PreviewPage) => {
        await deletePreviewPage(id.toString());
      }),
    );
  }

  const deletePageAsync = prisma[`${pageType}`].delete as (
    args: unknown,
  ) => unknown;

  await deletePageAsync({
    where: { id: parseInt(pageId) },
  });

  return { success: true };
};
