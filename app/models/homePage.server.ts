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
        },
      },
    },
  });
};

export const updateHomePage = async (
  pageId: number,
  itemIndex: number,
  blockName: BlockName,
  contentType: BlockContentType,
  updateData: Promotion[] | Campaign[]
) => {
  // Retrieve the page by pageId
  const page = await prisma.homePage.findUnique({
    where: {
      id: pageId,
    },
  });

  if (!page) {
    throw new Error(`Page not found for pageId: ${pageId}`);
  }

  // Retrieve the blocks associated with the page
  const blocks = await prisma.block.findMany({
    where: {
      homePageId: page.id,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      bannerBlock: true,
      tileBlock: true,
    },
  });

  // Check if the itemIndex is within the range of available blocks or one position after the last item
  const isValidItemIndex = itemIndex >= 0 && itemIndex <= blocks.length;

  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  const blockToUpdate = blocks.find((e) => e.order === itemIndex);

  if (blockToUpdate) {
    if (blockName === "banner") {
      // Retrieve the existing BannerBlock
      const bannerBlock = blockToUpdate.bannerBlock;

      if (bannerBlock) {
        // Disconnect all existing data from BannerBlock
        await prisma.bannerBlock.update({
          where: {
            id: bannerBlock.id,
          },
          data: {
            promotion: {
              disconnect: true,
            },
            campaign: {
              disconnect: true,
            },
          },
        });

        if (contentType === "promotion") {
          // Update the BannerBlock with the new promotion
          const updatedBannerBlock = await prisma.bannerBlock.update({
            where: {
              id: bannerBlock.id,
            },
            data: {
              type: contentType,
              promotion: {
                connect: {
                  id: updateData[0].id,
                },
              },
            },
          });

          // Update the blocks with the updated BannerBlock and itemOrder
          await prisma.block.update({
            where: {
              id: blockToUpdate.id,
            },
            data: {
              order: itemIndex === 0 ? 0 : itemIndex,
              bannerBlock: {
                connect: {
                  id: updatedBannerBlock.id,
                },
              },
              tileBlock: {
                disconnect: true,
              },
            },
          });
        } else if (contentType === "campaign") {
          // Update the BannerBlock with the new campaign
          const updatedBannerBlock = await prisma.bannerBlock.update({
            where: {
              id: bannerBlock.id,
            },
            data: {
              type: contentType,
              campaign: {
                connect: {
                  id: updateData[0].id,
                },
              },
            },
          });

          // Update the block with the updated BannerBlock and itemOrder
          await prisma.block.update({
            where: {
              id: blockToUpdate.id,
            },
            data: {
              order: itemIndex === 0 ? 0 : itemIndex,
              bannerBlock: {
                connect: {
                  id: updatedBannerBlock.id,
                },
              },
              tileBlock: {
                disconnect: true,
              },
            },
          });
        }
      }
    } else if (blockName === "tile") {
      // Retrieve the existing TileBlock
      const tileBlock = blockToUpdate.tileBlock;

      if (tileBlock) {
        // Disconnect all existing data from the TileBlock
        await prisma.tileBlock.update({
          where: {
            id: tileBlock.id,
          },
          data: {
            promotions: undefined,
            campaigns: undefined,
          },
        });

        if (contentType === "promotion") {
          // Update the TileBlock with the new promotion
          const updatedTileBlock = await prisma.tileBlock.update({
            where: {
              id: tileBlock.id,
            },
            data: {
              type: contentType,
              promotions: {
                connect: updateData.map((promotion) => ({ id: promotion.id })),
              },
            },
          });

          // Update the block with the updated TileBlock and itemOrder
          await prisma.block.update({
            where: {
              id: blockToUpdate.id,
            },
            data: {
              order: itemIndex === 0 ? 0 : itemIndex,
              tileBlock: {
                connect: {
                  id: updatedTileBlock.id,
                },
              },
              bannerBlock: {
                disconnect: true,
              },
            },
          });
        } else if (contentType === "campaign") {
          // Update the TileBlock with the new campaign
          const updatedTileBlock = await prisma.tileBlock.update({
            where: {
              id: tileBlock.id,
            },
            data: {
              type: contentType,
              campaigns: {
                connect: updateData.map((campaign) => ({ id: campaign.id })),
              },
            },
          });

          // Update the block with the updated TileBlock and itemOrder
          await prisma.block.update({
            where: {
              id: blockToUpdate.id,
            },
            data: {
              order: itemIndex === 0 ? 0 : itemIndex,
              tileBlock: {
                connect: {
                  id: updatedTileBlock.id,
                },
              },
              bannerBlock: {
                disconnect: true,
              },
            },
          });
        }
      }
    } else {
      throw new Error(`Invalid type: ${blockName}`);
    }
  } else {
    // Create a new block
    const newBlock = await prisma.block.create({
      data: {
        order: itemIndex === 0 ? 0 : itemIndex,
        homePage: {
          connect: {
            id: page.id,
          },
        },
      },
    });

    if (blockName === "banner") {
      if (contentType === "promotion") {
        // Create a new BannerBlock with the promotion
        await prisma.bannerBlock.create({
          data: {
            type: contentType,
            promotion: {
              connect: {
                id: updateData[0].id,
              },
            },
            block: {
              connect: {
                id: newBlock.id,
              },
            },
          },
        });
      } else if (contentType === "campaign") {
        // Create a new BannerBlock with the campaign
        await prisma.bannerBlock.create({
          data: {
            type: contentType,
            campaign: {
              connect: {
                id: updateData[0].id,
              },
            },
            block: {
              connect: {
                id: newBlock.id,
              },
            },
          },
        });
      } else {
        throw new Error(`Invalid data type: ${contentType}`);
      }
    } else if (blockName === "tile") {
      if (contentType === "promotion") {
        // Create a new TileBlock with the promotion
        await prisma.tileBlock.create({
          data: {
            type: contentType,
            promotions: {
              connect: updateData.map((promotion) => ({ id: promotion.id })),
            },
            tileSize: "large", // Change this to the desired tile size
            block: {
              connect: {
                id: newBlock.id,
              },
            },
          },
        });
      } else if (contentType === "campaign") {
        // Create a new TileBlock with the campaign
        await prisma.tileBlock.create({
          data: {
            type: contentType,
            campaigns: {
              connect: updateData.map((campaign) => ({ id: campaign.id })),
            },
            tileSize: "large", // Change this to the desired tile size
            block: {
              connect: {
                id: newBlock.id,
              },
            },
          },
        });
      } else {
        throw new Error(`Invalid data type: ${contentType}`);
      }
    } else {
      throw new Error(`Invalid type: ${blockName}`);
    }
  }

  return true; // Return true to indicate successful update
};
