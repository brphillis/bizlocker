import { prisma } from "~/db.server";

export const getHomePage = async () => {
  return prisma.page.findFirst({
    where: {
      isHomePage: true,
    },
    include: {
      pageItems: {
        include: {
          advertBannerBlock: {
            include: {
              campaign: true,
              promotion: true,
            },
          },
          advertTileBlock: {
            include: {
              campaign: true,
              promotion: true,
            },
          },
        },
      },
    },
  });
};

export const removePageItem = async (pageId: number, itemIndex: number) => {
  if (itemIndex === 0) {
    throw new Error("Cannot remove item at index 0");
  }

  const page = await prisma.page.findUnique({ where: { id: pageId } });

  if (!page) {
    throw new Error(`Page not found for pageId: ${pageId}`);
  }

  const pageItems = await prisma.pageItem.findMany({
    where: { pageId: page.id },
    orderBy: { order: "asc" },
  });

  const isValidItemIndex = itemIndex >= 0 && itemIndex < pageItems.length;

  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  const pageItemToRemove = pageItems[itemIndex];

  await prisma.pageItem.delete({ where: { id: pageItemToRemove.id } });

  return true;
};

export const updatePage = async (
  pageId: number,
  itemIndex: number,
  blockType: BlockType,
  contentType: BlockData,
  updateData: Promotion | Campaign
) => {
  // Retrieve the page by pageId
  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
    },
  });

  if (!page) {
    throw new Error(`Page not found for pageId: ${pageId}`);
  }

  // Retrieve the pageItems associated with the page
  const pageItems = await prisma.pageItem.findMany({
    where: {
      pageId: page.id,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      advertBannerBlock: true,
      advertTileBlock: true,
    },
  });

  // Check if the itemIndex is within the range of available pageItems or one position after the last item
  const isValidItemIndex = itemIndex >= 0 && itemIndex <= pageItems.length;

  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  const pageItemToUpdate = pageItems.find((e) => e.order === itemIndex);

  if (pageItemToUpdate) {
    if (blockType === "banner") {
      // Retrieve the existing AdvertBannerBlock
      const advertBannerBlock = pageItemToUpdate.advertBannerBlock;

      if (advertBannerBlock) {
        // Disconnect all existing data from the AdvertBannerBlock
        await prisma.advertBannerBlock.update({
          where: {
            id: advertBannerBlock.id,
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
          // Update the AdvertBannerBlock with the new promotion
          const updatedAdvertBannerBlock =
            await prisma.advertBannerBlock.update({
              where: {
                id: advertBannerBlock.id,
              },
              data: {
                type: contentType,
                promotion: {
                  connect: {
                    id: updateData.id,
                  },
                },
              },
            });

          // Update the PageItem with the updated AdvertBannerBlock and itemOrder
          await prisma.pageItem.update({
            where: {
              id: pageItemToUpdate.id,
            },
            data: {
              order: itemIndex === 0 ? 0 : itemIndex,
              advertBannerBlock: {
                connect: {
                  id: updatedAdvertBannerBlock.id,
                },
              },
              advertTileBlock: {
                disconnect: true,
              },
            },
          });
        } else if (contentType === "campaign") {
          // Update the AdvertBannerBlock with the new campaign
          const updatedAdvertBannerBlock =
            await prisma.advertBannerBlock.update({
              where: {
                id: advertBannerBlock.id,
              },
              data: {
                type: contentType,
                campaign: {
                  connect: {
                    id: updateData.id,
                  },
                },
              },
            });

          // Update the PageItem with the updated AdvertBannerBlock and itemOrder
          await prisma.pageItem.update({
            where: {
              id: pageItemToUpdate.id,
            },
            data: {
              order: itemIndex === 0 ? 0 : itemIndex,
              advertBannerBlock: {
                connect: {
                  id: updatedAdvertBannerBlock.id,
                },
              },
              advertTileBlock: {
                disconnect: true,
              },
            },
          });
        }
      }
    } else if (blockType === "tile") {
      // Retrieve the existing AdvertTileBlock
      const advertTileBlock = pageItemToUpdate.advertTileBlock;

      if (advertTileBlock) {
        // Disconnect all existing data from the AdvertTileBlock
        await prisma.advertTileBlock.update({
          where: {
            id: advertTileBlock.id,
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
          // Update the AdvertTileBlock with the new promotion
          const updatedAdvertTileBlock = await prisma.advertTileBlock.update({
            where: {
              id: advertTileBlock.id,
            },
            data: {
              type: contentType,
              promotion: {
                connect: {
                  id: updateData.id,
                },
              },
            },
          });

          // Update the PageItem with the updated AdvertTileBlock and itemOrder
          await prisma.pageItem.update({
            where: {
              id: pageItemToUpdate.id,
            },
            data: {
              order: itemIndex === 0 ? 0 : itemIndex,
              advertTileBlock: {
                connect: {
                  id: updatedAdvertTileBlock.id,
                },
              },
              advertBannerBlock: {
                disconnect: true,
              },
            },
          });
        } else if (contentType === "campaign") {
          // Update the AdvertTileBlock with the new campaign
          const updatedAdvertTileBlock = await prisma.advertTileBlock.update({
            where: {
              id: advertTileBlock.id,
            },
            data: {
              type: contentType,
              campaign: {
                connect: {
                  id: updateData.id,
                },
              },
            },
          });

          // Update the PageItem with the updated AdvertTileBlock and itemOrder
          await prisma.pageItem.update({
            where: {
              id: pageItemToUpdate.id,
            },
            data: {
              order: itemIndex === 0 ? 0 : itemIndex,
              advertTileBlock: {
                connect: {
                  id: updatedAdvertTileBlock.id,
                },
              },
              advertBannerBlock: {
                disconnect: true,
              },
            },
          });
        }
      }
    } else {
      throw new Error(`Invalid type: ${blockType}`);
    }
  } else {
    // Create a new PageItem
    const newPageItem = await prisma.pageItem.create({
      data: {
        order: itemIndex === 0 ? 0 : itemIndex,
        page: {
          connect: {
            id: page.id,
          },
        },
      },
    });

    if (blockType === "banner") {
      if (contentType === "promotion") {
        // Create a new AdvertBannerBlock with the promotion
        await prisma.advertBannerBlock.create({
          data: {
            type: contentType,
            promotion: {
              connect: {
                id: updateData.id,
              },
            },
            pageItem: {
              connect: {
                id: newPageItem.id,
              },
            },
          },
        });
      } else if (contentType === "campaign") {
        // Create a new AdvertBannerBlock with the campaign
        await prisma.advertBannerBlock.create({
          data: {
            type: contentType,
            campaign: {
              connect: {
                id: updateData.id,
              },
            },
            pageItem: {
              connect: {
                id: newPageItem.id,
              },
            },
          },
        });
      } else {
        throw new Error(`Invalid data type: ${contentType}`);
      }
    } else if (blockType === "tile") {
      if (contentType === "promotion") {
        // Create a new AdvertTileBlock with the promotion
        await prisma.advertTileBlock.create({
          data: {
            type: contentType,
            promotion: {
              connect: {
                id: updateData.id,
              },
            },
            tileSize: "large", // Change this to the desired tile size
            pageItem: {
              connect: {
                id: newPageItem.id,
              },
            },
          },
        });
      } else if (contentType === "campaign") {
        // Create a new AdvertTileBlock with the campaign
        await prisma.advertTileBlock.create({
          data: {
            type: contentType,
            campaign: {
              connect: {
                id: updateData.id,
              },
            },
            tileSize: "large", // Change this to the desired tile size
            pageItem: {
              connect: {
                id: newPageItem.id,
              },
            },
          },
        });
      } else {
        throw new Error(`Invalid data type: ${contentType}`);
      }
    } else {
      throw new Error(`Invalid type: ${blockType}`);
    }
  }

  return true; // Return true to indicate successful update
};
