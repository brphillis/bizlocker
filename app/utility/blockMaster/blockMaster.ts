import type { BlockOptions } from "@prisma/client";
import type { BlockContentType, BlockName } from "./types";
import TileBlock from "~/components/Blocks/TileBlock";
import BannerBlock from "~/components/Blocks/BannerBlock";
import TextBlock from "~/components/Blocks/TextBlock";
import HeroBlock from "~/components/Blocks/HeroBlock";
import ProductBlock from "~/components/Blocks/ProductBlock";
import ArticleBlock from "~/components/Blocks/ArticleBlock";
import MapBlock from "~/components/Blocks/MapBlock";
import CarouselBlock from "~/components/Blocks/CarouselBlock";

export type BlockMasterOptions = TransformToOptionalBooleans<BlockOptions>;

export interface BlockMaster {
  name: string;
  // we can expect any component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  icon: string;
  options: BlockMasterOptions;
  content: object | null;
  addOns?: string[];
  contentRequired?: boolean;
  maxContentItems?: number;
}

export const blockMaster: BlockMaster[] = [
  {
    name: "banner",
    component: BannerBlock,
    icon: "IoTabletLandscape",
    maxContentItems: 1,
    options: {
      backgroundColorPrimary: true,
      backgroundColorSecondary: true,
      backgroundPatternColorPrimary: true,
      backgroundPatternNamePrimary: true,
      backgroundPatternSizePrimary: true,
      borderColor: true,
      borderDisplay: true,
      borderRadius: true,
      borderSize: true,
      margin: true,
      padding: true,
      shortText: true,
      shortTextColor: true,
      size: true,
      title: true,
      titleColor: true,
      titleFontWeight: true,
      titleFontWeightMobile: true,
      titleSize: true,
      titleSizeMobile: true,
      justify: true,
      justifyMobile: true,
      align: true,
      alignMobile: true,
    },
    content: {
      image: true,
      promotion: {
        include: {
          bannerImage: true,
        },
      },
      campaign: {
        include: {
          bannerImage: true,
        },
      },
    },
  },
  {
    name: "carousel",
    component: CarouselBlock,
    icon: "IoLaptopSharp",
    maxContentItems: 10,
    options: {
      autoplay: true,
      backgroundBrightnessPrimary: true,
      backgroundColorPrimary: true,
      backgroundDisplayPrimary: true,
      backgroundPatternColorPrimary: true,
      backgroundPatternNamePrimary: true,
      backgroundPatternSizePrimary: true,
      backgroundWidthPrimary: true,
      columns: true,
      columnsMobile: true,
      height: true,
      heightMobile: true,
      itemAlign: true,
      itemAlignMobile: true,
      itemBackgroundColorsPrimary: true,
      itemBackgroundDisplaysPrimary: true,
      itemBorderColors: true,
      itemGap: true,
      itemGapMobile: true,
      itemShortTextFontWeights: true,
      itemShortTextFontWeightsMobile: true,
      itemBorderDisplays: true,
      itemBorderRadius: true,
      itemBorderSizes: true,
      itemButtonAlign: true,
      itemButtonBorderColorsPrimary: true,
      itemButtonBorderColorsSecondary: true,
      itemButtonColorsPrimary: true,
      itemButtonColorsSecondary: true,
      itemButtonLabelColorsPrimary: true,
      itemButtonLabelColorsSecondary: true,
      itemButtonLabelsPrimary: true,
      itemButtonLabelsSecondary: true,
      itemButtonLinksPrimary: true,
      itemButtonLinksSecondary: true,
      itemButtonsPrimary: true,
      itemButtonsSecondary: true,
      itemImagePositions: true,
      itemImagePositionsMobile: true,
      itemJustify: true,
      itemJustifyMobile: true,
      itemShortText: true,
      itemShortTextColors: true,
      itemShortTextSizes: true,
      itemShortTextSizesMobile: true,
      itemTitleColors: true,
      itemTitleFontWeights: true,
      itemTitleFontWeightsMobile: true,
      itemTitles: true,
      itemTitleSizes: true,
      itemTitleSizesMobile: true,
      itemMarginBottom: true,
      itemMarginBottomMobile: true,
      itemMarginLeft: true,
      itemMarginLeftMobile: true,
      itemMarginRight: true,
      itemMarginRightMobile: true,
      itemMarginTop: true,
      itemMarginTopMobile: true,
      itemPaddingTopMobile: true,
      itemPaddingBottom: true,
      itemPaddingBottomMobile: true,
      itemPaddingLeft: true,
      itemPaddingLeftMobile: true,
      itemPaddingRight: true,
      itemPaddingRightMobile: true,
      itemPaddingTop: true,
      margin: true,
      padding: true,
      speed: true,
      width: true,
    },
    content: {
      image: true,
    },
  },
  {
    name: "tile",
    component: TileBlock,
    icon: "IoGrid",
    maxContentItems: 6,
    options: {
      backgroundBrightnessPrimary: true,
      backgroundColorPrimary: true,
      backgroundPatternColorPrimary: true,
      backgroundPatternNamePrimary: true,
      backgroundPatternSizePrimary: true,
      backgroundWidthPrimary: true,
      borderDisplay: true,
      borderRadius: true,
      columns: true,
      columnsMobile: true,
      itemBackgroundColorsPrimary: true,
      itemBackgroundColorsSecondary: true,
      itemBorderColors: true,
      itemBorderDisplays: true,
      itemBorderRadius: true,
      itemBorderSizes: true,
      itemColors: true,
      itemFilters: true,
      itemLinks: true,
      itemTitleColors: true,
      itemTitles: true,
      margin: true,
      padding: true,
      itemAlign: true,
      itemAlignMobile: true,
      itemJustify: true,
      itemJustifyMobile: true,
      itemMarginBottom: true,
      itemMarginBottomMobile: true,
      itemMarginLeft: true,
      itemMarginLeftMobile: true,
      itemMarginRight: true,
      itemMarginRightMobile: true,
      itemMarginTop: true,
      itemMarginTopMobile: true,
      itemPaddingTopMobile: true,
      itemPaddingBottom: true,
      itemPaddingBottomMobile: true,
      itemPaddingLeft: true,
      itemPaddingLeftMobile: true,
      itemPaddingRight: true,
      itemPaddingRightMobile: true,
      itemPaddingTop: true,
      itemTitleFontWeights: true,
      itemTitleSizes: true,
      itemTitleFontWeightsMobile: true,
      itemTitleSizesMobile: true,
      itemShortTextColors: true,
      itemShortTextFontWeights: true,
      itemShortTextSizes: true,
      itemShortTextFontWeightsMobile: true,
      itemShortTextSizesMobile: true,
      itemShortText: true,
      itemGap: true,
      itemGapMobile: true,
    },
    addOns: ["icon"],
    content: {
      image: true,
      promotion: {
        include: {
          tileImage: true,
        },
      },
      campaign: {
        include: {
          tileImage: true,
        },
      },
      brand: {
        include: {
          image: true,
        },
      },
    },
  },
  {
    name: "hero",
    component: HeroBlock,
    icon: "IoLayers",
    maxContentItems: 1,
    options: {
      backgroundBrightnessSecondary: true,
      backgroundColorPrimary: true,
      backgroundColorSecondary: true,
      backgroundPatternColorSecondary: true,
      backgroundPatternNameSecondary: true,
      backgroundPatternSizeSecondary: true,
      borderColor: true,
      borderDisplay: true,
      borderRadius: true,
      borderSize: true,
      flipX: true,
      margin: true,
      padding: true,
      shortText: true,
      shortTextColor: true,
      style: true,
      title: true,
      titleColor: true,
      titleFontWeight: true,
      titleFontWeightMobile: true,
      titleSize: true,
      titleSizeMobile: true,
    },
    content: {
      product: {
        include: {
          variants: true,
          heroImage: true,
          brand: {
            include: {
              image: true,
            },
          },
        },
      },
    },
  },
  {
    name: "map",
    component: MapBlock,
    icon: "IoMap",
    maxContentItems: 100,
    options: {
      borderColor: true,
      borderDisplay: true,
      borderRadius: true,
      borderSize: true,
      colorPrimary: true,
      itemBorderColors: true,
      itemBorderDisplays: true,
      itemBorderRadius: true,
      itemBorderSizes: true,
      margin: true,
      size: true,
      style: true,
      title: true,
      titleAlign: true,
      titleColor: true,
      titleFontWeight: true,
      titleSize: true,
    },
    content: {
      store: {
        include: {
          address: true,
        },
      },
    },
  },
  {
    name: "text",
    component: TextBlock,
    icon: "IoText",
    options: {
      backgroundColorPrimary: true,
      backgroundWidthPrimary: true,
      margin: true,
      size: true,
    },
    addOns: ["richText"],
    content: null,
  },
  {
    name: "product",
    component: ProductBlock,
    icon: "IoCart",
    options: {
      columns: true,
      count: true,
      sortBy: true,
      sortOrder: true,
    },
    content: {
      brand: true,
      productCategory: true,
      productSubCategory: true,
    },
  },
  {
    name: "article",
    component: ArticleBlock,
    icon: "IoNewspaper",
    options: {
      columns: true,
      count: true,
      sortBy: true,
      sortOrder: true,
    },
    content: {
      articleCategory: true,
    },
  },
];

export const buildBlocksContentQuery = (
  blocks: { id: number; name: string }[],
): object => {
  const query = {
    include: {} as { [key: string]: boolean | object },
  };

  for (let i = 0; i < blocks.length; i++) {
    const blockMasterBlockContent = (blockMaster.find(
      (blockMasterBlock) => blockMasterBlock.name === blocks[i].name,
    )?.content || {}) as { [key: string]: boolean | object };

    for (const contentType in blockMasterBlockContent) {
      const contentTypeValue = blockMasterBlockContent[contentType];

      if (typeof query.include[contentType] === "boolean") {
        // If it's a boolean, replace the existing value
        query.include[contentType] = contentTypeValue as boolean;
      } else if (typeof query.include[contentType] === "object") {
        // If it's an object, merge the existing object with a new property
        query.include[contentType] = {
          ...(query.include[contentType] as object),
          ...(contentTypeValue as object),
        };
      } else {
        // If it doesn't exist, create a new property
        query.include[contentType] = contentTypeValue;
      }
    }
  }

  return query;
};

export const getBlockContentTypes = (
  blockName: BlockName,
): BlockContentType[] => {
  const block = blockMaster.find((b) => b.name === blockName);

  if (!block) {
    return [];
  }

  const contentTypes: string[] = [];

  if (block.content) {
    for (const key in block.content) {
      contentTypes.push(key);
    }
  }

  if (block.addOns) {
    block.addOns.forEach((addOn) => contentTypes.push(addOn));
  }

  return contentTypes as BlockContentType[];
};
