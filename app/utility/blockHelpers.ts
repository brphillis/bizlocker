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

    // Find the first populated object within the current object
    let firstPopulatedObject = Object.values(object).find((value) => {
      return (
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length > 0
      );
    });

    if (firstPopulatedObject) {
      firstPopulatedObjects.push({
        ...firstPopulatedObject,
        order: order,
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
    let firstPopulated = Object.values(item).find((value: any) => {
      return (
        (Array.isArray(value) && value.length > 0) || // Check if value is a non-empty array
        (typeof value === "object" &&
          value !== null &&
          Object.keys(value).length > 0) // Check if value is a non-empty object
      );
    });

    // If the first populated value is found, create a new object with specific properties and merge the rest of the properties
    if (firstPopulated) {
      const { name, type, id, order } = item;
      if (Array.isArray(firstPopulated)) {
        // If it's an array, merge it with the specific properties and add it as it is
        firstPopulatedItems.push({
          content: firstPopulated,
          name,
          type,
          id,
          order,
        });
      } else {
        // If it's an object, merge it with the specific properties and add
        firstPopulatedItems.push({
          content: [{ ...firstPopulated }],
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

export const getBlockContentType = (Block: { [key: string]: any }) => {
  let firstObject: BannerBlock | TileBlock | undefined = undefined;

  for (let key in Block) {
    if (
      Block.hasOwnProperty(key) &&
      typeof Block[key] === "object" &&
      Block[key] !== null &&
      !Array.isArray(Block[key])
    ) {
      firstObject = Block[key];
      break;
    }
  }

  return firstObject?.type;
};

export const getBlockName = (obj: Record<string, any>): string | null => {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === "object" && obj[key].name) {
      return obj[key].name;
    }
  }
  return null;
};
