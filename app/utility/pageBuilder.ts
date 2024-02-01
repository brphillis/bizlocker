import { BlockOptions } from "@prisma/client";
import { BlockContentType, BlockName } from "./blockMaster/types";
import { searchCampaigns } from "~/models/Campaigns/index.server";
import { searchImages } from "~/models/Images/index.server";
import { searchProducts } from "~/models/Products/index.server";
import { searchPromotions } from "~/models/Promotions/index.server";
import {
  type BlockMaster,
  blockMaster,
  getBlockContentTypes,
} from "./blockMaster/blockMaster";
import { searchBrands } from "~/models/Brands/index.server";
import { searchIcons } from "./icons";
import { searchStores } from "~/models/Stores/index.server";
import { NewBlockContent } from "~/models/Blocks/types";
import { searchProductSubCategories } from "~/models/ProductSubCategories/index.server";
import { searchProductCategories } from "~/models/ProductCategories/index.server";

export type PageType = "homePage" | "webPage" | "article" | "previewPage";

export const pageTypes = ["homePage", "webPage", "article", "previewPage"];

export interface NewBlockData {
  previewPageId: number;
  blockName: BlockName;
  itemIndex: number;
  contentType: BlockContentType;
  contentData: NewBlockContent;
  blockContentOrder: string[];
}

// Prisma include to include all pagetypes with all blocks
// eg = include: includeAllPageTypesWithBlocks()
export const includeAllPageTypes = (excludedPages?: PageType[]) => {
  const pageTypesObject = {} as Record<
    PageType,
    { include: { blocks: { include: Record<string, boolean> } } }
  >;

  pageTypes.forEach((type) => {
    // Explicitly assert the type of 'type' as PageType
    pageTypesObject[type as PageType] = {
      include: {
        blocks: {
          include: { content: true },
        },
      },
    };
  });

  if (excludedPages) {
    excludedPages.forEach((excludedPage) => {
      // Explicitly assert the type of 'excludedPage' as PageType
      delete pageTypesObject[excludedPage as PageType];
    });
  }

  return pageTypesObject;
};

// Checks if block has connection to a page
// prettier-ignore
export const blockHasPageConnection = (blockToCheck: unknown): boolean => {
  return pageTypes.some(
     // @ts-expect-error: checking block for populated pagetypes
    (type) => !blockToCheck?.[type] || (blockToCheck[type] && blockToCheck[type].length > 0),
  );
};

// a register for the blockoptions so the function knows which keys to look for in the formdata
export const getFormBlockOptions = (form: {
  [k: string]: FormDataEntryValue;
}): BlockOptions => {
  const {
    backgroundBrightnessPrimary,
    backgroundColorPrimary,
    backgroundDisplayPrimary,
    backgroundPatternColorPrimary,
    backgroundPatternNamePrimary,
    backgroundPatternOpacityPrimary,
    backgroundPatternSizePrimary,
    backgroundWidthPrimary,
    backgroundColorSecondary,
    backgroundBrightnessSecondary,
    backgroundPatternColorSecondary,
    backgroundPatternNameSecondary,
    backgroundPatternOpacitySecondary,
    backgroundPatternSizeSecondary,
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
    itemColorsSecondary,
    itemBackgroundColorsPrimary,
    itemBackgroundColorsSecondary,
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
    height,
    heightMobile,
    width,
    widthMobile,
    style,
    title,
    colorPrimary,
    colorSecondary,
    titleAlign,
    titleColor,
    titleSize,
    titleSizeMobile,
    titleFontWeight,
    itemBorderDisplays,
    itemBorderSizes,
    itemBorderColors,
    itemBorderRadius,
    buttonPrimary,
    buttonSecondary,
    buttonLinkPrimary,
    buttonLinkSecondary,
    itemButtonsPrimary,
    itemButtonsSecondary,
    itemButtonLinksPrimary,
    itemButtonLinksSecondary,
    itemTitleSizes,
    itemTitleSizesMobile,
    itemTitles,
    itemTitleFontWeights,
    itemTitleFontWeightsMobile,
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
    shortTextSize,
    shortTextSizeMobile,
    shortTextFontWeight,
    shortTextFontWeightMobile,
    itemJustifyMobile,
    buttonLabelPrimary,
    buttonLabelColorPrimary,
    buttonColorPrimary,
    buttonBorderColorPrimary,
    buttonLabelSecondary,
    buttonLabelColorSecondary,
    buttonColorSecondary,
    buttonBorderColorSecondary,
    itemButtonLabelsPrimary,
    itemButtonLabelColorsPrimary,
    itemButtonColorsPrimary,
    itemButtonBorderColorsPrimary,
    itemButtonLabelsSecondary,
    itemButtonLabelColorsSecondary,
    itemButtonColorsSecondary,
    itemButtonBorderColorsSecondary,
    itemButtonAlign,
    buttonAlign,
    titleFontWeightMobile,
    speed,
    autoplay,
    itemBackgroundPatternNamesSecondary,
    itemBackgroundPatternColorsSecondary,
    itemBackgroundWidthsSecondary,
    itemBackgroundDisplaysSecondary,
    itemBackgroundPatternSizesSecondary,
    itemBackgroundBrightnessesSecondary,
    itemBackgroundPatternOpacitiesSecondary,
    itemBackgroundPatternNamesPrimary,
    itemBackgroundPatternColorsPrimary,
    itemBackgroundWidthsPrimary,
    itemBackgroundDisplaysPrimary,
    itemBackgroundPatternSizesPrimary,
    itemBackgroundBrightnessesPrimary,
    itemBackgroundPatternOpacitiesPrimary,
    itemGapMobile,
    itemMarginTop,
    itemMarginTopMobile,
    itemMarginRight,
    itemMarginRightMobile,
    itemMarginBottom,
    itemMarginBottomMobile,
    itemMarginLeft,
    itemMarginLeftMobile,
    itemPaddingTop,
    itemPaddingTopMobile,
    itemPaddingRight,
    itemPaddingRightMobile,
    itemPaddingBottom,
    itemPaddingBottomMobile,
    itemPaddingLeft,
    itemPaddingLeftMobile,
    itemShortTextFontWeights,
    itemShortTextFontWeightsMobile,
    itemGap,
  } = form;

  const blockOptions = {
    speed: speed ? Number(speed) : undefined,
    autoplay: Number(autoplay) === 1 ? true : undefined,
    backgroundBrightnessPrimary: backgroundBrightnessPrimary
      ? parseFloat(backgroundBrightnessPrimary as string)
      : undefined,
    backgroundBrightnessSecondary: backgroundBrightnessSecondary
      ? parseFloat(backgroundBrightnessSecondary as string)
      : undefined,
    backgroundColorPrimary: backgroundColorPrimary
      ? (backgroundColorPrimary as string)
      : undefined,
    backgroundDisplayPrimary: backgroundDisplayPrimary
      ? (backgroundDisplayPrimary as string)
      : undefined,
    backgroundWidthPrimary: backgroundWidthPrimary
      ? (backgroundWidthPrimary as string)
      : undefined,
    backgroundPatternNamePrimary: backgroundPatternNamePrimary
      ? (backgroundPatternNamePrimary as string)
      : undefined,
    backgroundPatternColorPrimary: backgroundPatternColorPrimary
      ? (backgroundPatternColorPrimary as string)
      : undefined,
    backgroundPatternOpacityPrimary: backgroundPatternOpacityPrimary
      ? parseFloat(backgroundPatternOpacityPrimary as string)
      : undefined,
    backgroundPatternSizePrimary: backgroundPatternSizePrimary
      ? parseInt(backgroundPatternSizePrimary as string)
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
    buttonAlign: buttonAlign ? (buttonAlign as string) : undefined,
    columns: columns ? parseFloat(columns as string) : undefined,
    columnsMobile: columnsMobile
      ? parseFloat(columnsMobile as string)
      : undefined,
    count: count ? parseInt(count as string) : undefined,
    flipX: flipX ? (flipX as string) : undefined,
    height: height ? (height as string) : undefined,
    heightMobile: heightMobile ? (heightMobile as string) : undefined,
    itemPaddingLeftMobile: itemPaddingLeftMobile
      ? JSON.parse(itemPaddingLeftMobile as string)
      : undefined,
    itemPaddingLeft: itemPaddingLeft
      ? JSON.parse(itemPaddingLeft as string)
      : undefined,
    itemPaddingBottomMobile: itemPaddingBottomMobile
      ? JSON.parse(itemPaddingBottomMobile as string)
      : undefined,
    itemPaddingBottom: itemPaddingBottom
      ? JSON.parse(itemPaddingBottom as string)
      : undefined,
    itemPaddingRightMobile: itemPaddingRightMobile
      ? JSON.parse(itemPaddingRightMobile as string)
      : undefined,
    itemPaddingRight: itemPaddingRight
      ? JSON.parse(itemPaddingRight as string)
      : undefined,
    itemPaddingTopMobile: itemPaddingTopMobile
      ? JSON.parse(itemPaddingTopMobile as string)
      : undefined,
    itemPaddingTop: itemPaddingTop
      ? JSON.parse(itemPaddingTop as string)
      : undefined,
    itemMarginLeftMobile: itemMarginLeftMobile
      ? JSON.parse(itemMarginLeftMobile as string)
      : undefined,
    itemMarginLeft: itemMarginLeft
      ? JSON.parse(itemMarginLeft as string)
      : undefined,
    itemMarginBottomMobile: itemMarginBottomMobile
      ? JSON.parse(itemMarginBottomMobile as string)
      : undefined,
    itemMarginBottom: itemMarginBottom
      ? JSON.parse(itemMarginBottom as string)
      : undefined,
    itemMarginRightMobile: itemMarginRightMobile
      ? JSON.parse(itemMarginRightMobile as string)
      : undefined,
    itemMarginRight: itemMarginRight
      ? JSON.parse(itemMarginRight as string)
      : undefined,
    itemMarginTop: itemMarginTop
      ? JSON.parse(itemMarginTop as string)
      : undefined,
    itemMarginTopMobile: itemMarginTopMobile
      ? JSON.parse(itemMarginTopMobile as string)
      : undefined,
    itemLinks: itemLinks ? JSON.parse(itemLinks as string) : undefined,
    itemShortTextFontWeights: itemShortTextFontWeights
      ? JSON.parse(itemShortTextFontWeights as string)
      : undefined,
    itemShortTextFontWeightsMobile: itemShortTextFontWeightsMobile
      ? JSON.parse(itemShortTextFontWeightsMobile as string)
      : undefined,
    itemGap: itemGap ? JSON.parse(itemGap as string) : undefined,
    itemGapMobile: itemGapMobile
      ? JSON.parse(itemGapMobile as string)
      : undefined,
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
    itemButtonAlign: itemButtonAlign
      ? JSON.parse(itemButtonAlign as string)
      : undefined,
    itemColors: itemColors ? JSON.parse(itemColors as string) : undefined,
    itemColorsSecondary: itemColorsSecondary
      ? JSON.parse(itemColorsSecondary as string)
      : undefined,
    itemFilters: itemFilters ? JSON.parse(itemFilters as string) : undefined,
    itemBackgroundColorsPrimary: itemBackgroundColorsPrimary
      ? JSON.parse(itemBackgroundColorsPrimary as string)
      : undefined,
    itemBackgroundColorsSecondary: itemBackgroundColorsSecondary
      ? JSON.parse(itemBackgroundColorsSecondary as string)
      : undefined,
    itemImagePositions: itemImagePositions
      ? JSON.parse(itemImagePositions as string)
      : undefined,
    itemImagePositionsMobile: itemImagePositionsMobile
      ? JSON.parse(itemImagePositionsMobile as string)
      : undefined,
    itemTitleFontWeights: itemTitleFontWeights
      ? JSON.parse(itemTitleFontWeights as string)
      : undefined,
    itemTitleFontWeightsMobile: itemTitleFontWeightsMobile
      ? JSON.parse(itemTitleFontWeightsMobile as string)
      : undefined,
    imagePosition: imagePosition ? (imagePosition as string) : undefined,
    imagePositionMobile: imagePositionMobile
      ? (imagePositionMobile as string)
      : undefined,
    margin: margin ? (margin as string) : undefined,
    padding: padding ? (padding as string) : undefined,
    buttonPrimary: buttonPrimary ? (buttonPrimary as string) : undefined,
    buttonLinkPrimary: buttonLinkPrimary
      ? (buttonLinkPrimary as string)
      : undefined,
    buttonLabelPrimary: buttonLabelPrimary
      ? (buttonLabelPrimary as string)
      : undefined,
    buttonLabelColorPrimary: buttonLabelColorPrimary
      ? (buttonLabelColorPrimary as string)
      : undefined,
    buttonColorPrimary: buttonColorPrimary
      ? (buttonColorPrimary as string)
      : undefined,
    buttonBorderColorPrimary: buttonBorderColorPrimary
      ? (buttonBorderColorPrimary as string)
      : undefined,
    buttonSecondary: buttonSecondary ? (buttonSecondary as string) : undefined,
    buttonLinkSecondary: buttonLinkSecondary
      ? (buttonLinkSecondary as string)
      : undefined,
    buttonLabelSecondary: buttonLabelSecondary
      ? (buttonLabelSecondary as string)
      : undefined,
    buttonLabelColorSecondary: buttonLabelColorSecondary
      ? (buttonLabelColorSecondary as string)
      : undefined,
    buttonColorSecondary: buttonColorSecondary
      ? (buttonColorSecondary as string)
      : undefined,
    buttonBorderColorSecondary: buttonBorderColorSecondary
      ? (buttonBorderColorSecondary as string)
      : undefined,
    itemButtonsPrimary: itemButtonsPrimary
      ? JSON.parse(itemButtonsPrimary as string)
      : undefined,
    itemButtonsSecondary: itemButtonsSecondary
      ? JSON.parse(itemButtonsSecondary as string)
      : undefined,
    itemButtonLinksPrimary: itemButtonLinksPrimary
      ? JSON.parse(itemButtonLinksPrimary as string)
      : undefined,
    itemButtonLinksSecondary: itemButtonLinksSecondary
      ? JSON.parse(itemButtonLinksSecondary as string)
      : undefined,
    itemButtonLabelsPrimary: itemButtonLabelsPrimary
      ? JSON.parse(itemButtonLabelsPrimary as string)
      : undefined,
    itemButtonBorderColorsPrimary: itemButtonBorderColorsPrimary
      ? JSON.parse(itemButtonBorderColorsPrimary as string)
      : undefined,
    itemButtonLabelColorsPrimary: itemButtonLabelColorsPrimary
      ? JSON.parse(itemButtonLabelColorsPrimary as string)
      : undefined,
    itemButtonColorsPrimary: itemButtonColorsPrimary
      ? JSON.parse(itemButtonColorsPrimary as string)
      : undefined,
    itemButtonColorsSecondary: itemButtonColorsSecondary
      ? JSON.parse(itemButtonColorsSecondary as string)
      : undefined,
    itemButtonBorderColorsSecondary: itemButtonBorderColorsSecondary
      ? JSON.parse(itemButtonBorderColorsSecondary as string)
      : undefined,
    itemButtonLabelsSecondary: itemButtonLabelsSecondary
      ? JSON.parse(itemButtonLabelsSecondary as string)
      : undefined,
    itemButtonLabelColorsSecondary: itemButtonLabelColorsSecondary
      ? JSON.parse(itemButtonLabelColorsSecondary as string)
      : undefined,

    itemBackgroundPatternNamesSecondary: itemBackgroundPatternNamesSecondary
      ? JSON.parse(itemBackgroundPatternNamesSecondary as string)
      : undefined,
    itemBackgroundPatternColorsSecondary: itemBackgroundPatternColorsSecondary
      ? JSON.parse(itemBackgroundPatternColorsSecondary as string)
      : undefined,
    itemBackgroundWidthsSecondary: itemBackgroundWidthsSecondary
      ? JSON.parse(itemBackgroundWidthsSecondary as string)
      : undefined,
    itemBackgroundDisplaysSecondary: itemBackgroundDisplaysSecondary
      ? JSON.parse(itemBackgroundDisplaysSecondary as string)
      : undefined,
    itemBackgroundPatternSizesSecondary: itemBackgroundPatternSizesSecondary
      ? JSON.parse(itemBackgroundPatternSizesSecondary as string)
      : undefined,
    itemBackgroundBrightnessesSecondary: itemBackgroundBrightnessesSecondary
      ? JSON.parse(itemBackgroundBrightnessesSecondary as string)
      : undefined,
    itemBackgroundPatternOpacitiesSecondary:
      itemBackgroundPatternOpacitiesSecondary
        ? JSON.parse(itemBackgroundPatternOpacitiesSecondary as string)
        : undefined,

    itemBackgroundPatternNamesPrimary: itemBackgroundPatternNamesPrimary
      ? JSON.parse(itemBackgroundPatternNamesPrimary as string)
      : undefined,
    itemBackgroundPatternColorsPrimary: itemBackgroundPatternColorsPrimary
      ? JSON.parse(itemBackgroundPatternColorsPrimary as string)
      : undefined,
    itemBackgroundWidthsPrimary: itemBackgroundWidthsPrimary
      ? JSON.parse(itemBackgroundWidthsPrimary as string)
      : undefined,
    itemBackgroundDisplaysPrimary: itemBackgroundDisplaysPrimary
      ? JSON.parse(itemBackgroundDisplaysPrimary as string)
      : undefined,
    itemBackgroundPatternSizesPrimary: itemBackgroundPatternSizesPrimary
      ? JSON.parse(itemBackgroundPatternSizesPrimary as string)
      : undefined,
    itemBackgroundBrightnessesPrimary: itemBackgroundBrightnessesPrimary
      ? JSON.parse(itemBackgroundBrightnessesPrimary as string)
      : undefined,
    itemBackgroundPatternOpacitiesPrimary: itemBackgroundPatternOpacitiesPrimary
      ? JSON.parse(itemBackgroundPatternOpacitiesPrimary as string)
      : undefined,
    shortTextSize: shortTextSize ? (shortTextSize as string) : undefined,
    shortTextSizeMobile: shortTextSizeMobile
      ? (shortTextSizeMobile as string)
      : undefined,
    shortTextFontWeight: shortTextFontWeight
      ? (shortTextFontWeight as string)
      : undefined,
    shortTextFontWeightMobile: shortTextFontWeightMobile
      ? (shortTextFontWeightMobile as string)
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
    colorPrimary: colorPrimary ? (colorPrimary as string) : undefined,
    colorSecondary: colorSecondary ? (colorSecondary as string) : undefined,
    titleAlign: titleAlign ? (titleAlign as string) : undefined,
    titleSize: titleSize ? (titleSize as string) : undefined,
    titleSizeMobile: titleSizeMobile ? (titleSizeMobile as string) : undefined,
    titleColor: titleColor ? (titleColor as string) : undefined,
    titleFontWeight: titleFontWeight ? (titleFontWeight as string) : undefined,
    titleFontWeightMobile: titleFontWeightMobile
      ? (titleFontWeightMobile as string)
      : undefined,
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
    width: width ? (width as string) : undefined,
    widthMobile: widthMobile ? (widthMobile as string) : undefined,
  } as BlockOptions;

  return blockOptions;
};

// builds the object required for updating the block in the backend
export const getBlockUpdateValues = (form: {
  [k: string]: FormDataEntryValue;
}): NewBlockData => {
  const { previewPageId, blockName, itemIndex, contentType } = form;

  const { newContentData, blockContentOrder } = buildNewBlockData(
    blockName as BlockName,
    form,
  );

  const blockUpdateValues: NewBlockData = {
    previewPageId: parseInt(previewPageId as string),
    blockName: blockName as BlockName,
    itemIndex: parseInt(itemIndex as string),
    contentType: contentType as BlockContentType,
    contentData: newContentData as NewBlockContent,
    blockContentOrder: blockContentOrder,
  };

  return blockUpdateValues;
};

export const buildNewBlockData = (
  blockName: BlockName,
  form: {
    [k: string]: FormDataEntryValue;
  },
): { newContentData: NewBlockContent; blockContentOrder: string[] } => {
  const newData:
    | { [key in BlockContentType]: string[] | undefined }
    | Partial<Record<BlockContentType, string[]>> = {};

  const blockContentOrder: string[] = [];

  // we go through the blockmaster object getting the relevant data
  blockMaster.map(({ name, maxContentItems }: BlockMaster) => {
    const hasMultipleContent = maxContentItems && maxContentItems > 1;

    if (blockName === name) {
      // we get the types of content by key that the block requires
      const blockContentTypes = getBlockContentTypes(name);

      // in newData we set the keys recieved from getBlockContentTypes
      blockContentTypes?.map(
        (contentTypeName) =>
          (newData[contentTypeName] = hasMultipleContent ? [] : undefined),
      );

      const { PageBuilderContentSelection } = form;

      const parsedPageBuilderContentSelection = JSON.parse(
        PageBuilderContentSelection as string,
      );

      // creating an array of string for block content order ["image_id", "promotion_id"]
      parsedPageBuilderContentSelection.forEach(
        (p: PageBuilderContentSelection) => {
          blockContentOrder.push(p.type + "_" + p.contentId);
        },
      );

      // we then assign the data to each key
      (
        parsedPageBuilderContentSelection as unknown as PageBuilderContentSelection[]
      ).forEach(({ type, contentId }: PageBuilderContentSelection) => {
        blockContentTypes?.map((contentName: string) => {
          if (type === contentName && hasMultipleContent) {
            // @ts-expect-error: content name will be blocks content type from blockmaster ie: Product,Promotion etc
            newData[contentName] = [...newData[contentName], contentId];
          } else if (type === contentName && !hasMultipleContent) {
            // @ts-expect-error: content name will be blocks content type from blockmaster ie: Product,Promotion etc
            newData[contentName] = contentId;
          }
          return null;
        });
      });
    }

    return null;
  });

  const newContentData = newData as NewBlockContent;

  return { newContentData, blockContentOrder };
};

// returns content data that a user searches for in the pagebuilder
export const searchContentData = async (
  contentType: BlockContentType,
  name?: string,
) => {
  const formData = new FormData();
  if (name) {
    formData.set("name", name as string);
  }

  formData.set("page", "1");
  formData.set("perPage", "10");

  let searchResults;

  switch (contentType) {
    case "promotion": {
      const { promotions } = await searchPromotions(
        Object.fromEntries(formData),
      );
      searchResults = promotions;
      return searchResults;
    }

    case "campaign": {
      const { campaigns } = await searchCampaigns(Object.fromEntries(formData));
      searchResults = campaigns;
      return searchResults;
    }

    case "image": {
      const { images } = await searchImages(Object.fromEntries(formData));
      searchResults = images;
      return searchResults;
    }

    case "product": {
      const { products } = await searchProducts(Object.fromEntries(formData));
      searchResults = products;
      return searchResults;
    }

    case "productCategory": {
      const { productCategories } = await searchProductCategories(
        Object.fromEntries(formData),
      );
      searchResults = productCategories;
      return searchResults;
    }

    case "productSubCategory": {
      const { productSubCategories } = await searchProductSubCategories(
        Object.fromEntries(formData),
      );
      searchResults = productSubCategories;
      return searchResults;
    }

    case "brand": {
      const { brands } = await searchBrands(Object.fromEntries(formData));
      searchResults = brands;
      return searchResults;
    }

    case "store": {
      const { stores } = await searchStores(Object.fromEntries(formData));
      searchResults = stores;
      return searchResults;
    }

    case "icon": {
      const icons = await searchIcons(Object.fromEntries(formData));
      searchResults = icons;
      return searchResults;
    }

    case "other": {
      return [{ id: "blank", name: "blank item" }];
    }

    default:
      return searchResults;
  }
};
