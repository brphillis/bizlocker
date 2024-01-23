import { Department, Prisma } from "@prisma/client";
import { CampaignWithContent } from "../Campaigns/types";
import { prisma } from "~/db.server";
import { ProductCategoryWithDetails } from "../ProductCategories/types";
import { PromotionWithContent } from "../Promotions/types";

export interface DepartmentWithDetails extends Department {
  campaigns?: CampaignWithContent[] | null;
  productCategories?: ProductCategoryWithDetails[] | null;
  promotions?: PromotionWithContent[] | null;
}

export type NewDepartment = {
  name: string;
  index: number;
  isActive: boolean;
  displayInNavigation: boolean;
  productCategories?: string[];
  id?: string;
};

export type DepartmentUpsertQuery = Prisma.Args<
  typeof prisma.department,
  "upsert"
>["update"];
