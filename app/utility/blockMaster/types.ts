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

export interface BlockMaster {
  name: string;
  component: React.ComponentType<any>;
  icon: string;
  options: BlockMasterOptions;
  content: Object;
  addOns?: string[];
  contentRequired?: boolean;
  hasMultipleContent?: boolean;
  maxContentItems?: number;
}
