import { prisma } from "../../db.server";
import { createNowISODate } from "../../helpers/dateHelpers";
import { blockMaster } from "../../utility/blockMaster/blockMaster";
import { findUniqueStringsInArrays } from "../../helpers/arrayHelpers";
import {
  getUserDataFromSession,
  STAFF_SESSION_KEY,
} from "../../session.server";
import {
  Block,
  BlockContent,
  BlockOptions,
  Image,
  Staff,
} from "@prisma/client";
import {
  updateImage_Integration,
  uploadImage_Integration,
} from "../../integrations/_master/storage/index.server";
import {
  blockHasPageConnection,
  includeAllPageTypes,
  type NewBlockData,
  type PageType,
} from "../../utility/pageBuilder";
import {
  Page,
  PreviewPageCreateQuery,
  PreviewPageUpdateQuery,
  PreviewPageUpsertQuery,
} from "./types";
import { BlockWithContent } from "../Blocks/types";

export const getPageByPageType = async (
  pageType: PageType,
  id?: string,
): Promise<Page> => {
  const findPageByPageType = prisma[pageType].findFirst as (
    args: unknown,
  ) => unknown;

  const pageWithBlockContent = (await findPageByPageType({
    where: {
      id: id ? parseInt(id) : id,
    },
    include: {
      previewPage: {
        select: {
          id: true,
          publisher: true,
          publishedAt: true,
        },
      },
    },
  })) as Page;

  return pageWithBlockContent;
};

export const upsertPageMeta = async (
  pageType: PageType,
  title: string,
  description: string,
  backgroundColor: string,
  isActive: string,
  thumbnail: Image,
  previewPageId?: string,
  articleCategories?: string[],
  urlSegment?: string,
): Promise<number> => {
  let page;
  const refinedPageType =
    (pageType.replace(/p/g, "P") as "article") ||
    (pageType.replace(/p/g, "P") as "webPage") ||
    (pageType.replace(/p/g, "P") as "homePage");

  if (!previewPageId) {
    //CREATE
    if (pageType === "homePage") {
      throw new Error("You can only have one Home Page.");
    }

    // create the new Page
    const newPageType = await prisma[refinedPageType].create({
      data: { title },
    });

    const createData: PreviewPageCreateQuery = {
      title,
      description,
      backgroundColor,
      urlSegment,
      [pageType.replace(/p/g, "P")]: { connect: { id: newPageType.id } },
    };

    // Check if thumbnail is provided
    if (thumbnail) {
      const repoLinkThumbnail = await uploadImage_Integration(thumbnail);
      createData.thumbnail = {
        create: {
          href: repoLinkThumbnail,
          altText: thumbnail.altText,
        },
      };
    }

    // If Article we connect article categories
    if (refinedPageType === "article" && articleCategories) {
      createData.articleCategories = {
        connect: articleCategories.map((categoryId: string) => ({
          id: parseInt(categoryId),
        })),
      };
    }

    // Create the new previewPage with the data
    await prisma.previewPage.create({ data: createData });

    return newPageType.id;
  } else {
    //UPDATE
    page = await prisma.previewPage.findUnique({
      where: {
        id: parseInt(previewPageId),
      },
    });

    if (!page) {
      throw new Error(`Page not found for pageId: ${previewPageId}`);
    }

    if (refinedPageType === "article" && articleCategories) {
      // Disconnect the existing categories from the article
      await prisma.previewPage.update({
        where: { id: parseInt(previewPageId) },
        data: {
          articleCategories: { set: [] },
        },
      });
    }

    // Define the update data with common properties
    const updateData: PreviewPageUpdateQuery = {
      title,
      description,
      backgroundColor,
    };

    if (pageType !== "homePage") {
      updateData.urlSegment = urlSegment;
    }

    // Check if thumbnail is provided
    if (thumbnail) {
      const existingThumbnail = await prisma.image.findFirst({
        where: {
          previewPageId: parseInt(previewPageId),
        },
      });

      if (existingThumbnail) {
        const repoLinkThumbnail = await updateImage_Integration(
          existingThumbnail as Image,
          thumbnail,
        );

        updateData.thumbnail = {
          update: {
            href: repoLinkThumbnail,
            altText: thumbnail.altText,
          },
        };
      } else {
        const repoLinkThumbnail = await uploadImage_Integration(thumbnail);

        updateData.thumbnail = {
          create: {
            href: repoLinkThumbnail,
            altText: thumbnail.altText,
          },
        };
      }
    }

    if (pageType !== "homePage") {
      updateData.isActive = isActive ? true : false;
    }

    if (refinedPageType === "article" && articleCategories) {
      updateData.articleCategories = {
        connect: articleCategories.map((category: string) => ({
          id: parseInt(category),
        })),
      };
    }

    // update the preview page
    await prisma.previewPage.update({
      where: {
        id: parseInt(previewPageId),
      },
      data: updateData,
    });

    return page.id;
  }
};

const updateOrCreateBlockOptions = async (
  blockId: string,
  blockOptions: BlockOptions,
): Promise<BlockOptions> => {
  // we set undefined keys to null so the enum values can be removed/disconnected
  const sanitizedBlockOptions: BlockOptions = { ...blockOptions };
  for (const key in sanitizedBlockOptions) {
    if (
      (key in sanitizedBlockOptions &&
        sanitizedBlockOptions[key as keyof BlockOptions] === undefined) ||
      null
    ) {
      delete sanitizedBlockOptions[key as keyof BlockOptions];
    }
  }

  const existingBlockOptions = await prisma.blockOptions.findFirst({
    where: { block: { id: parseInt(blockId) } },
  });

  if (existingBlockOptions) {
    return await prisma.blockOptions.update({
      where: { id: existingBlockOptions.id },
      data: sanitizedBlockOptions,
    });
  } else {
    const newBlockOptions = await prisma.blockOptions.create({
      data: {
        block: { connect: { id: parseInt(blockId) } },
      },
    });

    return await prisma.blockOptions.update({
      where: { id: newBlockOptions.id },
      data: sanitizedBlockOptions,
    });
  }
};

export const updateBlock = async (
  pageType: PageType,
  previewPageId: string,
  blockData: NewBlockData,
  blockOptions?: BlockOptions,
  blockLabel?: string,
): Promise<number | Page> => {
  const { blockName, blockContentOrder, itemIndex, contentData } = blockData;

  const previewPage = (await prisma.previewPage.findUnique({
    where: { id: parseInt(previewPageId) },
    include: {
      blocks: true,
      ...includeAllPageTypes(["previewPage"]),
    },
  })) as Page;

  if (!previewPage) {
    throw new Error(`Page not found for pageId: ${previewPageId}`);
  }

  if (!previewPage.blocks) {
    throw new Error(`Page has no Blocks: ${previewPageId}`);
  }

  const blocks = previewPage.blocks;

  // check if we are editing an invalid block index
  const isValidItemIndex = itemIndex >= 0 && itemIndex <= blocks.length;
  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  // select the block we are going to edit
  const existingBlock = blocks.find(
    (e: Block) => e.id === previewPage.blockOrder[itemIndex],
  );

  if (existingBlock?.id) {
    await disconnectBlock(
      existingBlock.id.toString(),
      previewPage.id.toString(),
    );
  }

  // Create New Block
  const newBlock = await prisma.block.create({
    data: {
      previewPage: { connect: { id: previewPage.id } },
      name: blockName,
      icon: blockMaster.find((e) => e.name === blockName)?.icon || "",
      label: blockLabel,
      contentOrder: blockContentOrder,
    },
  });

  // Create block options for new block
  if (blockOptions) {
    await updateOrCreateBlockOptions(newBlock.id.toString(), blockOptions);
  }

  // Create Block
  if (blockName && contentData) {
    const updates: Record<string, unknown> = {};

    // Populate the updates object based on the provided values
    for (const field in contentData) {
      if (field in contentData) {
        const value = contentData[field as keyof BlockContent];

        if (
          (Array.isArray(value) &&
            value.length > 0 &&
            value.every(
              (item) => typeof item === "string" && isNaN(parseInt(item)),
            )) ||
          (typeof value === "string" && isNaN(parseInt(value)))
        ) {
          // the value is an Enum or array of Enums

          updates[field as keyof BlockContent] = value;
        } else if (value) {
          // If the value is truthy (not null or undefined)
          if (Array.isArray(value) && value.length > 0) {
            // If it's an array, use 'connect' to connect multiple records
            updates[field as keyof BlockContent] = {
              connect: value.map((item) => ({ id: parseInt(item as string) })),
            };
          } else if (value && !isNaN(parseInt(value as string))) {
            // If it's not an array, use 'connect' to connect a single record
            updates[field as keyof BlockContent] = {
              connect: { id: parseInt(value as string) },
            };
          }
        }
      }
    }

    // create the BlockContent
    const createdBlockContent = await prisma.blockContent.create({
      data: updates,
    });

    // update the block with the content
    await prisma.block.update({
      where: {
        id: newBlock.id,
      },
      data: {
        content: {
          connect: { id: createdBlockContent.id },
        },
        name: blockName,
        icon: blockMaster.find((e) => e.name === blockName)?.icon || "",
        label: blockLabel,
        contentOrder: blockContentOrder,
      },
    });

    const newBlockOrder = [...previewPage.blockOrder];

    // if there is an item at order index overwrite it
    if (itemIndex >= 0 && itemIndex < newBlockOrder.length) {
      newBlockOrder[itemIndex] = newBlock.id;
    }
    // else we append to the end
    else if (itemIndex >= newBlockOrder.length) {
      newBlockOrder.push(newBlock.id);
    }

    await prisma.previewPage.update({
      where: { id: previewPage.id },
      data: {
        blockOrder: newBlockOrder,
      },
    });
  }

  if (pageType === "article") {
    return previewPage.id;
  } else return previewPage;
};

export const changeBlockOrder = async (
  previewPageId: string,
  blocks: string,
  index: number,
  direction: "up" | "down",
) => {
  let blockIds: string[] = [];
  if (blocks) {
    blockIds = JSON.parse(blocks);
  }

  if (index < 0 || index >= blockIds.length) {
    throw new Error("Invalid index");
  }

  // Check if the direction is "up" and index is not 0
  if (direction === "up" && index > 0) {
    // Swap the current index with the one above it
    const temp = blockIds[index];
    blockIds[index] = blockIds[index - 1];
    blockIds[index - 1] = temp;
  }

  // Check if the direction is "down" and index is not the last index
  if (direction === "down" && index < blockIds.length - 1) {
    // Swap the current index with the one below it
    const temp = blockIds[index];
    blockIds[index] = blockIds[index + 1];
    blockIds[index + 1] = temp;
  }

  // Update the block order in the database
  await prisma.previewPage.update({
    where: { id: parseInt(previewPageId) },
    data: {
      blockOrder: blockIds.map((e) => parseInt(e)),
    },
  });

  return true;
};

export const publishPage = async (
  pageType: PageType,
  previewPageId: string,
  pageId: string,
  request: Request,
): Promise<{ success: true }> => {
  try {
    // Find the previewPage
    const previewPage = await prisma.previewPage.findUnique({
      where: { id: parseInt(previewPageId) },
      include: { blocks: true, thumbnail: true },
    });

    if (!previewPage) {
      throw new Error("Preview page not found.");
    }

    // Disconnect any removed blocks from published
    const findPage = prisma[`${pageType}`].findUnique as (
      args: unknown,
    ) => unknown;

    const currentPage = (await findPage({
      where: { id: parseInt(pageId) },
      include: {
        blocks: true,
      },
    })) as Page;

    if (currentPage.blocks) {
      const disconnectBlocks = prisma[`${pageType}`].update as (
        args: unknown,
      ) => unknown;

      await disconnectBlocks({
        where: { id: parseInt(pageId) },
        data: {
          blocks: {
            disconnect: currentPage?.blocks?.map((block: BlockWithContent) => ({
              id: block.id,
            })),
          },
        },
      });
    }

    // Store the preview page blocks and meta in a variable
    const previewPageBlocks = previewPage?.blocks;

    const updateData: PreviewPageUpsertQuery = {
      blocks: {
        connect: previewPageBlocks.map((block) => ({
          id: block.id,
        })),
      },
      blockOrder: previewPage.blockOrder,
      title: previewPage?.title,
      description: previewPage?.description,
      backgroundColor: previewPage?.backgroundColor,
    };

    if (pageType !== "homePage") {
      updateData.isActive = previewPage?.isActive;

      updateData.urlSegment = previewPage?.urlSegment;

      updateData.thumbnail = previewPage?.thumbnail?.id
        ? {
            connect: {
              id: previewPage.thumbnail.id,
            },
          }
        : undefined;
    }

    // Begin Update to the page
    const updatePage = prisma[`${pageType}`].update as (
      args: unknown,
    ) => unknown;

    // Connect the blocks to the page
    const updatedPage = (await updatePage({
      where: { id: parseInt(pageId) },
      data: updateData,
      include: { blocks: true },
    })) as Page;

    // Update the published date on the previewpage

    let userEmail;

    if (request) {
      const { email } =
        ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) ||
        {};
      userEmail = email;
    }

    await prisma.previewPage.update({
      where: { id: previewPage.id },
      data: { publishedAt: createNowISODate(), publisher: userEmail },
    });

    // Cleanup blocks that arent connected to anything

    // create arrays of IDs in Before and After update
    const previewPageBlockIds = previewPage.blocks.map((block: unknown) =>
      (block as Block).id.toString(),
    );
    const currentPageBlockIds = currentPage?.blocks?.map((block: unknown) =>
      (block as Block).id.toString(),
    );
    const updatedPageBlockIds = updatedPage?.blocks?.map((block: unknown) =>
      (block as Block).id.toString(),
    );

    // construct array of block IDs that could have no connections
    const blocksToValidate: string[] = findUniqueStringsInArrays(
      previewPageBlockIds,
      currentPageBlockIds,
      updatedPageBlockIds,
    );

    if (blocksToValidate) {
      await Promise.all(
        blocksToValidate.map(async (id: string) => {
          const blockToCheck = await prisma.block.findUnique({
            where: { id: parseInt(id) },
            include: {
              content: true,
              blockOptions: true,
              ...includeAllPageTypes(undefined),
            },
          });

          if (blockToCheck && !blockHasPageConnection(blockToCheck)) {
            if (blockToCheck?.content?.id) {
              await prisma.blockContent.delete({
                where: {
                  id: blockToCheck.content.id,
                },
              });
            }

            const options = await prisma.blockOptions.findFirst({
              where: { blockId: blockToCheck.id },
            });

            if (options) {
              await prisma.blockOptions.delete({
                where: {
                  id: options.id,
                },
              });
            }

            await prisma.block.delete({
              where: {
                id: blockToCheck.id,
              },
            });
          }
        }),
      );
    }

    return { success: true };
  } catch (error) {
    throw new Error("Error publishing page");
  }
};

export const revertPreviewChanges = async (
  pageType: PageType,
  previewPageId: string,
  pageId: string,
): Promise<{ success: boolean }> => {
  try {
    // Find the previewPage
    const previewPage = await prisma.previewPage.findUnique({
      where: { id: parseInt(previewPageId) },
      include: { blocks: true },
    });

    if (!previewPage) {
      throw new Error("Preview page not found.");
    }

    // Disconnect blocks from the previewPage
    await prisma.previewPage.update({
      where: { id: parseInt(previewPageId) },
      data: {
        blocks: {
          disconnect: previewPage.blocks.map((block) => ({
            id: block.id,
          })),
        },
      },
    });

    // Find the published page
    const findPage = prisma[`${pageType}`].findUnique as (
      args: unknown,
    ) => unknown;

    const currentPage = (await findPage({
      where: { id: parseInt(pageId) },
      include: { blocks: true },
    })) as Page;

    // Store the published  page blocks in a variable
    const publishedPageBlocks = currentPage.blocks;
    const updateData = {
      blocks: {
        //@ts-expect-error: blocks exist on generic page
        connect: publishedPageBlocks.map((block: Block) => ({
          id: block.id,
        })),
      },
    };

    // Begin update to the preview page
    await prisma.previewPage.update({
      where: { id: previewPage.id },
      data: updateData,
    });

    return { success: true };
  } catch (error) {
    throw new Error("Error Reverting Page Changes");
  }
};

// Deletes Block from DB
const deleteBlock = async (block: BlockWithContent) => {
  // Delete the BlockOptions
  const options = await prisma.blockOptions.findFirst({
    where: {
      blockId: block.id,
    },
  });

  if (options) {
    await prisma.blockOptions.delete({
      where: {
        id: options.id,
      },
    });
  }

  // Delete the BlockContent
  if (block.content) {
    await prisma.blockContent.delete({
      where: {
        id: block.content.id,
      },
    });
  }

  // Delete the Block
  if (block) {
    await prisma.block.delete({
      where: {
        id: block.id,
      },
    });
  }
};

// Disconnects block from Page and removes if no connections exist
export const disconnectBlock = async (
  blockId: string,
  previewPageId: string,
): Promise<{ success: boolean }> => {
  try {
    const block = await prisma.block.findFirst({
      where: { id: parseInt(blockId) },
    });

    if (block) {
      const disconnectedBlock = (await prisma.block.update({
        where: { id: block.id },
        data: {
          previewPage: {
            disconnect: { id: parseInt(previewPageId) },
          },
        },
        include: {
          content: true,
          blockOptions: true,
          ...includeAllPageTypes(undefined),
        },
      })) as unknown as BlockWithContent;

      const previewPage = await prisma.previewPage.findUnique({
        where: { id: parseInt(previewPageId) },
      });

      const newBlockOrder = previewPage?.blockOrder.filter(
        (e) => e !== block.id,
      );

      await prisma.previewPage.update({
        where: { id: parseInt(previewPageId) },
        data: {
          blockOrder: newBlockOrder,
        },
      });

      // Delete block if it has no remaining page connections
      if (!blockHasPageConnection(disconnectedBlock)) {
        await deleteBlock(disconnectedBlock);
      }
    } else {
      throw new Error("Block Not Found");
    }

    return { success: true };
  } catch (error) {
    throw new Error("Error Removing Block");
  }
};
