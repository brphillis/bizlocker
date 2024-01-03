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
  component: React.ComponentType<any>;
  icon: string;
  options: BlockMasterOptions;
  content: Object;
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
      backgroundColor: true,
      backgroundColorSecondary: true,
      backgroundPatternColor: true,
      backgroundPatternName: true,
      backgroundPatternSize: true,
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
    },
    content: {
      include: {
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
  },
  {
    name: "carousel",
    component: CarouselBlock,
    icon: "IoLaptopSharp",
    maxContentItems: 10,
    options: {
      autoplay: true,
      backgroundBrightness: true,
      backgroundColor: true,
      backgroundDisplay: true,
      backgroundPatternColor: true,
      backgroundPatternName: true,
      backgroundPatternSize: true,
      backgroundWidth: true,
      columns: true,
      columnsMobile: true,
      height: true,
      heightMobile: true,
      itemAlign: true,
      itemAlignMobile: true,
      itemBackgroundColorsPrimary: true,
      itemBackgroundColorsSecondary: true,
      itemBackgroundDisplaysSecondary: true,
      itemBorderColors: true,
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
      itemColorsSecondary: true,
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
      margin: true,
      padding: true,
      speed: true,
      width: true,
    },
    content: {
      include: {
        image: true,
      },
    },
  },
  {
    name: "tile",
    component: TileBlock,
    icon: "IoGrid",
    maxContentItems: 6,
    options: {
      backgroundBrightness: true,
      backgroundColor: true,
      backgroundPatternColor: true,
      backgroundPatternName: true,
      backgroundPatternSize: true,
      backgroundWidth: true,
      borderDisplay: true,
      borderRadius: true,
      columns: true,
      columnsMobile: true,
      itemBackgroundColorsPrimary: true,
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
    },
    addOns: ["icon"],
    content: {
      include: {
        image: true,
        promotion: {
          include: {
            tileBlockContent: true,
            tileImage: true,
          },
        },
        campaign: {
          include: {
            tileBlockContent: true,
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
  },
  {
    name: "hero",
    component: HeroBlock,
    icon: "IoLayers",
    maxContentItems: 1,
    options: {
      backgroundBrightnessSecondary: true,
      backgroundColor: true,
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
      include: {
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
      include: {
        store: {
          include: {
            address: true,
          },
        },
      },
    },
  },
  {
    name: "text",
    component: TextBlock,
    icon: "IoText",
    options: {
      backgroundColor: true,
      backgroundWidth: true,
      margin: true,
      size: true,
    },
    content: true,
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
      include: {
        brand: true,
        productCategory: true,
        productSubCategory: true,
      },
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
      include: {
        articleCategory: true,
      },
    },
  },
];

export const activeContentTypes = {
  product: true,
  productCategory: true,
  articleCategory: true,
  brand: true,
  image: true,
  campaign: true,
  promotion: true,
  productSubCategory: true,
  store: true,
};

// returns an array of content types a block accepts, built from the blockmaster object
export const getBlockContentTypes = (
  blockName: BlockName
): BlockContentType[] => {
  const block = blockMaster.find((b) => b.name === blockName);

  if (!block) {
    return [];
  }

  if (blockName === "text") {
    return ["richText"];
  }

  const contentTypes: string[] = [];

  const processContent = (content: any, parentName = "") => {
    for (const key in content) {
      if (key === "include" && typeof content[key] === "object") {
        for (const subKey in content[key]) {
          contentTypes.push(subKey);
        }
      } else if (typeof content[key] === "object") {
        processContent(content[key], parentName);
      }
    }
  };

  if (block.content) {
    processContent(block.content);
  }

  if (block.addOns) {
    block.addOns.forEach((addOn) => contentTypes.push(addOn));
  }

  return contentTypes as BlockContentType[];
};
