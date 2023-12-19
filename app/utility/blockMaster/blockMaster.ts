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
      backgroundPatternOpacity: true,
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
      backgroundBrightness: true,
      backgroundColor: true,
      backgroundDisplay: true,
      backgroundPatternColor: true,
      backgroundPatternName: true,
      backgroundPatternOpacity: true,
      backgroundPatternSize: true,
      columns: true,
      columnsMobile: true,
      itemAlign: true,
      itemAlignMobile: true,
      itemBackgroundColors: true,
      itemBorderColors: true,
      itemBorderDisplays: true,
      itemBorderRadius: true,
      itemBorderSizes: true,
      itemColors: true,
      itemImagePositions: true,
      itemImagePositionsMobile: true,
      itemJustify: true,
      itemJustifyMobile: true,
      itemPrimaryButtonBorderColors: true,
      itemPrimaryButtonColors: true,
      itemPrimaryButtonLabelColors: true,
      itemPrimaryButtonLabels: true,
      itemPrimaryButtonLinks: true,
      itemPrimaryButtons: true,
      itemSecondaryButtonLinks: true,
      itemSecondaryButtons: true,
      itemSecondaryColors: true,
      itemSecondaryBackgroundColors: true,
      itemSecondaryButtonBorderColors: true,
      itemSecondaryButtonColors: true,
      itemSecondaryButtonLabelColors: true,
      itemSecondaryButtonLabels: true,
      itemShortText: true,
      itemShortTextColors: true,
      itemShortTextSizes: true,
      itemShortTextSizesMobile: true,
      itemTitleColors: true,
      itemTitles: true,
      itemTitleSizes: true,
      itemTitleSizesMobile: true,
      margin: true,
      padding: true,
      size: true,
      sizeMobile: true,
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
      borderRadius: true,
      columns: true,
      columnsMobile: true,
      margin: true,
      padding: true,
      backgroundPatternName: true,
      backgroundPatternOpacity: true,
      backgroundPatternSize: true,
      backgroundPatternColor: true,
      backgroundWidth: true,
      borderDisplay: true,
      itemFilters: true,
      itemColors: true,
      itemLinks: true,
      itemTitles: true,
      itemTitleColors: true,
      itemBackgroundColors: true,
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
      backgroundColor: true,
      backgroundColorSecondary: true,
      backgroundBrightnessSecondary: true,
      backgroundPatternColorSecondary: true,
      backgroundPatternNameSecondary: true,
      backgroundPatternOpacitySecondary: true,
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
      itemBorderColors: true,
      itemBorderDisplays: true,
      itemBorderRadius: true,
      itemBorderSizes: true,
      primaryColor: true,
      margin: true,
      size: true,
      style: true,
      title: true,
      titleColor: true,
      titleSize: true,
      titleAlign: true,
      titleWeight: true,
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
      size: true,
      backgroundColor: true,
      backgroundWidth: true,
      margin: true,
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

// returns an array of all blocknames eg: [bannerBlock,tileBlock...etc]
export const blockTypes = blockMaster.map((block) => block.name + "Block");

// Prisma include to include all blockTypes with all blocks
// eg = include: includeAllBlockTypes()
export const includeAllBlockTypes = () => {
  const blocksObject: { include: Record<string, boolean> } = {
    include: {},
  };

  blockTypes.forEach((type) => {
    blocksObject.include[type] = true;
  });

  return { blocks: blocksObject };
};

// Used in the loader functions for pagebuilders
export const includeBlocksData = {
  include: {
    blockOptions: true,
    ...Object.fromEntries(
      blockMaster.map((block) => [
        `${block.name}Block`,
        { include: { content: block.content || true } },
      ])
    ),
  },
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
