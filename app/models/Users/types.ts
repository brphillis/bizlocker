import { User, Image } from "@prisma/client";
import { AddressWithDetails, UserDetailsDetailed } from "../UserDetails/types";
import { CartItemWithDetails } from "../Cart/types";
import { OrderWithDetails } from "../Orders/types";

export interface UserWithDetails extends User {
  avatar?: Image | null;
  address?: AddressWithDetails | null;
  cart?: CartItemWithDetails | null;
  orders?: OrderWithDetails[] | null;
  userDetails?: UserDetailsDetailed | null;
}

export type NewUser = {
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  suburb: string;
  state: string;
  country: string;
  avatar?: Image | null;
  isActive: boolean;
  id?: string;
};
