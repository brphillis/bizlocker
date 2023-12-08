import { prisma } from "~/db.server";
import { includeBlocksData } from "~/utility/blockMaster";

export const getHomePage = async (): Promise<Page> => {
  const homePage = (await prisma.homePage.findFirst({
    include: {
      blocks: includeBlocksData,
    },
  })) as Page;

  if (!homePage) {
    throw new Error(`No Homepage Found`);
  }

  return homePage;
};
