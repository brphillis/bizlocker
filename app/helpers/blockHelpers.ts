import { Image, Product } from "@prisma/client";
import { Page } from "~/models/PageBuilder/types";
import {
  BlockContentWithDetails,
  BlockWithContent,
} from "~/models/Blocks/types";
import { isArrayofStrings } from "./arrayHelpers";
import { getBlockContentTypes } from "../utility/blockMaster/blockMaster";

// Returns the default content selection values for a block (example:selected Products)
export const getBlockDefaultValues = (
  block: BlockWithContent,
): ContentSelection[] => {
  const blockContentTypes = getBlockContentTypes(block.name);
  const defaultValues: ContentSelection[] = [];

  // Were using the PRODUCT type as a generic type
  blockContentTypes.map((contentName: keyof BlockContentWithDetails) => {
    if (
      !block.content?.[contentName] ||
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
          }),
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
        }),
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

// sorts page blocks by the pages blockOrder array
export const sortBlocks = ({
  blocks,
  blockOrder,
}: Page): BlockWithContent[] => {
  const sortedBlocks = blocks?.sort(
    (a: BlockWithContent, b: BlockWithContent) => {
      // Find the index of each object's ID in the string array
      const indexA = blockOrder.indexOf(a?.id);
      const indexB = blockOrder.indexOf(b?.id);

      // Compare the indices to determine the sorting order
      if (indexA === -1) {
        return 1; // Move objects with IDs not in the string array to the end
      }
      if (indexB === -1) {
        return -1; // Move objects with IDs not in the string array to the end
      }

      return indexA - indexB; // Compare the indices for sorting
    },
  );

  return sortedBlocks!;
};
