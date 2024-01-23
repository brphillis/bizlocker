import { Cart, CartItem } from "@prisma/client";
import { UserWithDetails } from "../Users/types";
import { ProductVariantWithDetails } from "../Products/types";

export interface CartWithDetails extends Cart {
  cartItems?: CartItemWithDetails[] | null;
  user?: UserWithDetails | null;
}

export interface CartItemWithDetails extends CartItem {
  variant?: ProductVariantWithDetails | null;
  cart?: CartWithDetails | null;
}
