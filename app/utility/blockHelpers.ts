export const getPageData = (
  page: Page
): { blocks: Block[]; content: Array<Promotion[] | Campaign[]> } => {
  const blocks = getPageBlocks(page);
  const content = getBlockContent(blocks);

  return { blocks, content };
};

export const getPageBlocks = (page: Page, getFirst?: boolean): Block[] => {
  let firstPopulatedObjects: Block[] = [];

  // Sort PageItems in ascending order based on 'order' property
  page.pageItems.sort((a: PageItem, b: PageItem) =>
    a.order > b.order ? 1 : b.order > a.order ? -1 : 0
  );

  for (let i = 0; i < page.pageItems.length; i++) {
    let object = page.pageItems[i];

    // Find the first populated object within the current object
    let firstPopulatedObject = Object.values(object).find((value) => {
      return (
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length > 0
      );
    });

    if (firstPopulatedObject) {
      firstPopulatedObjects.push(firstPopulatedObject as Block);
    }
  }

  if (getFirst) {
    return [firstPopulatedObjects[0]];
  }

  return firstPopulatedObjects;
};

export const getBlockContent = (
  blocks: Block[]
): Array<Promotion[] | Campaign[]> => {
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

    // If the first populated value is found, check its type
    if (firstPopulated) {
      if (Array.isArray(firstPopulated)) {
        // If it's an array, add it as it is
        firstPopulatedItems.push(firstPopulated);
      } else {
        // If it's an object, convert it into an array and then add
        firstPopulatedItems.push([firstPopulated]);
      }
    }
  }

  return firstPopulatedItems;
};

export const getBlockContentType = (PageItem: { [key: string]: any }) => {
  let firstObject: AdvertBannerBlock | AdvertTileBlock | undefined = undefined;

  for (let key in PageItem) {
    if (
      PageItem.hasOwnProperty(key) &&
      typeof PageItem[key] === "object" &&
      PageItem[key] !== null &&
      !Array.isArray(PageItem[key])
    ) {
      firstObject = PageItem[key];
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

// export const getPageBanner = (
//   pageItems: PageItem[]
// ): Campaign[] | Promotion[] => {
//   return (
//     getBlockContent(pageItems?.find((e) => e.order === 0) as PageItem) ||
//     ({} as Campaign[] | Promotion[])
//   );
// };
