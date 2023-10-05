import { prisma } from "~/db.server";
import { includeBlocksData } from "~/utility/blockMaster";

export const getPreviewPage = async (id: string) => {
  return await prisma.previewPage.findUnique({
    where: { id: parseInt(id) },
    include: {
      blocks: includeBlocksData,
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
