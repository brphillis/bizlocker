import { prisma } from "../../db.server";
import {
  BlockContent,
  Image,
  Prisma,
  Product,
  ProductVariant,
} from "@prisma/client";
import { BrandWithContent } from "../Brands/types";
import { CartItemWithDetails } from "../Cart/types";
import { OrderItemWithDetails } from "../Orders/types";
import { CampaignWithContent } from "../Campaigns/types";
import { PromotionWithContent } from "../Promotions/types";
import { ProductSubCategoryWithDetails } from "../ProductSubCategories/types";
import {
  StockLevelWithDetails,
  StockTransferRequestWithDetails,
} from "../Stock/types";
import { NewProductVariant } from "../../modules/Admin/Upsert/ProductUpsert/ProductVariantUpsert";

export interface ProductWithDetails extends Product {
  promotion?: PromotionWithContent | null;
  productVariant?: ProductVariantWithDetails | null;
  brand?: BrandWithContent | null;
  campaigns?: CampaignWithContent[] | null;
  blockContent?: BlockContent[] | null;
  heroImage?: Image | null;
  images?: Image[] | null;
  productSubCategories?: ProductSubCategoryWithDetails[] | null;
  variants?: ProductVariantWithDetails[] | null;
}

export interface ProductVariantWithDetails extends ProductVariant {
  product?: ProductWithDetails | null;
  stock?: StockLevelWithDetails[] | null;
  stockTransferRequest?: StockTransferRequestWithDetails[] | null;
  cartItems?: CartItemWithDetails[] | null;
  orderItems?: OrderItemWithDetails[] | null;
}

export type NewProduct = {
  name: string;
  productSubCategories: string[];
  variants: NewProductVariant[];
  dropshipURL: string;
  dropshipSKU: string;
  description: string;
  gender: string;
  isActive: boolean;
  images?: Image[] | null;
  heroImage?: Image | null;
  brand?: string;
  promotion?: string;
  id?: string;
};

export type ProductUpsertQuery = ProductUpdateQuery | ProductCreateQuery;

export type ProductUpdateQuery = Prisma.Args<
  typeof prisma.product,
  "upsert"
>["update"];

export type ProductCreateQuery = Prisma.Args<
  typeof prisma.product,
  "create"
>["data"];
