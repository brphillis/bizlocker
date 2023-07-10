export const getBlocks = (page: HomePage) => {
  const blocks = getPageBlocks(page);
  const activeBlocks = getActiveBlocks(blocks);
  return activeBlocks;
};

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
          content: [{ ...firstPopulated }],
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
