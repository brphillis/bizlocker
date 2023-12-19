import type { BlockOptions } from "@prisma/client";
import type { BlockContentType, BlockName } from "./blockMaster/types";
import { searchCampaigns } from "~/models/campaigns.server";
import { searchImages } from "~/models/images.server";
import { searchProducts } from "~/models/products.server";
import { searchPromotions } from "~/models/promotions.server";
import {
  type BlockMaster,
  blockMaster,
  blockTypes,
  getBlockContentTypes,
} from "./blockMaster/blockMaster";
import { searchBrands } from "~/models/brands.server";
import { searchIcons } from "./icons";
import { searchStores } from "~/models/stores.server";

export type PageType = "homePage" | "webPage" | "article" | "previewPage";

export const pageTypes = ["homePage", "webPage", "article", "previewPage"];

export interface NewBlockData {
  previewPageId: number;
  blockName: BlockName;
  itemIndex: number;
  contentBlockId: string;
  contentType: BlockContentType;
  contentData: any;
}

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
    backgroundDisplay,
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
    columns,
    columnsMobile,
    count,
    flipX,
    itemLinks,
    itemColors,
    itemSecondaryColors,
    itemBackgroundColors,
    itemSecondaryBackgroundColors,
    itemFilters,
    imagePosition,
    imagePositionMobile,
    itemImagePositions,
    itemImagePositionsMobile,
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
    primaryColor,
    secondaryColor,
    titleAlign,
    titleColor,
    titleSize,
    titleSizeMobile,
    titleWeight,
    itemBorderDisplays,
    itemBorderSizes,
    itemBorderColors,
    itemBorderRadius,
    primaryButton,
    secondaryButton,
    primaryButtonLink,
    secondaryButtonLink,
    itemPrimaryButtons,
    itemSecondaryButtons,
    itemPrimaryButtonLinks,
    itemSecondaryButtonLinks,
    itemTitleSizes,
    itemTitleSizesMobile,
    itemTitles,
    itemTitleColors,
    itemShortTextSizes,
    itemShortTextSizesMobile,
    itemShortText,
    itemShortTextColors,
    align,
    justify,
    alignMobile,
    justifyMobile,
    itemAlign,
    itemJustify,
    itemAlignMobile,
    itemJustifyMobile,
    primaryButtonLabel,
    primaryButtonLabelColor,
    primaryButtonColor,
    primaryButtonBorderColor,
    secondaryButtonLabel,
    secondaryButtonLabelColor,
    secondaryButtonColor,
    secondaryButtonBorderColor,
    itemPrimaryButtonLabels,
    itemPrimaryButtonLabelColors,
    itemPrimaryButtonColors,
    itemPrimaryButtonBorderColors,
    itemSecondaryButtonLabels,
    itemSecondaryButtonLabelColors,
    itemSecondaryButtonColors,
    itemSecondaryButtonBorderColors,
  } = form;

  const blockOptions = {
    backgroundBrightness: backgroundBrightness
      ? parseFloat(backgroundBrightness as string)
      : undefined,
    backgroundBrightnessSecondary: backgroundBrightnessSecondary
      ? parseFloat(backgroundBrightnessSecondary as string)
      : undefined,
    backgroundColor: backgroundColor ? (backgroundColor as string) : undefined,
    backgroundDisplay: backgroundDisplay
      ? (backgroundDisplay as string)
      : undefined,
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
    columns: columns ? parseFloat(columns as string) : undefined,
    columnsMobile: columnsMobile
      ? parseFloat(columnsMobile as string)
      : undefined,
    count: count ? parseInt(count as string) : undefined,
    flipX: flipX ? (flipX as string) : undefined,
    itemLinks: itemLinks ? JSON.parse(itemLinks as string) : undefined,
    itemTitles: itemTitles ? JSON.parse(itemTitles as string) : undefined,
    itemTitleSizes: itemTitleSizes
      ? JSON.parse(itemTitleSizes as string)
      : undefined,
    itemTitleSizesMobile: itemTitleSizesMobile
      ? JSON.parse(itemTitleSizesMobile as string)
      : undefined,
    itemTitleColors: itemTitleColors
      ? JSON.parse(itemTitleColors as string)
      : undefined,
    itemShortText: itemShortText
      ? JSON.parse(itemShortText as string)
      : undefined,
    itemShortTextSizes: itemShortTextSizes
      ? JSON.parse(itemShortTextSizes as string)
      : undefined,
    itemShortTextSizesMobile: itemShortTextSizesMobile
      ? JSON.parse(itemShortTextSizesMobile as string)
      : undefined,
    itemShortTextColors: itemShortTextColors
      ? JSON.parse(itemShortTextColors as string)
      : undefined,
    itemAlign: itemAlign ? JSON.parse(itemAlign as string) : undefined,
    itemJustify: itemJustify ? JSON.parse(itemJustify as string) : undefined,
    itemAlignMobile: itemAlignMobile
      ? JSON.parse(itemAlignMobile as string)
      : undefined,
    itemJustifyMobile: itemJustifyMobile
      ? JSON.parse(itemJustifyMobile as string)
      : undefined,
    itemColors: itemColors ? JSON.parse(itemColors as string) : undefined,
    itemSecondaryColors: itemSecondaryColors
      ? JSON.parse(itemSecondaryColors as string)
      : undefined,
    itemFilters: itemFilters ? JSON.parse(itemFilters as string) : undefined,
    itemBackgroundColors: itemBackgroundColors
      ? JSON.parse(itemBackgroundColors as string)
      : undefined,
    itemSecondaryBackgroundColors: itemSecondaryBackgroundColors
      ? JSON.parse(itemSecondaryBackgroundColors as string)
      : undefined,
    itemImagePositions: itemImagePositions
      ? JSON.parse(itemImagePositions as string)
      : undefined,
    itemImagePositionsMobile: itemImagePositionsMobile
      ? JSON.parse(itemImagePositionsMobile as string)
      : undefined,
    imagePosition: imagePosition ? (imagePosition as string) : undefined,
    imagePositionMobile: imagePositionMobile
      ? (imagePositionMobile as string)
      : undefined,
    margin: margin ? (margin as string) : undefined,
    padding: padding ? (padding as string) : undefined,
    primaryButton: primaryButton ? (primaryButton as string) : undefined,
    primaryButtonLink: primaryButtonLink
      ? (primaryButtonLink as string)
      : undefined,
    primaryButtonLabel: primaryButtonLabel
      ? (primaryButtonLabel as string)
      : undefined,
    primaryButtonLabelColor: primaryButtonLabelColor
      ? (primaryButtonLabelColor as string)
      : undefined,
    primaryButtonColor: primaryButtonColor
      ? (primaryButtonColor as string)
      : undefined,
    primaryButtonBorderColor: primaryButtonBorderColor
      ? (primaryButtonBorderColor as string)
      : undefined,
    secondaryButton: secondaryButton ? (secondaryButton as string) : undefined,
    secondaryButtonLink: secondaryButtonLink
      ? (secondaryButtonLink as string)
      : undefined,
    secondaryButtonLabel: secondaryButtonLabel
      ? (secondaryButtonLabel as string)
      : undefined,
    secondaryButtonLabelColor: secondaryButtonLabelColor
      ? (secondaryButtonLabelColor as string)
      : undefined,
    secondaryButtonColor: secondaryButtonColor
      ? (secondaryButtonColor as string)
      : undefined,
    secondaryButtonBorderColor: secondaryButtonBorderColor
      ? (secondaryButtonBorderColor as string)
      : undefined,

    itemPrimaryButtons: itemPrimaryButtons
      ? JSON.parse(itemPrimaryButtons as string)
      : undefined,

    itemSecondaryButtons: itemSecondaryButtons
      ? JSON.parse(itemSecondaryButtons as string)
      : undefined,

    itemPrimaryButtonLinks: itemPrimaryButtonLinks
      ? JSON.parse(itemPrimaryButtonLinks as string)
      : undefined,

    itemSecondaryButtonLinks: itemSecondaryButtonLinks
      ? JSON.parse(itemSecondaryButtonLinks as string)
      : undefined,

    itemPrimaryButtonLabels: itemPrimaryButtonLabels
      ? JSON.parse(itemPrimaryButtonLabels as string)
      : undefined,
    itemPrimaryButtonBorderColors: itemPrimaryButtonBorderColors
      ? JSON.parse(itemPrimaryButtonBorderColors as string)
      : undefined,
    itemPrimaryButtonLabelColors: itemPrimaryButtonLabelColors
      ? JSON.parse(itemPrimaryButtonLabelColors as string)
      : undefined,
    itemPrimaryButtonColors: itemPrimaryButtonColors
      ? JSON.parse(itemPrimaryButtonColors as string)
      : undefined,

    itemSecondaryButtonColors: itemSecondaryButtonColors
      ? JSON.parse(itemSecondaryButtonColors as string)
      : undefined,
    itemSecondaryButtonBorderColors: itemSecondaryButtonBorderColors
      ? JSON.parse(itemSecondaryButtonBorderColors as string)
      : undefined,
    itemSecondaryButtonLabels: itemSecondaryButtonLabels
      ? JSON.parse(itemSecondaryButtonLabels as string)
      : undefined,
    itemSecondaryButtonLabelColors: itemSecondaryButtonLabelColors
      ? JSON.parse(itemSecondaryButtonLabelColors as string)
      : undefined,

    rows: rows ? parseInt(rows as string) : undefined,
    shortText: shortText ? (shortText as string) : undefined,
    shortTextColor: shortTextColor ? (shortTextColor as string) : undefined,
    size: size as "small" | "medium" | "large" | "native",
    sizeMobile: sizeMobile as "small" | "medium" | "large",
    sortBy: sortBy as SortBy,
    sortOrder: sortOrder as SortOrder,
    style: style ? (style as string) : undefined,
    title: title ? (title as string) : undefined,
    align: align ? (align as string) : undefined,
    justify: justify ? (justify as string) : undefined,
    alignMobile: alignMobile ? (alignMobile as string) : undefined,
    justifyMobile: justifyMobile ? (justifyMobile as string) : undefined,
    primaryColor: primaryColor ? (primaryColor as string) : undefined,
    secondaryColor: secondaryColor ? (secondaryColor as string) : undefined,
    titleAlign: titleAlign ? (titleAlign as string) : undefined,
    titleSize: titleSize ? (titleSize as string) : undefined,
    titleSizeMobile: titleSizeMobile ? (titleSizeMobile as string) : undefined,
    titleColor: titleColor ? (titleColor as string) : undefined,
    titleWeight: titleWeight ? (titleWeight as string) : undefined,
    // itemPrimaryButtons: itemPrimaryButtons
    //   ? JSON.parse(itemPrimaryButtons as string)
    //   : undefined,
    // itemPrimaryButtonLinks: itemPrimaryButtonLinks
    //   ? JSON.parse(itemPrimaryButtonLinks as string)
    //   : undefined,
    //   itemPrimaryButtonLabels: itemPrimaryButtonLabels
    //   ? JSON.parse(itemPrimaryButtonLabels as string)
    //   : undefined,
    //   itemPrimaryButtonTextColors: itemPrimaryButtonTextColors
    //   ? JSON.parse(itemPrimaryButtonTextColors as string)
    //   : undefined,
    //   itemPrimaryButtonColors: itemPrimaryButtonColors
    //   ? JSON.parse(itemPrimaryButtonColors as string)
    //   : undefined,
    //   itemPrimaryButtonBorderColors: itemPrimaryButtonBorderColors
    //   ? JSON.parse(itemPrimaryButtonBorderColors as string)
    //   : undefined,
    // itemSecondaryButtons: itemSecondaryButtons
    //   ? JSON.parse(itemSecondaryButtons as string)
    //   : undefined,
    // itemSecondaryButtonLinks: itemSecondaryButtonLinks
    //   ? JSON.parse(itemSecondaryButtonLinks as string)
    //   : undefined,

    itemBorderDisplays: itemBorderDisplays
      ? JSON.parse(itemBorderDisplays as string)
      : undefined,
    itemBorderSizes: itemBorderSizes
      ? JSON.parse(itemBorderSizes as string)
      : undefined,
    itemBorderColors: itemBorderColors
      ? JSON.parse(itemBorderColors as string)
      : undefined,
    itemBorderRadius: itemBorderRadius
      ? JSON.parse(itemBorderRadius as string)
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
  blockMaster.map(({ name, maxContentItems }: BlockMaster) => {
    const hasMultipleContent = maxContentItems && maxContentItems > 1;

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
