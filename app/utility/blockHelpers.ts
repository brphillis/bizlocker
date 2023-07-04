export const getBlockContent = (PageItem: { [key: string]: any }) => {
  //returns the block that is being used in the pageitem
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

  if (firstObject && firstObject.type && firstObject[firstObject.type]) {
    return firstObject[firstObject.type];
  } else {
    console.log("Block not found or has unknown type");
  }
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

export const getPageBanner = (pageItems: PageItem[]): Campaign | Promotion => {
  return (
    getBlockContent(pageItems?.find((e) => e.order === 0) as PageItem) ||
    ({} as Campaign | Promotion)
  );
};
