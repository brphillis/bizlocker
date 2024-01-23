import { CampaignWithContent } from "../Campaigns/types";
import { BlockContent, Brand, Image } from "@prisma/client";
import { ProductWithDetails } from "../Products/types";

export interface BrandWithContent extends Brand {
  campaigns?: CampaignWithContent[] | null;
  image?: Image | null;
  blockContent?: BlockContent[] | null;
  products?: ProductWithDetails[] | null;
}

export interface NewBrand {
  id?: string;
  name: string;
  image?: Image;
  isActive: boolean;
}
