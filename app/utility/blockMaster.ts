import TileBlock from "~/components/Blocks/TileBlock";
import BannerBlock from "~/components/Blocks/BannerBlock";
import TextBlock from "~/components/Blocks/TextBlock";
import HeroBlock from "~/components/Blocks/HeroBlock";
import ProductBlock from "~/components/Blocks/ProductBlock";
import ArticleBlock from "~/components/Blocks/ArticleBlock";

export const blockMaster: BlockMaster[] = [
  {
    name: "banner",
    component: BannerBlock,
    options: {
      backgroundColor: true,
      backgroundColorTwo: true,
      backgroundPatternColor: true,
      backgroundPatternName: true,
      backgroundPatternOpacity: true,
      backgroundPatternSize: true,
      borderColor: true,
      borderDisplay: true,
      borderRadius: true,
      borderSize: true,
      linkOne: true,
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
    hasMultipleContent: true,
    maxContentItems: 6,
    options: {
      backgroundColor: true,
      backgroundBrightness: true,
      borderRadius: true,
      colorFive: true,
      colorFour: true,
      colorOne: true,
      colorSix: true,
      colorThree: true,
      colorTwo: true,
      columns: true,
      columnsMobile: true,
      filterFive: true,
      filterFour: true,
      filterOne: true,
      filterSix: true,
      filterThree: true,
      filterTwo: true,
      linkFive: true,
      linkFour: true,
      linkOne: true,
      linkSix: true,
      linkThree: true,
      linkTwo: true,
      margin: true,
      padding: true,
      backgroundPatternColor: true,
      backgroundPatternName: true,
      backgroundPatternOpacity: true,
      backgroundPatternSize: true,
      borderColor: true,
      borderDisplay: true,
      borderSize: true,
    },
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
    options: {
      backgroundColor: true,
      backgroundColorTwo: true,
      borderColor: true,
      borderDisplay: true,
      borderRadius: true,
      borderSize: true,
      flipX: true,
      linkOne: true,
      linkTwo: true,
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
    name: "text",
    component: TextBlock,
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

  return contentTypes as BlockContentType[];
};
