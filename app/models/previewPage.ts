import { prisma } from "~/db.server";
import { getBlocks } from "~/helpers/blockHelpers";
import { includeBlocksData } from "~/utility/blockMaster";
import { disconnectBlock } from "./pageBuilder.server";

export const getPreviewPage = async (id: string) => {
  return await prisma.previewPage.findUnique({
    where: { id: parseInt(id) },
    include: {
      blocks: includeBlocksData,
      articleCategories: true,
      thumbnail: true,
    },
  });
};

export const addPreviewPage = async (pageType: PageType, pageId: string) => {
  await prisma.previewPage.create({
    data: {
      [pageType]: { connect: { id: parseInt(pageId) } },
    },
  });
};

export const deletePreviewPage = async (previewPageId: string) => {
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
      blocks.map(async ({ id, name }: Block) => {
        await disconnectBlock(id, name, previewPageId);
      })
    );
  }

  await prisma.previewPage.delete({
    where: { id: parseInt(previewPageId) },
  });
};

export const deletePage = async (pageId: string, pageType: PageType) => {
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
};
