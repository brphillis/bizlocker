import { prisma } from "~/db.server";

const updateOrCreateBlockOptions = async (
  blockId: string,
  blockOptions: NewBlockOptions
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
  pageType: "homePage" | "webPage" | "article",
  pageId: number,
  blockData: NewBlockData,
  blockOptions?: NewBlockOptions
): Promise<number | HomePage | Article> => {
  const { blockName, itemIndex, contentData } = blockData;
  console.log("XXXXXXXXX", contentData);
  let page;

  if (pageType === "homePage") {
    page = await prisma.homePage.findUnique({
      where: { id: pageId },
    });
  } else if (pageType === "webPage") {
    page = await prisma.webPage.findUnique({
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
    include: {
      bannerBlock: true,
      tileBlock: true,
      heroBlock: true,
      textBlock: true,
      productBlock: true,
      article: true,
    },
  });

  // check if we are editing an invalid block index
  const isValidItemIndex = itemIndex >= 0 && itemIndex <= blocks.length;
  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  /// select the block we are going to edit
  const existingBlock = blocks.find((e) => e.order === itemIndex);

  if (existingBlock) {
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
          console.log("FIELD", field);

          if (contentData.hasOwnProperty(field)) {
            const value = contentData[field as keyof ContentData];
            console.log("VALUEE", value);
            if (!Array.isArray(value) && value && isNaN(value as any)) {
              // if field is NaN(not an id) it will be an Enum, populate with enum value
              console.log("POW WOW WOW");
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
                  set: { id: parseInt(value as any) },
                };
              }
            } else {
              // If the value is falsy (null or undefined)
              if (Array.isArray(value)) {
                // If it's an array, use 'set' with an empty array to clear the relation
                updates[field as keyof ContentData] = { set: [] };
              } else {
                // If it's not an array, use 'disconnect' to disconnect a single record
                updates[field as keyof ContentData] = { set: [] };
              }
            }
          }
        }
        console.log("UPPPPP", updates);

        // update the BlockContent
        const updateBlockContent = prisma[`${blockName}BlockContent`]
          .update as (
          args: any // Replace 'any' with the appropriate argument type for your update method
        ) => any;

        const updatedBlockContent = await updateBlockContent({
          where: { id: blockContent.id },
          data: updates,
        });

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

        // HERE WE WILL NEED TO DISCONNECT ALL OTHER BLOCKS

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
    ///CREATE NEW BLOCK

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
          if (value && isNaN(value as any)) {
            // if field is NaN(not an id) it will be an Enum, populate with enum value
            updates[field as keyof ContentData] = value;
          } else if (value) {
            // If the value is truthy (not null or undefined), connect it
            updates[field as keyof ContentData] = Array.isArray(value)
              ? { connect: value.map((item) => ({ id: item.id })) }
              : { connect: { id: parseInt(value as any) } };
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

    // else {
    //   await deleteBlockIfInvalid(newBlock.id);
    //   throw new Error(`Invalid type: ${blockName}`);
    // }
  }

  if (pageType === "article") {
    return page.id;
  } else return page as HomePage;
};

export const changeBlockOrder = async (
  pageType: "homePage" | "webPage" | "article",
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
  } else if (pageType === "webPage") {
    blockToMove = await prisma.block.findFirst({
      where: { webPageId: pageId },
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
  } else if (pageType === "webPage") {
    maxIndex = (await prisma.block.count({ where: { webPageId: pageId } })) - 1;
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
  } else if (pageType === "webPage") {
    await prisma.$transaction([
      prisma.block.update({
        where: { id: blockToMove.id },
        data: { order: newOrder },
      }),
      prisma.block.updateMany({
        where: {
          webPageId: pageId,
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

export const removeBlock = async (
  pageId: number,
  itemIndex: number,
  pageType: "homePage" | "webPage" | "article"
) => {
  // let page;
  // let blocks;

  // let isHomePage;
  // let isWebPage;
  // let isArticlePage;

  // // Check if the pageId corresponds to a HomePage or an Article
  // if (pageType === "homePage") {
  //   isHomePage = await prisma.homePage.findUnique({
  //     where: { id: pageId },
  //   });
  // } else if (pageType === "webPage") {
  //   isWebPage = await prisma.webPage.findUnique({
  //     where: { id: pageId },
  //   });
  // } else if (pageType === "article") {
  //   isArticlePage = await prisma.article.findUnique({
  //     where: { id: pageId },
  //   });
  // }

  // const includeToRemoveOptions = {
  //   heroBlock: {
  //     include: {
  //       contentImage: true,
  //     },
  //   },
  //   bannerBlock: {
  //     include: {
  //       contentImage: true,
  //     },
  //   },
  //   tileBlock: {
  //     include: {
  //       contentImages: true,
  //     },
  //   },
  //   textBlock: true,
  //   productBlock: {
  //     include: {
  //       content: true,
  //     },
  //   },
  //   articleBlock: {
  //     include: {
  //       content: true,
  //     },
  //   },
  //   blockOptions: true,
  // };

  // if (isHomePage) {
  //   page = isHomePage;
  //   blocks = await prisma.block.findMany({
  //     where: { homePageId: page.id },
  //     orderBy: { order: "asc" },
  //     include: includeToRemoveOptions,
  //   });
  // } else if (isWebPage) {
  //   page = isWebPage;
  //   blocks = await prisma.block.findMany({
  //     where: { webPageId: page.id },
  //     orderBy: { order: "asc" },
  //     include: includeToRemoveOptions,
  //   });
  // } else if (isArticlePage) {
  //   page = isArticlePage;
  //   blocks = await prisma.block.findMany({
  //     where: { articleId: page.id },
  //     orderBy: { order: "asc" },
  //     include: includeToRemoveOptions,
  //   });
  // } else {
  //   throw new Error(`Page not found for pageId: ${pageId}`);
  // }

  // if (itemIndex === 0) {
  //   throw new Error("Cannot remove item at index 0");
  // }

  // const isValidItemIndex = itemIndex >= 0 && itemIndex < blocks.length;

  // if (!isValidItemIndex) {
  //   throw new Error(`Invalid itemIndex: ${itemIndex}`);
  // }

  // const blockToRemove = blocks[itemIndex];

  // if (blockToRemove.blockOptions) {
  //   // Delete the blockOptions associated with the block
  //   await prisma.blockOptions.delete({
  //     where: { id: blockToRemove.blockOptions.id },
  //   });
  // }

  // const transaction = [];

  // if (blockToRemove.heroBlock) {
  //   const deleteHeroBlockPromise = prisma.heroBlock.delete({
  //     where: { id: blockToRemove.heroBlock.id },
  //   });
  //   transaction.push(deleteHeroBlockPromise);

  //   if (blockToRemove.heroBlock.contentImageId) {
  //     const deleteContentImagePromise = prisma.contentImage.delete({
  //       where: { id: blockToRemove.heroBlock.contentImageId },
  //     });
  //     transaction.push(deleteContentImagePromise);
  //   }
  // }

  // if (blockToRemove.bannerBlock) {
  //   const deleteBannerBlockPromise = prisma.bannerBlock.delete({
  //     where: { id: blockToRemove.bannerBlock.id },
  //   });
  //   transaction.push(deleteBannerBlockPromise);

  //   if (blockToRemove.bannerBlock.contentImageId) {
  //     const deleteContentImagePromise = prisma.contentImage.delete({
  //       where: { id: blockToRemove.bannerBlock.contentImageId },
  //     });
  //     transaction.push(deleteContentImagePromise);
  //   }
  // }

  // if (blockToRemove.tileBlock) {
  //   const deleteTileBlockPromise = prisma.tileBlock.delete({
  //     where: { id: blockToRemove.tileBlock.id },
  //   });
  //   transaction.push(deleteTileBlockPromise);

  //   if (blockToRemove.tileBlock.contentImages) {
  //     const contentImageIdsToDelete = blockToRemove.tileBlock.contentImages.map(
  //       (e) => e.id
  //     );

  //     const deleteContentImagePromise = prisma.contentImage.deleteMany({
  //       where: {
  //         id: {
  //           in: contentImageIdsToDelete,
  //         },
  //       },
  //     });

  //     transaction.push(deleteContentImagePromise);
  //   }
  // }

  // if (blockToRemove.textBlock) {
  //   const deleteTextBlockPromise = prisma.textBlock.delete({
  //     where: { id: blockToRemove.textBlock.id },
  //   });
  //   transaction.push(deleteTextBlockPromise);
  // }

  // if (blockToRemove.productBlock) {
  //   const deleteProductBlockPromise = prisma.productBlock.delete({
  //     where: { id: blockToRemove.productBlock.id },
  //   });
  //   transaction.push(deleteProductBlockPromise);

  //   if (blockToRemove.productBlock.content) {
  //     const deleteProductBlockContentPromise =
  //       prisma.productBlockContent.delete({
  //         where: { id: blockToRemove.productBlock.content.id },
  //       });
  //     transaction.push(deleteProductBlockContentPromise);
  //   }
  // }

  // if (blockToRemove.articleBlock) {
  //   const deleteArticleBlockPromise = prisma.articleBlock.delete({
  //     where: { id: blockToRemove.articleBlock.id },
  //   });
  //   transaction.push(deleteArticleBlockPromise);

  //   if (blockToRemove.articleBlock.content) {
  //     const deleteArticleBlockContentPromise =
  //       prisma.articleBlockContent.delete({
  //         where: { id: blockToRemove.articleBlock.content.id },
  //       });
  //     transaction.push(deleteArticleBlockContentPromise);
  //   }
  // }

  // const deleteBlockPromise = prisma.block.delete({
  //   where: { id: blockToRemove.id },
  // });
  // transaction.push(deleteBlockPromise);

  // await prisma.$transaction(transaction);

  // // Only update 'order' property of blocks that come after the removed one
  // const itemsToUpdate = blocks.slice(itemIndex + 1);

  // const updatePromises = itemsToUpdate.map((item) =>
  //   prisma.block.update({
  //     where: { id: item.id },
  //     data: { order: item.order - 1 },
  //   })
  // );

  // await prisma.$transaction(updatePromises);

  return true;
};

// export const deleteBlockIfInvalid = async (blockId: string) => {
//   const block = await prisma.block.findUnique({
//     where: { id: blockId },
//     include: {
//       heroBlock: true,
//       bannerBlock: true,
//       tileBlock: true,
//       textBlock: true,
//       productBlock: true,
//       articleBlock: true,
//       blockOptions: true,
//     },
//   });

//   if (
//     block &&
//     !block.heroBlock &&
//     !block.bannerBlock &&
//     !block.tileBlock &&
//     !block.textBlock &&
//     !block.productBlock &&
//     !block.articleBlock
//   ) {
//     if (block.blockOptionsId) {
//       await prisma.blockOptions.delete({ where: { id: block.blockOptionsId } });
//     }
//     await prisma.block.delete({ where: { id: blockId } });
//   } else {
//     console.error("Block has associated blocks and cannot be deleted.");
//   }
// };
