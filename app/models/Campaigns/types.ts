import { BlockContent, Prisma, Campaign, Image } from "@prisma/client";
import { BrandWithContent } from "../Brands/types";
import { prisma } from "../../db.server";
import { DepartmentWithDetails } from "../Departments/types";
import { ProductWithDetails } from "../Products/types";
import { ProductSubCategoryWithDetails } from "../ProductSubCategories/types";

export interface CampaignWithContent extends Campaign {
  bannerImage?: Image | null;
  brands?: BrandWithContent[] | null;
  department?: DepartmentWithDetails | null;
  excludedProducts?: ProductWithDetails[] | null;
  productSubCategories?: ProductSubCategoryWithDetails[] | null;
  blockContent?: BlockContent[] | null;
  tileImage?: Image | null;
}

export type NewCampaign = {
  name: string;
  department: string;
  productSubCategories?: string[];
  brands?: string[];
  minSaleRange: string;
  maxSaleRange: string;
  gender: string;
  parsedBanner: Image;
  parsedTile: Image;
  isActive: boolean;
  id?: string;
};

export type CampaignUpsertQuery = Prisma.Args<
  typeof prisma.campaign,
  "upsert"
>["update"];
