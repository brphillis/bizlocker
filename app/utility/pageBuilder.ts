import { searchCampaigns } from "~/models/campaigns.server";
import { searchImages } from "~/models/images.server";
import { searchProducts } from "~/models/products.server";
import { searchPromotions } from "~/models/promotions.server";
import { blockMaster, blockTypes, getBlockContentTypes } from "./blockMaster";
import { searchBrands } from "~/models/brands.server";
import { searchIcons } from "./icons";
import { searchStores } from "~/models/stores.server";

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
    backgroundBrightness,
    backgroundBrightnessSecondary,
    backgroundColor,
    backgroundColorSecondary,
    backgroundPatternColor,
    backgroundPatternColorSecondary,
    backgroundPatternName,
    backgroundPatternNameSecondary,
    backgroundPatternOpacity,
    backgroundPatternOpacitySecondary,
    backgroundPatternSize,
    backgroundPatternSizeSecondary,
    backgroundWidth,
    backgroundWidthSecondary,
    borderColor,
    borderDisplay,
    borderRadius,
    borderSize,
    color1,
    color2,
    color3,
    color4,
    color5,
    color6,
    colorSecondary1,
    colorSecondary2,
    colorSecondary3,
    colorSecondary4,
    colorSecondary5,
    colorSecondary6,
    columns,
    columnsMobile,
    count,
    filter1,
    filter2,
    filter3,
    filter4,
    filter5,
    filter6,
    flipX,
    link1,
    link2,
    link3,
    link4,
    link5,
    link6,
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
    title1,
    title2,
    title3,
    title4,
    title5,
    title6,
    titleColor,
    itemColor,
    itemSecondaryColor,
    titleAlign,
    titleSize,
    titleWeight,
    itemBorderDisplay,
    itemBorderSize,
    itemBorderColor,
    itemBorderRadius,
  } = form;

  const blockOptions = {
    backgroundBrightness: backgroundBrightness
      ? parseFloat(backgroundBrightness as string)
      : undefined,
    backgroundBrightnessSecondary: backgroundBrightnessSecondary
      ? parseFloat(backgroundBrightnessSecondary as string)
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
      ? parseFloat(backgroundPatternOpacity as string)
      : undefined,
    backgroundPatternSize: backgroundPatternSize
      ? parseInt(backgroundPatternSize as string)
      : undefined,
    backgroundColorSecondary: backgroundColorSecondary
      ? (backgroundColorSecondary as string)
      : undefined,
    backgroundWidthSecondary: backgroundWidthSecondary
      ? (backgroundWidthSecondary as string)
      : undefined,
    backgroundPatternNameSecondary: backgroundPatternNameSecondary
      ? (backgroundPatternNameSecondary as string)
      : undefined,
    backgroundPatternColorSecondary: backgroundPatternColorSecondary
      ? (backgroundPatternColorSecondary as string)
      : undefined,
    backgroundPatternOpacitySecondary: backgroundPatternOpacitySecondary
      ? parseFloat(backgroundPatternOpacitySecondary as string)
      : undefined,
    backgroundPatternSizeSecondary: backgroundPatternSizeSecondary
      ? parseInt(backgroundPatternSizeSecondary as string)
      : undefined,
    borderColor: borderColor ? (borderColor as string) : undefined,
    borderDisplay: borderDisplay ? (borderDisplay as string) : undefined,
    borderRadius: borderRadius ? (borderRadius as string) : undefined,
    borderSize: borderSize ? (borderSize as string) : undefined,
    color1: color1 ? (color1 as string) : undefined,
    color2: color2 ? (color2 as string) : undefined,
    color3: color3 ? (color3 as string) : undefined,
    color4: color4 ? (color4 as string) : undefined,
    color5: color5 ? (color5 as string) : undefined,
    color6: color6 ? (color6 as string) : undefined,
    colorSecondary1: colorSecondary1 ? (colorSecondary1 as string) : undefined,
    colorSecondary2: colorSecondary2 ? (colorSecondary2 as string) : undefined,
    colorSecondary3: colorSecondary3 ? (colorSecondary3 as string) : undefined,
    colorSecondary4: colorSecondary4 ? (colorSecondary4 as string) : undefined,
    colorSecondary5: colorSecondary5 ? (colorSecondary5 as string) : undefined,
    colorSecondary6: colorSecondary6 ? (colorSecondary6 as string) : undefined,
    columns: columns ? parseInt(columns as string) : undefined,
    columnsMobile: columnsMobile
      ? parseInt(columnsMobile as string)
      : undefined,
    count: count ? parseInt(count as string) : undefined,
    filter1: filter1 ? (filter1 as string) : undefined,
    filter2: filter2 ? (filter2 as string) : undefined,
    filter3: filter3 ? (filter3 as string) : undefined,
    filter4: filter4 ? (filter4 as string) : undefined,
    filter5: filter5 ? (filter5 as string) : undefined,
    filter6: filter6 ? (filter6 as string) : undefined,
    flipX: flipX ? (flipX as string) : undefined,
    margin: margin ? (margin as string) : undefined,
    padding: padding ? (padding as string) : undefined,
    link1: link1 ? (link1 as string) : undefined,
    link2: link2 ? (link2 as string) : undefined,
    link3: link3 ? (link3 as string) : undefined,
    link4: link4 ? (link4 as string) : undefined,
    link5: link5 ? (link5 as string) : undefined,
    link6: link6 ? (link6 as string) : undefined,
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
    title1: title1 ? (title1 as string) : undefined,
    title2: title2 ? (title2 as string) : undefined,
    title3: title3 ? (title3 as string) : undefined,
    title4: title4 ? (title4 as string) : undefined,
    title5: title5 ? (title5 as string) : undefined,
    title6: title6 ? (title6 as string) : undefined,
    itemColor: itemColor ? (itemColor as string) : undefined,
    itemSecondaryColor: itemSecondaryColor
      ? (itemSecondaryColor as string)
      : undefined,
    titleAlign: titleAlign ? (titleAlign as string) : undefined,
    titleSize: titleSize ? (titleSize as string) : undefined,
    titleWeight: titleWeight ? (titleWeight as string) : undefined,
    itemBorderDisplay: itemBorderDisplay
      ? (itemBorderDisplay as string)
      : undefined,
    itemBorderSize: itemBorderSize ? (itemBorderSize as string) : undefined,
    itemBorderColor: itemBorderColor ? (itemBorderColor as string) : undefined,
    itemBorderRadius: itemBorderRadius
      ? (itemBorderRadius as string)
      : undefined,
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

      return searchResults;

    case "campaign":
      const { campaigns } = await searchCampaigns(Object.fromEntries(formData));
      searchResults = campaigns;

      return searchResults;

    case "image":
      const { images } = await searchImages(Object.fromEntries(formData));
      searchResults = images;

      return searchResults;

    case "product":
      const { products } = await searchProducts(Object.fromEntries(formData));
      searchResults = products;

      return searchResults;

    case "brand":
      const { brands } = await searchBrands(Object.fromEntries(formData));
      searchResults = brands;

      return searchResults;

    case "store":
      const { stores } = await searchStores(Object.fromEntries(formData));
      searchResults = stores;

      return searchResults;

    case "icon":
      const icons = await searchIcons(Object.fromEntries(formData));
      searchResults = icons;

      return searchResults;

    default:
      return searchResults;
  }
};
