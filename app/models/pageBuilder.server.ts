import { prisma } from "~/db.server";

const updateOrCreateBlockOptions = async (
  blockId: string,
  blockOptions: NewBlockOptions
): Promise<void> => {
  const existingBlockOptions = await prisma.blockOptions.findUnique({
    where: { blockOptionsId: blockId },
  });

  if (existingBlockOptions) {
    await prisma.blockOptions.update({
      where: { id: existingBlockOptions.id },
      data: { block: { connect: { id: blockId } }, ...blockOptions },
    });
  } else {
    await prisma.blockOptions.create({
      data: { block: { connect: { id: blockId } }, ...blockOptions },
    });
  }
};

export const updatePageBlock = async (
  pageType: "homePage" | "article",
  pageId: number,
  blockData: NewBlockData,
  blockOptions?: NewBlockOptions
): Promise<string | number> => {
  const { blockName, itemIndex, contentType, contentData, stringData } =
    blockData;

  let page;

  if (pageType === "homePage") {
    page = await prisma.homePage.findUnique({
      where: { id: pageId },
    });
  } else if (pageType === "article") {
    page = await prisma.article.findUnique({
      where: { id: pageId },
    });
  } else {
    throw new Error(`Invalid page type: ${pageType}`);
  }

  if (!page) {
    throw new Error(`Page not found for pageId: ${pageId}`);
  }

  const blocks = await prisma.block.findMany({
    where: { [`${pageType}Id`]: page.id },
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

        if (blockOptions) {
          await updateOrCreateBlockOptions(updatedBannerBlock.id, blockOptions);
        }
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

        if (blockOptions) {
          await updateOrCreateBlockOptions(updatedTileBlock.id, blockOptions);
        }
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

        if (blockOptions) {
          await updateOrCreateBlockOptions(updatedTextBlock.id, blockOptions);
        }
      }
    } else {
      await deleteBlockIfInvalid(blockToUpdate.id);
      throw new Error(`Invalid type: ${blockName}`);
    }
  } else {
    const newBlock = await prisma.block.create({
      data: {
        order: itemIndex === 0 ? 0 : itemIndex,
        [`${pageType}`]: { connect: { id: page.id } },
      },
    });

    if (blockOptions) {
      await updateOrCreateBlockOptions(newBlock.id, blockOptions);
    }

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
        await deleteBlockIfInvalid(newBlock.id);
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
        await deleteBlockIfInvalid(newBlock.id);
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
      await deleteBlockIfInvalid(newBlock.id);
      throw new Error(`Invalid type: ${blockName}`);
    }
  }

  return page.id;
};

export const changeBlockOrder = async (
  pageType: "homePage" | "article",
  pageId: number,
  index: number,
  direction: "up" | "down"
) => {
  let blockToMove;

  if (pageType === "homePage") {
    blockToMove = await prisma.block.findFirst({
      where: { homePageId: pageId },
      orderBy: { order: "asc" },
      skip: index,
      take: 1,
    });
  } else if (pageType === "article") {
    blockToMove = await prisma.block.findFirst({
      where: { articleId: pageId },
      orderBy: { order: "asc" },
      skip: index,
      take: 1,
    });
  } else {
    throw new Error(`Invalid page type: ${pageType}`);
  }

  if (!blockToMove) {
    throw new Error(`Block not found at index ${index}`);
  }

  let maxIndex;

  if (pageType === "homePage") {
    maxIndex =
      (await prisma.block.count({ where: { homePageId: pageId } })) - 1;
  } else if (pageType === "article") {
    maxIndex = (await prisma.block.count({ where: { articleId: pageId } })) - 1;
  }

  let newOrder: number;
  if (direction === "up") {
    newOrder = blockToMove.order - 1;
    if (newOrder < 0) {
      newOrder = 0;
    }
  } else if (direction === "down" && maxIndex) {
    newOrder = blockToMove.order + 1;
    if (newOrder > maxIndex) {
      newOrder = maxIndex;
    }
  } else {
    throw new Error(`Invalid direction: ${direction}`);
  }

  if (pageType === "homePage") {
    await prisma.$transaction([
      prisma.block.update({
        where: { id: blockToMove.id },
        data: { order: newOrder },
      }),
      prisma.block.updateMany({
        where: {
          homePageId: pageId,
          id: { not: blockToMove.id },
          order:
            direction === "up"
              ? { gte: newOrder, lte: blockToMove.order }
              : { lte: newOrder, gte: blockToMove.order },
        },
        data: {
          order: {
            [direction === "up" ? "increment" : "decrement"]: 1,
          },
        },
      }),
    ]);
  } else if (pageType === "article") {
    await prisma.$transaction([
      prisma.block.update({
        where: { id: blockToMove.id },
        data: { order: newOrder },
      }),
      prisma.block.updateMany({
        where: {
          articleId: pageId,
          id: { not: blockToMove.id },
          order:
            direction === "up"
              ? { gte: newOrder, lte: blockToMove.order }
              : { lte: newOrder, gte: blockToMove.order },
        },
        data: {
          order: {
            [direction === "up" ? "increment" : "decrement"]: 1,
          },
        },
      }),
    ]);
  }

  return true;
};

export const removeBlock = async (pageId: number, itemIndex: number) => {
  let page;
  let blocks;

  // Check if the pageId corresponds to a HomePage or an Article
  const isHomePage = await prisma.homePage.findUnique({
    where: { id: pageId },
  });
  const isArticlePage = await prisma.article.findUnique({
    where: { id: pageId },
  });

  if (isHomePage) {
    page = isHomePage;
    blocks = await prisma.block.findMany({
      where: { homePageId: page.id },
      orderBy: { order: "asc" },
      include: {
        bannerBlock: true,
        tileBlock: true,
        textBlock: true,
        blockOptions: true,
      },
    });
  } else if (isArticlePage) {
    page = isArticlePage;
    blocks = await prisma.block.findMany({
      where: { articleId: page.id },
      orderBy: { order: "asc" },
      include: {
        bannerBlock: true,
        tileBlock: true,
        textBlock: true,
        blockOptions: true,
      },
    });
  } else {
    throw new Error(`Page not found for pageId: ${pageId}`);
  }

  if (itemIndex === 0) {
    throw new Error("Cannot remove item at index 0");
  }

  const isValidItemIndex = itemIndex >= 0 && itemIndex < blocks.length;

  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  const blockToRemove = blocks[itemIndex];

  if (blockToRemove.blockOptions) {
    // Delete the blockOptions associated with the block
    await prisma.blockOptions.delete({
      where: { id: blockToRemove.blockOptions.id },
    });
  }

  const transaction = [];

  if (blockToRemove.bannerBlock) {
    const deleteBannerBlockPromise = prisma.bannerBlock.delete({
      where: { id: blockToRemove.bannerBlock.id },
    });
    transaction.push(deleteBannerBlockPromise);
  }

  if (blockToRemove.tileBlock) {
    const deleteTileBlockPromise = prisma.tileBlock.delete({
      where: { id: blockToRemove.tileBlock.id },
    });
    transaction.push(deleteTileBlockPromise);
  }

  if (blockToRemove.textBlock) {
    const deleteTextBlockPromise = prisma.textBlock.delete({
      where: { id: blockToRemove.textBlock.id },
    });
    transaction.push(deleteTextBlockPromise);
  }

  const deleteBlockPromise = prisma.block.delete({
    where: { id: blockToRemove.id },
  });
  transaction.push(deleteBlockPromise);

  await prisma.$transaction(transaction);

  // Only update 'order' property of blocks that come after the removed one
  const itemsToUpdate = blocks.slice(itemIndex + 1);

  const updatePromises = itemsToUpdate.map((item, i) =>
    prisma.block.update({
      where: { id: item.id },
      data: { order: item.order - 1 },
    })
  );

  await prisma.$transaction(updatePromises);

  return true;
};

export const deleteBlockIfInvalid = async (blockId: string) => {
  const block = await prisma.block.findUnique({
    where: { id: blockId },
    include: {
      tileBlock: true,
      textBlock: true,
      productBlock: true,
      bannerBlock: true,
      blockOptions: true,
    },
  });

  if (
    block &&
    !block.tileBlock &&
    !block.textBlock &&
    !block.productBlock &&
    !block.bannerBlock
  ) {
    if (block.blockOptionsId) {
      await prisma.blockOptions.delete({ where: { id: block.blockOptionsId } });
    }
    await prisma.block.delete({ where: { id: blockId } });
    console.log("Block and associated options deleted successfully.");
  } else {
    console.log("Block has associated blocks and cannot be deleted.");
  }
};
