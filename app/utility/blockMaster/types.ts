import type { BlockOptions } from "@prisma/client";

export type BlockName =
  | "tile"
  | "banner"
  | "map"
  | "text"
  | "product"
  | "article"
  | "hero"
  | "carousel";

export type BlockContentType =
  | "campaign"
  | "promotion"
  | "emptyItem"
  | "image"
  | "product"
  | "productCategory"
  | "productSubCategory"
  | "brand"
  | "article"
  | "articleCategory"
  | "richText"
  | "gender"
  | "icon"
  | "store";

export type BlockMasterOptions = TransformToOptionalBooleans<BlockOptions>;
