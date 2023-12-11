import type { Page } from "./pageBuilder.server";
import { prisma } from "~/db.server";
import { includeBlocksData } from "~/utility/blockMaster/blockMaster";

export const getHomePage = async (): Promise<Page> => {
  const homePage = (await prisma.homePage.findFirst({
    include: {
      blocks: includeBlocksData,
    },
  })) as unknown as Page;

  if (!homePage) {
    throw new Error(`No Homepage Found`);
  }

  return homePage;
};
