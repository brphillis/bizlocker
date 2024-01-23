import {
  ArticleCategory,
  Block,
  BlockContent,
  BlockOptions,
  Gender,
  ProductCategory,
  ProductSubCategory,
} from "@prisma/client";
import { ArticleWithContent } from "../Articles/types";
import { BrandWithContent } from "../Brands/types";
import { CampaignWithContent } from "../Campaigns/types";
import { BlockName } from "~/utility/blockMaster/types";
import { HomePageWithContent } from "../HomePage/types";
import { ImageWithDetails } from "../Images/types";
import { PreviewPageWithContent } from "../PreviewPage/types";
import { ProductWithDetails } from "../Products/types";
import { PromotionWithContent } from "../Promotions/types";
import { StoreWithDetails } from "../Stores/types";
import { WebPageWithContent } from "../WebPages/types";

export interface BlockWithContent extends Block {
  name: BlockName;
  blockOptions?: BlockOptions[] | null;
  content?: BlockContentWithDetails | null;
  previewPage?: PreviewPageWithContent[] | null;
  homePage?: HomePageWithContent[] | null;
  webPage?: WebPageWithContent[] | null;
  article?: ArticleWithContent[] | null;
}

export interface BlockContentWithDetails extends BlockContent {
  articleCategory?: ArticleCategory[] | null;
  gender: Gender[];
  productSubCategory?: ProductSubCategory[] | null;
  block?: BlockWithContent | null;
  brand?: BrandWithContent[] | null;
  campaign?: CampaignWithContent[] | null;
  product: ProductWithDetails[] | null;
  productCategory?: ProductCategory[] | null;
  promotion?: PromotionWithContent[] | null;
  image?: ImageWithDetails[] | null;
  article?: ArticleWithContent[] | null;
  store?: StoreWithDetails[] | null;
}

type Unarray<T> = T extends (infer U)[] ? U : T;

type UnarrayProperties<T> = {
  [K in keyof T]: Unarray<T[K]>;
};

export type BlockContentSorted = UnarrayProperties<BlockContentWithDetails>;
