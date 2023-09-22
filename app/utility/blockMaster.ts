import TileBlock from "~/components/Blocks/TileBlock";
import BannerBlock from "../components/Blocks/BannerBlock";
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
      size: true,
      margin: true,
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
    options: {
      columns: true,
      size: true,
      primaryLink: true,
      secondaryLink: true,
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
      },
    },
  },
  {
    name: "hero",
    component: HeroBlock,
    options: {
      style: true,
      title: true,
      titleColor: true,
      shortText: true,
      shortTextColor: true,
      backgroundColor: true,
      borderDisplay: true,
      borderSize: true,
      borderColor: true,
      borderRadius: true,
      margin: true,
      primaryLink: true,
      secondaryLink: true,
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
