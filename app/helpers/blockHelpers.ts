import { fetchBlockArticles, fetchBlockProducts } from "~/models/blocks.server";
import { getBlockContentTypes } from "../utility/blockMaster";

//returns the object array nessesery for populating a page in the blockrenderer
//gets the page blocks, filters out the inactive blocks, then fetches nessesery data
export const getBlocks = async (
  page: HomePage | Article | WebPage,
  fetchNestedContent?: boolean
) => {
  // populate the page with the active block types
  const blocks = getPageBlocks(page);
  const activeBlocks = getActiveBlocks(blocks);

  if (fetchNestedContent) {
    for (let i = 0; i < activeBlocks.length; i++) {
      const block = activeBlocks[i];
      if (block.name === "product") {
        block.content.product = (await fetchBlockProducts(block)) as any;
      }
      if (block.name === "article") {
        block.content.article = (await fetchBlockArticles(block)) as any;
      }
    }
  }
  return activeBlocks;
};

//returns an array of ACTIVE and INACTIVE content blocks for a page
export const getPageBlocks = (
  page: HomePage | Article,
  getFirst?: boolean
): Block[] => {
  let firstPopulatedObjects: Block[] = [];

  // Sort blocks in ascending order based on 'order' property
  page?.blocks?.sort((a: Block, b: Block) =>
    a.order > b.order ? 1 : b.order > a.order ? -1 : 0
  );

  for (let i = 0; i < page?.blocks?.length; i++) {
    let object = page?.blocks[i];
    let order = page?.blocks[i]?.order;
    let blockOptions = page?.blocks[i]?.blockOptions;

    // Find the first populated object or array within the current object
    let firstPopulatedObject: any = null;

    for (const [key, value] of Object.entries(object)) {
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
        order: order,
        blockOptions: blockOptions,
      } as Block);
    }
  }

  if (getFirst) {
    return [firstPopulatedObjects[0]];
  }

  return firstPopulatedObjects;
};

//filters out inactive content blocks
export const getActiveBlocks = (blocks: Block[]): Block[] => {
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
      const { blockOptions, order, name, type, id } = item;
      if (Array.isArray(firstPopulated)) {
        // If it's an array, merge it with the specific properties and add it as it is
        firstPopulatedItems.push({
          content: firstPopulated,
          blockOptions: blockOptions,
          name,
          type,
          id,
          order,
        });
      } else {
        // If it's an object, merge it with the specific properties and add
        firstPopulatedItems.push({
          content: { ...firstPopulated },
          blockOptions: blockOptions,
          name,
          type,
          id,
          order,
        });
      }
    }
  }

  return firstPopulatedItems;
};

//returns the default content selection values for a block (example:selected Products)
export const getBlockDefaultValues = (block: Block): ContentSelection[] => {
  const blockContentTypes = getBlockContentTypes(block.name);

  const defaultValues: ContentSelection[] = [];

  blockContentTypes.map((contentName: BlockContentType) => {
    if (
      !block.content[contentName] ||
      (Array.isArray(block.content[contentName]) &&
        (block.content[contentName] as Product[])?.length === 0)
    ) {
      return null;
    }

    // if multiple content selection loop through array and push each defaultvalue
    if (Array.isArray(block.content[contentName])) {
      (block.content[contentName] as Product[]).map((j) =>
        defaultValues.push({
          type: contentName,
          contentId: j.id,
          name: j.name,
        })
      );
    } else {
      const content = (block.content[contentName] as Product).id;

      const name =
        (block.content[contentName] as Product).name ||
        (block.content[contentName] as Article).title;

      defaultValues.push({
        type: contentName,
        contentId: content,
        name: name,
      });
    }
  });

  return defaultValues.filter((notNull) => notNull) as ContentSelection[];
};
