import { StockLevel, StockTransferRequest } from "@prisma/client";
import { ProductVariantWithDetails } from "../Products/types";
import { StoreWithDetails } from "../Stores/types";

export interface StockLevelWithDetails extends StockLevel {
  productVariant?: ProductVariantWithDetails | null;
  store?: StoreWithDetails | null;
}

export interface StockTransferRequestWithDetails extends StockTransferRequest {
  fromStore?: StoreWithDetails | null;
  toStore?: StoreWithDetails | null;
  productVariant?: ProductVariantWithDetails | null;
}

export interface NewStockTransferRequest {
  variantId: string;
  fromStoreId: string;
  toStoreId: string;
  quantity: string;
  createdBy: string;
}
