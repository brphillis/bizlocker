import type { ProductSubCategory, Image, BlockContent } from "@prisma/client";
import { CampaignWithContent } from "../Campaigns/types";
import { ProductCategoryWithDetails } from "../ProductCategories/types";
import { ProductWithDetails } from "../Products/types";

export interface ProductSubCategoryWithDetails extends ProductSubCategory {
  campaigns?: CampaignWithContent[] | null;
  image?: Image | null;
  blockContent?: BlockContent | null;
  productCategory?: ProductCategoryWithDetails | null;
  products?: ProductWithDetails[] | null;
}

export type NewProductSubCategory = {
  name: string;
  image?: Image;
  productCategory: string;
  index: number;
  displayInNavigation: boolean;
  isActive: boolean;
  id?: string;
};
