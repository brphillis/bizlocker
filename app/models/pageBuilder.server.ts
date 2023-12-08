import type {
  Block,
  BlockOptions,
  Image,
  PreviewPage,
  Staff,
} from "@prisma/client";
import { prisma } from "~/db.server";
import { findUniqueStringsInArrays } from "~/helpers/arrayHelpers";
import { getContentBlockCredentialsFromPageBlock } from "~/helpers/blockHelpers";
import { createISODate } from "~/helpers/dateHelpers";
import {
  updateImage_Integration,
  uploadImage_Integration,
} from "~/integrations/_master/storage";
import { STAFF_SESSION_KEY, getUserDataFromSession } from "~/session.server";
import { includeAllBlockTypes, includeBlocksData } from "~/utility/blockMaster";
import {
  includeAllPageTypes,
  pageBlockHasPageConnection,
} from "~/utility/pageBuilder";
import type { BlockContent, BlockWithBlockOptions } from "./blocks.server";

export interface Page extends PreviewPage {
  previewPage?: PreviewPage | null;
  blocks: BlockWithBlockOptions[];
  thumbnail?: Image | null;
}

export interface PageBlock {
  id: string;
  pageBlockId: string;
  name: BlockName;
  page: Page;
  content: BlockContent;
  blockOptions: BlockOptions[];
}

export const getPageType = async (
  pageType: PageType,
  returnPreviews?: boolean,
  id?: string
): Promise<Page> => {
  if (returnPreviews) {
    // we find the page with the blockContent
    const findPageWithBlockContent = prisma[pageType].findFirst as (
      args: any
    ) => any;

    const pageWithBlockContent = await findPageWithBlockContent({
      where: {
        id: id ? parseInt(id) : id,
      },
      include: {
        blocks: includeBlocksData,
        previewPage: {
          select: {
            id: true,
            publisher: true,
            publishedAt: true,
          },
        },
      },
    });

    if (!pageWithBlockContent) {
      throw new Error(`No Page Found`);
    }

    return pageWithBlockContent;
  } else {
    // we find the page with the blockContent
    const findPageWithoutBlockContent = prisma[pageType].findFirst as (
      args: any
    ) => any;

    const pageWithOutBlockContent = await findPageWithoutBlockContent({
      where: {
        id: id ? parseInt(id) : id,
      },
      include: {
        blocks: includeBlocksData,
      },
    });

    if (!pageWithOutBlockContent) {
      throw new Error(`No Page Found`);
    }

    return pageWithOutBlockContent;
  }
};

export const upsertPageMeta = async (
  pageType: PageType,
  title: string,
  description: string,
  backgroundColor: string,
  isActive: string,
  thumbnail: Image,
  previewPageId?: string,
  articleCategories?: string[]
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

    let data: any = {
      title,
      description,
      backgroundColor,
      [pageType.replace(/p/g, "P")]: { connect: { id: newPageType.id } },
    };

    // Check if thumbnail is provided
    if (thumbnail) {
      const repoLinkThumbnail = await uploadImage_Integration(thumbnail);
      data.thumbnail = {
        create: {
          href: repoLinkThumbnail,
          altText: thumbnail.altText,
        },
      };
    }

    // If Article we connect article categories
    if (refinedPageType === "article" && articleCategories) {
      data.articleCategories = {
        connect: articleCategories.map((categoryId: string) => ({
          id: parseInt(categoryId),
        })),
      };
    }

    // Create the new previewPage with the data
    await prisma.previewPage.create({ data });

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
    let updateData: any = {
      title,
      description,
      backgroundColor,
    };

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
          thumbnail
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
  blockOptions: BlockOptions
): Promise<BlockOptions> => {
  // we set unndefined keys to null so the enum values can be removed/disconnected
  const sanitizedBlockOptions: BlockOptions = { ...blockOptions };

  for (const key in sanitizedBlockOptions) {
    if (
      sanitizedBlockOptions.hasOwnProperty(key) &&
      sanitizedBlockOptions[key as keyof BlockOptions] === undefined
    ) {
      // @ts-ignore
      sanitizedBlockOptions[key as keyof BlockOptions] = null;
    }
  }

  let existingBlockOptions;

  existingBlockOptions = await prisma.blockOptions.findFirst({
    where: { block: { id: blockId } },
  });

  if (existingBlockOptions) {
    return await prisma.blockOptions.update({
      where: { id: existingBlockOptions.id },
      data: sanitizedBlockOptions,
    });
  } else {
    return await prisma.blockOptions.create({
      // @ts-ignore
      data: { block: { connect: { id: blockId } }, ...sanitizedBlockOptions },
    });
  }
};

export const updatePageBlock = async (
  pageType: PageType,
  pageId: string,
  blockData: NewBlockData,
  blockOptions?: BlockOptions
): Promise<number | Page> => {
  const { blockName, itemIndex, contentData } = blockData;

  const previewPage = await prisma.previewPage.findUnique({
    where: { id: parseInt(pageId) },
    include: {
      ...includeAllBlockTypes(),
      ...includeAllPageTypes(["previewPage"], true),
    },
  });

  if (!previewPage) {
    throw new Error(`Page not found for pageId: ${pageId}`);
  }

  if (!previewPage[pageType]) {
    throw new Error(`Page has no Blocks: ${pageId}`);
  }

  let publishedPage;

  if (previewPage[pageType]) {
    publishedPage = previewPage[pageType];
  }

  const blocks = previewPage.blocks;

  // check if we are editing an invalid block index
  const isValidItemIndex = itemIndex >= 0 && itemIndex <= blocks.length;
  if (!isValidItemIndex) {
    throw new Error(`Invalid itemIndex: ${itemIndex}`);
  }

  // select the block we are going to edit
  const existingBlock = blocks.find(
    (e: any) => e.id === previewPage.blockOrder[itemIndex]
  );

  //check if the published page contains the block already
  const publishedContainsBlock = publishedPage?.blocks.some(
    (e: any) => e.id === existingBlock?.id
  );

  // check if the preview page contains the block already
  const previewContainsBlock = previewPage?.blocks.some(
    (e: any) => e.id === existingBlock?.id
  );

  // if the preview page is creating a new version, we remove the old from the preview page
  if (
    previewContainsBlock &&
    existingBlock &&
    existingBlock[`${blockName}BlockId`] &&
    !publishedContainsBlock
  ) {
    await removeBlock(
      existingBlock[`${blockName}BlockId`]!,
      blockName,
      previewPage.id.toString()
    );
  } else if (
    existingBlock &&
    existingBlock[`${blockName}BlockId`] &&
    previewContainsBlock &&
    publishedContainsBlock
  ) {
    await disconnectBlock(
      existingBlock[`${blockName}BlockId`]!,
      blockName,
      previewPage.id.toString()
    );
  }

  // Create New Block

  const newBlock = await prisma.block.create({
    data: {
      previewPage: { connect: { id: previewPage.id } },
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
        const value = contentData[field as keyof BlockContent];

        if (
          (Array.isArray(value) &&
            value.length > 0 &&
            value.every(
              (item) => typeof item === "string" && isNaN(parseInt(item))
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
              connect: value.map((item) => ({ id: parseInt(item as any) })),
            };
          } else if (value && !isNaN(parseInt(value))) {
            // If it's not an array, use 'connect' to connect a single record
            updates[field as keyof BlockContent] = {
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
        [`${blockName}Block`]: { connect: { id: createdContentBlock.id } },
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
  } else return previewPage as any;
};

export const changeBlockOrder = async (
  previewPageId: string,
  pageBlocks: string,
  index: number,
  direction: "up" | "down"
) => {
  let pageBlockIds: string[] = [];
  if (pageBlocks) {
    pageBlockIds = JSON.parse(pageBlocks);
  }

  if (index < 0 || index >= pageBlockIds.length) {
    throw new Error("Invalid index");
  }

  // Check if the direction is "up" and index is not 0
  if (direction === "up" && index > 0) {
    // Swap the current index with the one above it
    const temp = pageBlockIds[index];
    pageBlockIds[index] = pageBlockIds[index - 1];
    pageBlockIds[index - 1] = temp;
  }

  // Check if the direction is "down" and index is not the last index
  if (direction === "down" && index < pageBlockIds.length - 1) {
    // Swap the current index with the one below it
    const temp = pageBlockIds[index];
    pageBlockIds[index] = pageBlockIds[index + 1];
    pageBlockIds[index + 1] = temp;
  }

  // Update the block order in the database
  await prisma.previewPage.update({
    where: { id: parseInt(previewPageId) },
    data: {
      blockOrder: pageBlockIds,
    },
  });

  return true;
};

export const publishPage = async (
  pageType: PageType,
  previewPageId: string,
  pageId: string,
  request: Request
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
    const findPage = prisma[`${pageType}`].findUnique as (args: any) => any;

    const currentPage = await findPage({
      where: { id: parseInt(pageId) },
      include: {
        blocks: true,
      },
    });

    if (currentPage.blocks) {
      const disconnectBlocks = prisma[`${pageType}`].update as (
        args: any
      ) => any;

      await disconnectBlocks({
        where: { id: parseInt(pageId) },
        data: {
          blocks: {
            disconnect: currentPage.blocks.map((block: any) => ({
              id: block.id,
            })),
          },
        },
      });
    }

    // Store the preview page blocks and meta in a variable
    const previewPageBlocks = previewPage.blocks;

    let updateData: any = {
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

      updateData.thumbnail = previewPage?.thumbnail?.id
        ? {
            connect: {
              id: previewPage.thumbnail.id,
            },
          }
        : undefined;
    }

    // Begin Update to the page
    const updatePage = prisma[`${pageType}`].update as (args: any) => any;

    // Connect the blocks to the page
    const updatedPage = await updatePage({
      where: { id: parseInt(pageId) },
      data: updateData,
      include: { blocks: true },
    });

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
      data: { publishedAt: createISODate(), publisher: userEmail },
    });

    // Cleanup blocks that arent connected to anything

    // create arrays of IDs in Before and After update
    const previewPageBlockIds = previewPage.blocks.map(
      (block: any) => block.id
    );
    const currentPageBlockIds = currentPage.blocks.map(
      (block: Block) => block.id
    );
    const updatedPageBlockIds = updatedPage.blocks.map(
      (block: Block) => block.id
    );

    // construct array of block IDs that could have no connections
    const blocksToValidate: string[] = findUniqueStringsInArrays(
      previewPageBlockIds,
      currentPageBlockIds,
      updatedPageBlockIds
    );

    if (blocksToValidate) {
      blocksToValidate.map(async (id: string) => {
        const blockToCheck = await prisma.block.findUnique({
          where: { id },
          include: includeAllPageTypes(undefined, true),
        });

        if (blockToCheck && !pageBlockHasPageConnection(blockToCheck)) {
          const blockCredentials =
            getContentBlockCredentialsFromPageBlock(blockToCheck);

          if (blockCredentials) {
            const { blockId, blockName } = blockCredentials;
            removeBlock(blockId, blockName as BlockName);
          }
        }
      });
    }

    return { success: true };
  } catch (error) {
    throw new Error("Error publishing page");
  }
};

export const revertPreviewChanges = async (
  pageType: PageType,
  previewPageId: string,
  pageId: string
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

    // find the published page
    const findPage = prisma[`${pageType}`].findUnique as (args: any) => any;

    const currentPage = await findPage({
      where: { id: parseInt(pageId) },
      include: { blocks: true },
    });

    // Store the published  page blocks in a variable
    const publishedPageBlocks = currentPage.blocks;
    const updateData = {
      blocks: {
        connect: publishedPageBlocks.map((block: any) => ({
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

export const disconnectBlock = async (
  contentBlockId: string,
  blockName: BlockName,
  previewPageId: string
): Promise<{ success: boolean }> => {
  try {
    const pageBlock = await prisma.block.findFirst({
      where: { [`${blockName}BlockId`]: contentBlockId },
    });

    if (pageBlock) {
      const disconnectedBlock = await prisma.block.update({
        where: { id: pageBlock.id },
        data: {
          previewPage: {
            disconnect: { id: parseInt(previewPageId) },
          },
        },
        include: includeAllPageTypes(undefined, true),
      });

      const previewPage = await prisma.previewPage.findUnique({
        where: { id: parseInt(previewPageId) },
      });

      const newBlockOrder = previewPage?.blockOrder.filter(
        (e) => e !== pageBlock.id
      );

      await prisma.previewPage.update({
        where: { id: parseInt(previewPageId) },
        data: {
          blockOrder: newBlockOrder,
        },
      });

      // Delete block if it has no remaining page connections
      if (!pageBlockHasPageConnection(disconnectedBlock)) {
        const blockCredentials =
          getContentBlockCredentialsFromPageBlock(disconnectedBlock);
        if (blockCredentials) {
          const { blockId, blockName } = blockCredentials;
          removeBlock(blockId, blockName as BlockName);
        }
      }
    } else {
      throw new Error("PageBlock Not Found");
    }

    return { success: true };
  } catch (error) {
    throw new Error("Error Removing Block");
  }
};

export const removeBlock = async (
  contentBlockId: string,
  blockName: BlockName,
  previewPageId?: string
): Promise<{ success: true }> => {
  // We search for the content block to find the page block
  const findBlock = prisma[`${blockName}Block`].findUnique as (
    args: any
  ) => any;

  const foundBlockType = await findBlock({
    where: { id: contentBlockId },
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

  //if we are deleting from the page we correct the order
  if (previewPageId) {
    const previewPage = await prisma.previewPage.findUnique({
      where: { id: parseInt(previewPageId) },
    });

    const newBlockOrder = previewPage?.blockOrder.filter(
      (e) => e !== pageBlockId
    );

    await prisma.previewPage.update({
      where: { id: parseInt(previewPageId) },
      data: {
        blockOrder: newBlockOrder,
      },
    });
  }

  return { success: true };
};
