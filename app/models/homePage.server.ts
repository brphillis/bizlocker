import { buildBlocksContentQuery } from "~/utility/blockMaster/blockMaster";
import type { Page } from "./pageBuilder.server";
import { prisma } from "~/db.server";

export const getHomePage = async (): Promise<Page | undefined> => {
  // get the homepage
  const homePage = await prisma.homePage.findFirst({
    include: {
      blocks: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!homePage) {
    throw new Error(`No Homepage Found`);
  }

  // get the homepage with appropriate content
  // this avoids doing nested queries to all content types to begin with
  // and only querying for relevant content assosiated with the pages active blocks

  if (homePage.blocks) {
    // get the homepage
    const homePageWithContent = (await prisma.homePage.findFirst({
      include: {
        blocks: {
          include: {
            blockOptions: true,
            content: buildBlocksContentQuery(homePage.blocks),
          },
        },
      },
    })) as unknown as Page;

    return homePageWithContent;
  } else {
    throw new Error(`Page has No Content`);
  }
};
