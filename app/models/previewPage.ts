import { prisma } from "~/db.server";
import { includeBlocksData } from "~/utility/blockMaster";

export const getPreviewPage = async (id: number) => {
  return await prisma.previewPage.findUnique({
    where: { id },
    include: {
      blocks: includeBlocksData,
    },
  });
};
