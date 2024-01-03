import type { Image, Product } from "@prisma/client";
import type { BlockWithContent, Page } from "~/models/pageBuilder.server";
import type { BlockName } from "~/utility/blockMaster/types";
import {
  fetchBlockProducts,
  type BlockContentWithDetails,
  fetchBlockArticles,
} from "~/models/blocks.server";
import { isArrayofStrings } from "./arrayHelpers";
import { getBlockContentTypes } from "../utility/blockMaster/blockMaster";

export const getBlocks = async (
  page: Page,
  fetchNestedContent?: boolean
): Promise<BlockWithContent[]> => {
  // Populate the page with the active block types
  let sortedBlocks = sortPageBlocks(page);

  // Populate content in blocks that requires a search query
  if (fetchNestedContent) {
    for (let i = 0; i < sortedBlocks.length; i++) {
      const block = sortedBlocks[i];
      if (block.name === "product" && block.content) {
        block.content.product = await fetchBlockProducts(block);
      }
      if (block.name === "article" && block.content) {
        block.content.article = await fetchBlockArticles(block);
      }
    }
  }

  return sortedBlocks;
};

// Returns the default content selection values for a block (example:selected Products)
export const getBlockDefaultValues = (
  block: BlockWithContent
): ContentSelection[] => {
  const blockContentTypes = getBlockContentTypes(block.name);
  const defaultValues: ContentSelection[] = [];

  // Were using the PRODUCT type as a generic type
  blockContentTypes.map((contentName: keyof BlockContentWithDetails) => {
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
      (block.content[contentName] as Product[] | Image[]).map(
        (j: Product | Image) =>
          defaultValues.push({
            type: contentName,
            contentId: j.id,
            name: (j as Product).name || (j as Image).altText || "",
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
      }

      defaultValues.push({
        type: contentName,
        contentId: content || "",
        name: "",
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
}: Page): BlockWithContent[] => {
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
