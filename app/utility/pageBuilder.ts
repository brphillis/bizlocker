import { searchCampaigns } from "~/models/campaigns.server";
import { searchImages } from "~/models/images.server";
import { searchProducts } from "~/models/products.server";
import { searchPromotions } from "~/models/promotions.server";
import { blockMaster, blockTypes, getBlockContentTypes } from "./blockMaster";
import { searchBrands } from "~/models/brands.server";

export const pageTypes = ["homePage", "webPage", "article", "previewPage"];

// Prisma include to include all pagetypes with all blocks
// eg = include: includeAllPageTypesWithBlocks()
export const includeAllPageTypes = (
  excludedPages?: PageType[],
  withBlocks?: boolean
) => {
  // @ts-ignore
  const pageTypesObject: Record<
    PageType,
    { include: { blocks: { include: Record<string, boolean> } } }
  > = {};

  pageTypes.forEach((type) => {
    pageTypesObject[type as PageType] = {
      include: {
        blocks: {
          include: {},
        },
      },
    };

    blockTypes.forEach((blockType) => {
      if (withBlocks) {
        pageTypesObject[type as PageType].include.blocks.include[blockType] =
          true;
      } else {
        pageTypesObject[type as PageType].include.blocks.include[blockType] =
          false;
      }
    });
  });

  if (excludedPages) {
    excludedPages.forEach((excludedPage) => {
      delete pageTypesObject[excludedPage];
    });
  }

  return pageTypesObject;
};

// Checks if pageblock has connection to a page
export const pageBlockHasPageConnection = (blockToCheck: any): boolean => {
  return pageTypes.some(
    (type) => !blockToCheck?.[type] || blockToCheck[type].length > 0
  );
};

// a register for the blockoptions so the function knows which keys to look for in the formdata
export const getFormBlockOptions = (form: {
  [k: string]: FormDataEntryValue;
}): BlockOptions => {
  const {
    backgroundColor,
    backgroundColorTwo,
    backgroundBrightness,
    backgroundBrightnessTwo,
    backgroundWidth,
    backgroundWidthTwo,
    backgroundPatternName,
    backgroundPatternColor,
    backgroundPatternOpacity,
    backgroundPatternSize,
    backgroundPatternNameTwo,
    backgroundPatternColorTwo,
    backgroundPatternOpacityTwo,
    backgroundPatternSizeTwo,
    borderColor,
    borderDisplay,
    borderRadius,
    borderSize,
    colorFive,
    colorFour,
    colorOne,
    colorSix,
    colorThree,
    colorTwo,
    columns,
    columnsMobile,
    count,
    filterFive,
    filterFour,
    filterOne,
    filterSix,
    filterThree,
    filterTwo,
    flipX,
    linkFive,
    linkFour,
    linkOne,
    linkSix,
    linkThree,
    linkTwo,
    margin,
    padding,
    rows,
    shortText,
    shortTextColor,
    size,
    sizeMobile,
    sortBy,
    sortOrder,
    style,
    title,
    titleColor,
  } = form;

  const blockOptions = {
    backgroundBrightness: backgroundBrightness
      ? parseInt(backgroundBrightness as string)
      : undefined,
    backgroundBrightnessTwo: backgroundBrightnessTwo
      ? parseInt(backgroundBrightnessTwo as string)
      : undefined,
    backgroundColor: backgroundColor ? (backgroundColor as string) : undefined,
    backgroundWidth: backgroundWidth ? (backgroundWidth as string) : undefined,
    backgroundPatternName: backgroundPatternName
      ? (backgroundPatternName as string)
      : undefined,
    backgroundPatternColor: backgroundPatternColor
      ? (backgroundPatternColor as string)
      : undefined,
    backgroundPatternOpacity: backgroundPatternOpacity
      ? parseInt(backgroundPatternOpacity as string)
      : undefined,
    backgroundPatternSize: backgroundPatternSize
      ? (backgroundPatternSize as string)
      : undefined,
    backgroundColorTwo: backgroundColorTwo
      ? (backgroundColorTwo as string)
      : undefined,
    backgroundWidthTwo: backgroundWidthTwo
      ? (backgroundWidthTwo as string)
      : undefined,
    backgroundPatternNameTwo: backgroundPatternNameTwo
      ? (backgroundPatternNameTwo as string)
      : undefined,
    backgroundPatternColorTwo: backgroundPatternColorTwo
      ? (backgroundPatternColorTwo as string)
      : undefined,
    backgroundPatternOpacityTwo: backgroundPatternOpacityTwo
      ? parseInt(backgroundPatternOpacityTwo as string)
      : undefined,
    backgroundPatternSizeTwo: backgroundPatternSizeTwo
      ? (backgroundPatternSize as string)
      : undefined,
    borderColor: borderColor ? (borderColor as string) : undefined,
    borderDisplay: borderDisplay ? (borderDisplay as string) : undefined,
    borderRadius: borderRadius ? (borderRadius as string) : undefined,
    borderSize: borderSize ? (borderSize as string) : undefined,
    colorOne: colorOne ? (colorOne as string) : undefined,
    colorTwo: colorTwo ? (colorTwo as string) : undefined,
    colorThree: colorThree ? (colorThree as string) : undefined,
    colorFour: colorFour ? (colorFour as string) : undefined,
    colorFive: colorFive ? (colorFive as string) : undefined,
    colorSix: colorSix ? (colorSix as string) : undefined,
    columns: columns ? parseInt(columns as string) : undefined,
    columnsMobile: columnsMobile
      ? parseInt(columnsMobile as string)
      : undefined,
    count: count ? parseInt(count as string) : undefined,
    filterOne: filterOne ? (filterOne as string) : undefined,
    filterTwo: filterTwo ? (filterTwo as string) : undefined,
    filterThree: filterThree ? (filterThree as string) : undefined,
    filterFour: filterFour ? (filterFour as string) : undefined,
    filterFive: filterFive ? (filterFive as string) : undefined,
    filterSix: filterSix ? (filterSix as string) : undefined,
    flipX: flipX ? (flipX as string) : undefined,
    margin: margin ? (margin as string) : undefined,
    padding: padding ? (padding as string) : undefined,
    linkOne: linkOne ? (linkOne as string) : undefined,
    linkTwo: linkTwo ? (linkTwo as string) : undefined,
    linkThree: linkThree ? (linkThree as string) : undefined,
    linkFour: linkFour ? (linkFour as string) : undefined,
    linkFive: linkFive ? (linkFive as string) : undefined,
    linkSix: linkSix ? (linkSix as string) : undefined,
    rows: rows ? parseInt(rows as string) : undefined,
    shortText: shortText ? (shortText as string) : undefined,
    shortTextColor: shortTextColor ? (shortTextColor as string) : undefined,
    size: size as "small" | "medium" | "large" | "native",
    sizeMobile: sizeMobile as "small" | "medium" | "large",
    sortBy: sortBy as SortBy,
    sortOrder: sortOrder as SortOrder,
    style: style ? (style as string) : undefined,
    title: title ? (title as string) : undefined,
    titleColor: titleColor ? (titleColor as string) : undefined,
  } as BlockOptions;

  return blockOptions;
};

// builds the object required for updating the block in the backend
export const getBlockUpdateValues = (form: {
  [k: string]: FormDataEntryValue;
}): NewBlockData => {
  const { previewPageId, blockName, itemIndex, contentType } = form;

  const parsedObjectData = buildNewBlockData(blockName as BlockName, form);

  const blockUpdateValues = {
    previewPageId: parseInt(previewPageId as string),
    blockName: blockName as BlockName,
    itemIndex: parseInt(itemIndex as string),
    contentType: contentType as BlockContentType,
    contentData: parsedObjectData,
  } as NewBlockData;

  return blockUpdateValues;
};

export const buildNewBlockData = (
  blockName: BlockName,
  form: {
    [k: string]: FormDataEntryValue;
  }
) => {
  let newData: any = {};

  // we go through the blockmaster object getting the relevant data
  blockMaster.map(({ name, hasMultipleContent }: BlockMaster) => {
    if (blockName === name) {
      // we get the types of content by key that the block requires
      const blockContentTypes = getBlockContentTypes(name);

      // in newData we set the keys recieved from getBlockContentTypes
      blockContentTypes?.map(
        (contentTypeName) =>
          (newData[contentTypeName] = hasMultipleContent ? [] : undefined)
      );

      let { contentSelection } = form;

      contentSelection = JSON.parse(contentSelection as string);

      // we then assign the data to each key
      (contentSelection as unknown as ContentSelection[]).forEach(
        ({ type, contentId }: ContentSelection) => {
          blockContentTypes?.map((contentName: any) => {
            if (type === contentName && hasMultipleContent) {
              newData[contentName] = [...newData[contentName], contentId];
            } else if (type === contentName && !hasMultipleContent) {
              newData[contentName] = contentId;
            }
            return null;
          });
        }
      );
    }
    return null;
  });

  return newData;
};

// returns content data that a user searches for in the pagebuilder
export const searchContentData = async (
  contentType: BlockContentType,
  name?: string
) => {
  const formData = new FormData();
  if (name) {
    formData.set("name", name as string);
  }
  formData.set("page", "1");
  formData.set("perPage", "10");

  let searchResults;

  switch (contentType) {
    case "promotion":
      const { promotions } = await searchPromotions(
        Object.fromEntries(formData)
      );
      searchResults = promotions;

      return { searchResults };
    case "campaign":
      const { campaigns } = await searchCampaigns(Object.fromEntries(formData));
      searchResults = campaigns;

      return { searchResults };

    case "image":
      const { images } = await searchImages(Object.fromEntries(formData));
      searchResults = images;

      return { searchResults };

    case "product":
      const { products } = await searchProducts(Object.fromEntries(formData));
      searchResults = products;

      return { searchResults };

    case "brand":
      const { brands } = await searchBrands(Object.fromEntries(formData));
      searchResults = brands;

      return { searchResults };

    default:
      return { searchResults };
  }
};
