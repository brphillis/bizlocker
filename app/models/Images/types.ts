import { BlockContent, Image, PreviewPage, WebPage } from "@prisma/client";
import { ArticleWithContent } from "../Articles/types";
import { BrandWithContent } from "../Brands/types";
import { CampaignWithContent } from "../Campaigns/types";
import { ProductWithDetails } from "../Products/types";
import { ProductSubCategoryWithDetails } from "../ProductSubCategories/types";
import { PromotionWithContent } from "../Promotions/types";
import { UserWithDetails } from "../Users/types";
import { StaffWithDetails } from "../Staff/types";

export interface ImageWithDetails extends Image {
  article?: ArticleWithContent | null;
  blockContent?: BlockContent[] | null;
  brand?: BrandWithContent | null;
  campaignBanner?: CampaignWithContent[] | null;
  campaignTile?: CampaignWithContent[] | null;
  product?: ProductWithDetails | null;
  productHero?: ProductWithDetails[] | null;
  productSubCategory?: ProductSubCategoryWithDetails | null;
  promotionBanner?: PromotionWithContent[] | null;
  promotionTile?: PromotionWithContent[] | null;
  user?: UserWithDetails | null;
  staff?: StaffWithDetails | null;
  webPage?: WebPage | null;
  previewPage?: PreviewPage | null;
}
