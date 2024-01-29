import type {
  ProductSubCategory,
  Image,
  BlockContent,
  Gender,
} from "@prisma/client";
import { CampaignWithContent } from "../Campaigns/types";
import { ProductCategoryWithDetails } from "../ProductCategories/types";
import { ProductWithDetails } from "../Products/types";
import { ImageWithDetails } from "../Images/types";

export interface ProductSubCategoryWithDetails extends ProductSubCategory {
  campaigns?: CampaignWithContent[] | null;
  tileImage?: ImageWithDetails | null;
  blockContent?: BlockContent | null;
  productCategory?: ProductCategoryWithDetails | null;
  products?: ProductWithDetails[] | null;
  maleImage?: ImageWithDetails | null;
  femaleImage?: ImageWithDetails | null;
  kidImage?: ImageWithDetails | null;
  gender: Gender;
}

export type NewProductSubCategory = {
  name: string;
  tileImage?: Image;
  maleImage?: Image;
  femaleImage?: Image;
  kidImage?: Image;
  gender?: Gender;
  productCategory: string;
  index: number;
  displayInNavigation: boolean;
  isActive: boolean;
  id?: string;
};
