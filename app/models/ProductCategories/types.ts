import { BlockContent, Prisma, ProductCategory } from "@prisma/client";
import { prisma } from "~/db.server";
import { ArticleCategoryWithDetails } from "../ArticleCategories/types";
import { DepartmentWithDetails } from "../Departments/types";
import { ProductSubCategoryWithDetails } from "../ProductSubCategories/types";

export interface ProductCategoryWithDetails extends ProductCategory {
  articleCategories?: ArticleCategoryWithDetails[] | null;
  department?: DepartmentWithDetails | null;
  blockContent?: BlockContent[] | null;
  productSubCategories?: ProductSubCategoryWithDetails[] | null;
}

export type NewProductCategory = {
  name: string;
  index: number;
  department: string;
  displayInNavigation: boolean;
  isActive: boolean;
  productSubCategories?: string[];
  articleCategories?: string[];
  id?: string;
};

export type ProductCategoryUpsertQuery = Prisma.Args<
  typeof prisma.productCategory,
  "upsert"
>["update"];
