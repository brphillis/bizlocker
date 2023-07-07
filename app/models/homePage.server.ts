import { prisma } from "~/db.server";

export const getHomePage = async () => {
  return prisma.homePage.findFirst({
    include: {
      blocks: {
        include: {
          bannerBlock: {
            include: {
              campaign: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
              promotion: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
            },
          },
          tileBlock: {
            include: {
              campaigns: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
              promotions: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
            },
          },
          textBlock: true,
        },
      },
    },
  });
};

export const updateHomePage = async (
  itemIndex: number,
  blockName: BlockName,
  pageId: number,
  contentType?: BlockContentType,
  contentData?: Promotion[] | Campaign[],
  stringData?: string
) => {
  const page = await prisma.homePage.findUnique({
    where: { id: pageId },
  });

  if (!page) {
    throw new Error(`Page not found for pageId: ${pageId}`);
  }

  const blocks = await prisma.block.findMany({
    where: { homePageId: page.id },
    orderBy: { order: "asc" },
    include: { bannerBlock: true, tileBlock: true, textBlock: true },
  });

  const isValidItemIndex = itemIndex >= 0 && itemIndex <= blocks.length;
  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  const blockToUpdate = blocks.find((e) => e.order === itemIndex);
  if (blockToUpdate) {
    if (blockName === "banner" && contentData) {
      const bannerBlock = blockToUpdate.bannerBlock;
      if (bannerBlock) {
        await prisma.bannerBlock.update({
          where: { id: bannerBlock.id },
          data: {
            promotion: { disconnect: true },
            campaign: { disconnect: true },
          },
        });

        const updatedBannerBlock = await prisma.bannerBlock.update({
          where: { id: bannerBlock.id },
          data: {
            type: contentType,
            promotion:
              contentType === "promotion"
                ? { connect: { id: contentData[0].id } }
                : undefined,
            campaign:
              contentType === "campaign"
                ? { connect: { id: contentData[0].id } }
                : undefined,
          },
        });

        await prisma.block.update({
          where: { id: blockToUpdate.id },
          data: {
            order: itemIndex === 0 ? 0 : itemIndex,
            bannerBlock: { connect: { id: updatedBannerBlock.id } },
            tileBlock: { disconnect: true },
          },
        });
      }
    } else if (blockName === "tile" && contentData) {
      const tileBlock = blockToUpdate.tileBlock;
      if (tileBlock) {
        await prisma.tileBlock.update({
          where: { id: tileBlock.id },
          data: {
            promotions:
              contentType === "promotion"
                ? { connect: contentData.map((p) => ({ id: p.id })) }
                : undefined,
            campaigns:
              contentType === "campaign"
                ? { connect: contentData.map((c) => ({ id: c.id })) }
                : undefined,
          },
        });

        const updatedTileBlock = await prisma.tileBlock.update({
          where: { id: tileBlock.id },
          data: {
            type: contentType,
            promotions:
              contentType === "promotion"
                ? { connect: contentData.map((p) => ({ id: p.id })) }
                : undefined,
            campaigns:
              contentType === "campaign"
                ? { connect: contentData.map((c) => ({ id: c.id })) }
                : undefined,
          },
        });

        await prisma.block.update({
          where: { id: blockToUpdate.id },
          data: {
            order: itemIndex === 0 ? 0 : itemIndex,
            tileBlock: { connect: { id: updatedTileBlock.id } },
            bannerBlock: { disconnect: true },
          },
        });
      }
    } else if (blockName === "text" && stringData) {
      const textBlock = blockToUpdate.textBlock;
      if (textBlock) {
        const updatedTextBlock = await prisma.textBlock.update({
          where: { id: textBlock.id },
          data: { content: [stringData] },
        });

        await prisma.block.update({
          where: { id: blockToUpdate.id },
          data: {
            order: itemIndex === 0 ? 0 : itemIndex,
            textBlock: { connect: { id: updatedTextBlock.id } },
            bannerBlock: { disconnect: true },
            tileBlock: { disconnect: true },
          },
        });
      }
    } else {
      throw new Error(`Invalid type: ${blockName}`);
    }
  } else {
    const newBlock = await prisma.block.create({
      data: {
        order: itemIndex === 0 ? 0 : itemIndex,
        homePage: { connect: { id: page.id } },
      },
    });

    if (blockName === "banner" && contentData) {
      if (contentType === "promotion") {
        await prisma.bannerBlock.create({
          data: {
            type: contentType,
            promotion: { connect: { id: contentData[0].id } },
            block: { connect: { id: newBlock.id } },
          },
        });
      } else if (contentType === "campaign" && contentData) {
        await prisma.bannerBlock.create({
          data: {
            type: contentType,
            campaign: { connect: { id: contentData[0].id } },
            block: { connect: { id: newBlock.id } },
          },
        });
      } else {
        throw new Error(`Invalid data type: ${contentType}`);
      }
    } else if (blockName === "tile" && contentData) {
      if (contentType === "promotion") {
        await prisma.tileBlock.create({
          data: {
            type: contentType,
            promotions: { connect: contentData.map((p) => ({ id: p.id })) },
            block: { connect: { id: newBlock.id } },
          },
        });
      } else if (contentType === "campaign" && contentData) {
        await prisma.tileBlock.create({
          data: {
            type: contentType,
            campaigns: { connect: contentData.map((c) => ({ id: c.id })) },
            block: { connect: { id: newBlock.id } },
          },
        });
      } else {
        throw new Error(`Invalid data type: ${contentType}`);
      }
    } else if (blockName === "text" && stringData) {
      const newTextBlock = await prisma.textBlock.create({
        data: {
          content: [stringData],
          block: { connect: { id: newBlock.id } },
        },
      });

      await prisma.block.update({
        where: { id: newBlock.id },
        data: {
          order: itemIndex === 0 ? 0 : itemIndex,
          textBlock: { connect: { id: newTextBlock.id } },
          bannerBlock: { disconnect: true },
          tileBlock: { disconnect: true },
        },
      });
    } else {
      throw new Error(`Invalid type: ${blockName}`);
    }
  }

  return true;
};
