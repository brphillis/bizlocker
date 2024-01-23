import { Order, OrderItem } from "@prisma/client";
import { AddressWithDetails } from "../UserDetails/types";
import { UserWithDetails } from "../Users/types";
import { ProductVariantWithDetails } from "../Products/types";
import { StoreWithDetails } from "../Stores/types";

export interface OrderWithDetails extends Order {
  items?: OrderItemWithDetails[] | null;
  address?: AddressWithDetails | null;
  user?: UserWithDetails | null;
}

export interface OrderItemWithDetails extends OrderItem {
  variant?: ProductVariantWithDetails | null;
  store?: StoreWithDetails | null;
  order?: OrderWithDetails | null;
}
