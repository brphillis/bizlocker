import { prisma } from "~/db.server";
import { Image, Prisma, Promotion } from "@prisma/client";
import { ProductWithDetails } from "../Products/types";
import { DepartmentWithDetails } from "../Departments/types";

export interface PromotionWithContent extends Promotion {
  bannerImage?: Image | null;
  tileImage?: Image | null;
  department?: DepartmentWithDetails | null;
  products?: ProductWithDetails[] | null;
}

export type NewPromotion = {
  parsedBanner: Image;
  parsedTile: Image;
  name: string;
  metaDescription?: string;
  department: string;
  products: string[];
  discountPercentage: string;
  gender: string;
  isActive: boolean;
  id?: string;
};

export type PromotionUpsertQuery = Prisma.Args<
  typeof prisma.promotion,
  "upsert"
>["update"];
