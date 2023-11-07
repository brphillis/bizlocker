import TileBlock from "~/components/Blocks/TileBlock";
import BannerBlock from "~/components/Blocks/BannerBlock";
import TextBlock from "~/components/Blocks/TextBlock";
import HeroBlock from "~/components/Blocks/HeroBlock";
import ProductBlock from "~/components/Blocks/ProductBlock";
import ArticleBlock from "~/components/Blocks/ArticleBlock";
import MapBlock from "~/components/Blocks/MapBlock";

export type BlockName = (typeof blockMaster)[number]["name"];

export const blockMaster: BlockMaster[] = [
  {
    name: "banner",
    component: BannerBlock,
    icon: "IoTabletLandscape",
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
      link1: true,
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
    name: "tile",
    component: TileBlock,
    icon: "IoGrid",
    hasMultipleContent: true,
    maxContentItems: 6,
    options: {
      backgroundColor: true,
      backgroundBrightness: true,
      borderRadius: true,
      color5: true,
      color4: true,
      color1: true,
      color6: true,
      color3: true,
      color2: true,
      colorSecondary5: true,
      colorSecondary4: true,
      colorSecondary1: true,
      colorSecondary6: true,
      colorSecondary3: true,
      colorSecondary2: true,
      columns: true,
      columnsMobile: true,
      filter5: true,
      filter4: true,
      filter1: true,
      filter6: true,
      filter3: true,
      filter2: true,
      link5: true,
      link4: true,
      link1: true,
      link6: true,
      link3: true,
      link2: true,
      margin: true,
      padding: true,
      backgroundPatternColor: true,
      backgroundWidth: true,
      backgroundPatternName: true,
      backgroundPatternOpacity: true,
      backgroundPatternSize: true,
      borderColor: true,
      borderDisplay: true,
      borderSize: true,
      title1: true,
      title2: true,
      title3: true,
      title4: true,
      title5: true,
      title6: true,
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
      link1: true,
      link2: true,
      margin: true,
      padding: true,
      shortText: true,
      shortTextColor: true,
      style: true,
      title: true,
      titleColor: true,
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
    hasMultipleContent: true,
    maxContentItems: 100,
    options: {
      borderColor: true,
      borderDisplay: true,
      borderRadius: true,
      borderSize: true,
      itemBorderColor: true,
      itemBorderDisplay: true,
      itemBorderRadius: true,
      itemBorderSize: true,
      itemColor: true,
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
