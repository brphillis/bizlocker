import { BlockContent, Store } from "@prisma/client";
import { StaffWithDetails } from "../Staff/types";
import { OrderItemWithDetails } from "../Orders/types";
import {
  StockLevelWithDetails,
  StockTransferRequestWithDetails,
} from "../Stock/types";
import { TeamWithStaff } from "../Teams/types";
import { AddressWithDetails } from "../UserDetails/types";

export interface StoreWithDetails extends Store {
  stock?: StockLevelWithDetails[] | null;
  orderItem?: OrderItemWithDetails[] | null;
  staff?: StaffWithDetails[] | null;
  blockContent?: BlockContent[] | null;
  team?: TeamWithStaff[] | null;
  address?: AddressWithDetails | null;
  fromStoreStockRequest?: StockTransferRequestWithDetails[] | null;
  toStoreStockRequest?: StockTransferRequestWithDetails[] | null;
}

export type NewStore = {
  name: string;
  dateOfBirth: string | Date;
  phoneNumber: string;
  faxNumber: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  suburb: string;
  state: string;
  country: string;
  longitude: string;
  latitude: string;
  paymentProviderId: string;
  isActive: boolean;
  id?: string;
};
