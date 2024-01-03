import { activeContentTypes } from "~/utility/blockMaster/blockMaster";
import type { Page } from "./pageBuilder.server";
import { prisma } from "~/db.server";

export const getHomePage = async (): Promise<Page> => {
  const homePage = (await prisma.homePage.findFirst({
    include: {
      blocks: {
        include: {
          blockOptions: true,
          content: {
            include: activeContentTypes,
          },
        },
      },
    },
  })) as unknown as Page;

  if (!homePage) {
    throw new Error(`No Homepage Found`);
  }
  return homePage;
};
