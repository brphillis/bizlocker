import type { Article, Image, Product } from "@prisma/client";
import type { Page, PageBlock } from "~/models/pageBuilder.server";
import type { BlockContentType, BlockName } from "~/utility/blockMaster/types";
import {
  fetchBlockArticles,
  fetchBlockProducts,
  type BlockWithBlockOptions,
} from "~/models/blocks.server";
import { isArrayofStrings } from "./arrayHelpers";
import { getBlockContentTypes } from "../utility/blockMaster/blockMaster";

// Returns the object array nessesery for populating a page in the blockrenderer
// Main constructor function for preparing a block for the BlockRenderer
export const getBlocks = async (
  page: Page,
  fetchNestedContent?: boolean
): Promise<PageBlock[]> => {
  // Populate the page with the active block types
  const blocks = squashPageBlockAndContentBlock(page);
  const activeBlocks = squashBlockContent(blocks);

  // Populate content in blocks that requires a search query
  if (fetchNestedContent) {
    for (let i = 0; i < activeBlocks.length; i++) {
      const block = activeBlocks[i];
      if (block.name === "product" && block.content) {
        block.content.product = await fetchBlockProducts(block);
      }
      if (block.name === "article" && block.content) {
        block.content.article = await fetchBlockArticles(block);
      }
    }
  }
  return activeBlocks;
};

// Squash the Page Block into the Content Block
export const squashPageBlockAndContentBlock = (page: Page): PageBlock[] => {
  let firstPopulatedObjects: PageBlock[] = [];

  // Sorting the pageblocks by the order in the blockOrder array
  const sortedPageBlocks = sortPageBlocks(page);

  for (let i = 0; i < sortedPageBlocks.length; i++) {
    let object = sortedPageBlocks[i];
    let blockOptions = sortedPageBlocks[i]?.blockOptions;

    // Find the first populated object or array within the current object
    let firstPopulatedObject: any = null;
    let pageBlockId;

    for (const [key, value] of Object.entries(object)) {
      if (key == "id") {
        pageBlockId = value;
      }
      if (
        key !== "blockOptions" &&
        ((Array.isArray(value) && value.length > 0) ||
          (typeof value === "object" &&
            value !== null &&
            Object.keys(value).length > 0))
      ) {
        firstPopulatedObject = Array.isArray(value) ? value : { ...value };
        break;
      }
    }

    if (firstPopulatedObject) {
      firstPopulatedObjects.push({
        ...firstPopulatedObject,
        pageBlockId: pageBlockId,
        blockOptions: blockOptions,
      } as PageBlock);
    }
  }

  return firstPopulatedObjects;
};

// Squash the Block Content into the Block
export const squashBlockContent = (blocks: PageBlock[]): PageBlock[] => {
  let firstPopulatedItems: any[] = [];
  for (let item of blocks) {
    // Find the first populated object or array within the current object
    let firstPopulated: any = null;

    for (const [key, value] of Object.entries(item)) {
      if (
        key !== "blockOptions" &&
        ((Array.isArray(value) && value.length > 0) ||
          (typeof value === "object" &&
            value !== null &&
            Object.keys(value).length > 0))
      ) {
        firstPopulated = Array.isArray(value) ? value : { ...value };
        break;
      }
    }

    if (firstPopulated) {
      const { blockOptions, name, id, pageBlockId } = item;
      if (Array.isArray(firstPopulated)) {
        // If it's an array, merge it with the specific properties and add it as it is
        firstPopulatedItems.push({
          content: firstPopulated,
          blockOptions: blockOptions,
          name,
          id,
          pageBlockId,
        });
      } else {
        // If it's an object, merge it with the specific properties and add
        firstPopulatedItems.push({
          content: { ...firstPopulated },
          blockOptions: blockOptions,
          name,
          id,
          pageBlockId,
        });
      }
    }
  }

  return firstPopulatedItems;
};

// Returns the default content selection values for a block (example:selected Products)
export const getBlockDefaultValues = (block: PageBlock): ContentSelection[] => {
  const blockContentTypes = getBlockContentTypes(block.name);

  const defaultValues: ContentSelection[] = [];

  // Were using the PRODUCT type as a generic type
  blockContentTypes.map((contentName: BlockContentType) => {
    if (
      !block.content[contentName] ||
      (Array.isArray(block.content[contentName]) &&
        (block.content[contentName] as Product[])?.length === 0)
    ) {
      return null;
    }

    // If multiple content selection loop through array and push each defaultvalue
    if (
      Array.isArray(block.content[contentName]) &&
      !isArrayofStrings(block.content[contentName])
    ) {
      (block.content[contentName] as Product[]).map((j) =>
        defaultValues.push({
          type: contentName,
          contentId: j.id,
          name: j.name,
        })
      );
    } else if (
      Array.isArray(block.content[contentName]) &&
      isArrayofStrings(block.content[contentName])
    ) {
      // if the value is an enum array
      (block.content[contentName] as Product[]).map((j) =>
        defaultValues.push({
          type: contentName,
          contentId: j as unknown as string,
          name: j as unknown as string,
        })
      );
    } else {
      let content;
      if (block.name === "text") {
        content = block.content.richText;
      } else {
        content = (block.content[contentName] as Product).id;
      }

      const name =
        (block.content[contentName] as Product).name ||
        (block.content[contentName] as Article).title ||
        (block.content[contentName] as Image).altText;

      defaultValues.push({
        type: contentName,
        contentId: content || "",
        name: name || "",
      });
    }
    return true;
  });

  return defaultValues.filter((notNull) => notNull) as ContentSelection[];
};

// Returns the id and name of the content block belonging to a pageblock
export const getContentBlockCredentialsFromPageBlock = (
  obj: Record<string, any>
): { blockId: any; blockName: BlockName } | null => {
  for (const key in obj) {
    if (
      key.endsWith("BlockId") &&
      obj[key] !== null &&
      obj[key] !== undefined
    ) {
      const slicedName = key.slice(0, -7);
      return {
        blockId: obj[key],
        blockName: slicedName as BlockName,
      };
    }
  }
  return null;
};

// sorts page blocks by the pages blockOrder array
export const sortPageBlocks = ({
  blocks,
  blockOrder,
}: Page): BlockWithBlockOptions[] => {
  const sortedBlocks = blocks.sort((a, b) => {
    // Find the index of each object's ID in the string array
    const indexA = blockOrder.indexOf(a?.id.toString());
    const indexB = blockOrder.indexOf(b?.id.toString());

    // Compare the indices to determine the sorting order
    if (indexA === -1) {
      return 1; // Move objects with IDs not in the string array to the end
    }
    if (indexB === -1) {
      return -1; // Move objects with IDs not in the string array to the end
    }

    return indexA - indexB; // Compare the indices for sorting
  });

  return sortedBlocks;
};
