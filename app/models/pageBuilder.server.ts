import { prisma } from "~/db.server";

const updateOrCreateBlockOptions = async (
  blockId: string,
  blockOptions: BlockOptions
): Promise<void> => {
  let existingBlockOptions;

  existingBlockOptions = await prisma.blockOptions.findFirst({
    where: { block: { id: blockId } },
  });

  if (existingBlockOptions) {
    await prisma.blockOptions.update({
      where: { id: existingBlockOptions.id },
      data: blockOptions,
    });
  } else {
    await prisma.blockOptions.create({
      data: { block: { connect: { id: blockId } }, ...blockOptions },
    });
  }
};

export const updatePageBlock = async (
  pageType: PageType,
  pageId: number,
  blockData: NewBlockData,
  blockOptions?: BlockOptions
): Promise<number | HomePage | Article | WebPage> => {
  const { blockName, itemIndex, contentData } = blockData;

  const findPage = prisma[`${pageType}`].findUnique as (args: any) => any;

  const page = await findPage({
    where: { id: pageId },
  });

  if (!page) {
    throw new Error(`Page not found for pageId: ${pageId}`);
  }

  const blocks = await prisma.block.findMany({
    where: { [`${pageType}Id`]: page.id },
    orderBy: { order: "asc" },
    include: {
      bannerBlock: true,
      tileBlock: true,
      heroBlock: true,
      textBlock: true,
      productBlock: true,
      articleBlock: true,
    },
  });

  // check if we are editing an invalid block index
  const isValidItemIndex = itemIndex >= 0 && itemIndex <= blocks.length;
  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  /// select the block we are going to edit
  const existingBlock = blocks.find((e) => e.order === itemIndex);

  if (existingBlock && blockOptions) {
    // Update Existing Block

    // if there is a block at that index, we edit it
    if (blockName && contentData) {
      // we get the type of block we are updating (eg:existingBlock.bannerBlock)
      const blockTypeToUpdate = existingBlock[`${blockName}BlockId`];

      // we find the blockContent
      const findBlockContent = prisma[`${blockName}BlockContent`].findFirst as (
        args: any // Replace 'any' with the appropriate argument type for your update method
      ) => any;

      const blockContent = await findBlockContent({
        where: {
          [`${blockName}BlockId`]: existingBlock[`${blockName}BlockId`],
        },
      });

      // we have our block and verified it is valid with content, now we begin the update process
      if (blockTypeToUpdate && blockContent) {
        const updates: Record<string, any> = {};

        for (const field in contentData) {
          if (contentData.hasOwnProperty(field)) {
            const value = contentData[field as keyof ContentData];

            if (value && !Array.isArray(value) && isNaN(value as any)) {
              // if field is NaN(not an id) it will be an Enum, populate with enum value
              updates[field as keyof ContentData] = value;
            } else if (value) {
              // If the value is truthy (not null or undefined)
              if (Array.isArray(value)) {
                // If it's an array, use 'connect' to connect multiple records
                updates[field as keyof ContentData] = {
                  set: value.map((item) => ({ id: parseInt(item as any) })),
                };
              } else {
                // If it's not an array, use 'connect' to connect a single record
                updates[field as keyof ContentData] = {
                  connect: { id: parseInt(value as any) },
                };
              }
            } else {
              // If the value is falsy (null or undefined)
              if (Array.isArray(value)) {
                // If it's an array, use 'set' with an empty array to clear the relation
                updates[field as keyof ContentData] = { set: [] };
              } else {
                // If it's not an array, use 'disconnect' to disconnect a single record
                updates[field as keyof ContentData] = { disconnect: true };
              }
            }
          }
        }

        // update the BlockContent
        const updateBlockContent = prisma[`${blockName}BlockContent`]
          .update as (
          args: any // Replace 'any' with the appropriate argument type for your update method
        ) => any;

        const updatedBlockContent = await updateBlockContent({
          where: { id: blockContent.id },
          data: updates,
        });
        console.log("UPDATING BLOCK CONTENT", updates);
        // update the BlockType
        const updateBlock = prisma[`${blockName}Block`].update as (
          args: any // Replace 'any' with the appropriate argument type for your update method
        ) => any;

        const updatedBlock = await updateBlock({
          where: { id: blockTypeToUpdate },
          data: {
            content: { connect: { id: updatedBlockContent.id } },
          },
        });

        // update the BlockOptions
        await updateOrCreateBlockOptions(existingBlock.id, blockOptions);
        // update the PageBlock
        await prisma.block.update({
          where: { id: existingBlock.id },
          data: {
            order: itemIndex === 0 ? 0 : itemIndex,
            [`${blockName}Block`]: { connect: { id: updatedBlock.id } },
          },
        });
      }
    }
  } else {
    // Create New Block

    const newBlock = await prisma.block.create({
      data: {
        order: itemIndex === 0 ? 0 : itemIndex,
        [`${pageType}`]: { connect: { id: page.id } },
      },
    });

    // create block options for new block
    if (blockOptions) {
      await updateOrCreateBlockOptions(newBlock.id, blockOptions);
    }

    //Create Block
    if (blockName && contentData) {
      const updates: Record<string, any> = {};

      // Populate the updates object based on the provided values
      for (const field in contentData) {
        if (contentData.hasOwnProperty(field)) {
          const value = contentData[field as keyof ContentData];

          if (!Array.isArray(value) && value && isNaN(value as any)) {
            // if field is NaN(not an id) it will be an Enum, populate with enum value

            updates[field as keyof ContentData] = value;
          } else if (value) {
            // If the value is truthy (not null or undefined)
            if (Array.isArray(value)) {
              // If it's an array, use 'connect' to connect multiple records
              updates[field as keyof ContentData] = {
                connect: value.map((item) => ({ id: parseInt(item as any) })),
              };
            } else {
              // If it's not an array, use 'connect' to connect a single record
              updates[field as keyof ContentData] = {
                connect: { id: parseInt(value as any) },
              };
            }
          }
        }
      }

      // create the BlockContent
      const createBlockContent = prisma[`${blockName}BlockContent`].create as (
        args: any
      ) => any;

      const createdBlockContent = await createBlockContent({
        data: updates,
      });

      // create the Block
      const createContentBlock = prisma[`${blockName}Block`].create as (
        args: any
      ) => any;

      const createdContentBlock = await createContentBlock({
        data: {
          name: blockName,
          content: {
            connect: { id: createdBlockContent.id },
          },
        },
      });

      await prisma.block.update({
        where: { id: newBlock.id },
        data: {
          order: itemIndex === 0 ? 0 : itemIndex,
          [`${blockName}Block`]: { connect: { id: createdContentBlock.id } },
        },
      });
    }
  }

  if (pageType === "article") {
    return page.id;
  } else return page as HomePage;
};

export const changeBlockOrder = async (
  pageType: PageType,
  pageId: number,
  index: number,
  direction: "up" | "down"
) => {
  let blockToMove;

  blockToMove = await prisma.block.findFirst({
    where: { [`${pageType}Id`]: pageId },
    orderBy: { order: "asc" },
    skip: index,
    take: 1,
  });

  if (!blockToMove) {
    throw new Error(`Block not found at index ${index}`);
  }

  let maxIndex =
    (await prisma.block.count({ where: { [`${pageType}Id`]: pageId } })) - 1;

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

  await prisma.$transaction([
    prisma.block.update({
      where: { id: blockToMove.id },
      data: { order: newOrder },
    }),
    prisma.block.updateMany({
      where: {
        [`${pageType}Id`]: pageId,
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

  return true;
};

export const removeBlock = async (blockId: string, blockName: BlockName) => {
  // we search for the content block to find the page block
  const findBlock = prisma[`${blockName}Block`].findUnique as (
    args: any
  ) => any;

  const foundBlockType = await findBlock({
    where: { id: blockId },
    include: {
      block: {
        include: {
          blockOptions: true,
        },
      },
      content: true,
    },
  });

  const blockContentId = foundBlockType?.content?.id; // block content id eg:bannerBlockContent
  const blockTypeId = foundBlockType?.id; // block type id eg:bannerBlock
  const blockOptionsIds = foundBlockType?.block.blockOptions?.map(
    (e: BlockOptions) => e.id
  );
  const pageBlockId = foundBlockType.block.id; // page block id

  // Delete the blockContent eg: BannerBlockContent
  if (blockContentId) {
    const deleteBlockContent = prisma[`${blockName}BlockContent`].delete as (
      args: any
    ) => any;

    await deleteBlockContent({
      where: { id: blockContentId },
    });
  }

  // Delete the blockType eg: BannerBlock
  if (blockTypeId) {
    const deleteBlockType = prisma[`${blockName}Block`].delete as (
      args: any
    ) => any;

    await deleteBlockType({
      where: { id: blockTypeId },
    });
  }

  // Delete the BlockOptions
  if (blockOptionsIds) {
    blockOptionsIds.forEach(async (e: string) => {
      await prisma.blockOptions.delete({
        where: { id: e },
      });
    });
  }

  // Delete the PageBlock
  if (pageBlockId) {
    await prisma.block.delete({
      where: { id: pageBlockId },
    });
  }

  // Ensure blocks are in correct numerical order
  const { homePageId, webPageId, articleId } = foundBlockType.block || {};

  if (homePageId) {
    await validateBlockOrder("homePage", homePageId);
  } else if (webPageId) {
    await validateBlockOrder("webPage", webPageId);
  } else if (articleId) {
    await validateBlockOrder("article", articleId);
  }

  return true;
};

const validateBlockOrder = async (pageType: PageType, pageId: number) => {
  // Retrieve all blocks for the given webpage, sorted by order
  const blocks = await prisma.block.findMany({
    where: {
      [`${pageType}Id`]: pageId,
    },
    orderBy: {
      order: "asc", // Sort blocks by the 'order' field in ascending order
    },
  });

  // Check if there are blocks with order >= 0 and if the orders follow without skipping
  let expectedOrder = 0;
  for (const block of blocks) {
    if (block.order < 0) {
      throw new Error("Block order must be greater than or equal to 0.");
    }
    if (block.order !== expectedOrder) {
      // Update the order of the block to the expected order

      await prisma.block.update({
        where: { id: block.id },
        data: { order: expectedOrder },
      });
    }

    expectedOrder++;
  }
};
