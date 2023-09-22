import { prisma } from "~/db.server";
import { includeBlocksData } from "~/utility/blockMaster";

export const getHomePage = async () => {
  return prisma.homePage.findFirst({
    include: {
      blocks: includeBlocksData,
    },
  });
};

export const upsertHomePageInfo = async (
  title: string,
  description: string,
  homePageId?: number
) => {
  let homePage;

  if (!homePageId) {
    homePage = await prisma.homePage.create({
      // Provide the desired properties for the new homePage
      data: {
        title: title,
        description: description,
      },
    });
  } else {
    // Retrieve the homePage by homePageId
    homePage = await prisma.homePage.findUnique({
      where: {
        id: homePageId,
      },
    });

    if (!homePage) {
      throw new Error(`homePage not found for homePageId: ${homePageId}`);
    }

    // Update the existing homePage's title and thumbnail
    homePage = await prisma.homePage.update({
      where: {
        id: homePage.id,
      },
      data: {
        title: title,
        description: description,
      },
    });
  }

  return homePage.id;
};
