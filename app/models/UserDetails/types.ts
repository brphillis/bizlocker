import { Address, UserDetails } from "@prisma/client";
import { StaffWithDetails } from "../Staff/types";
import { OrderWithDetails } from "../Orders/types";
import { StoreWithDetails } from "../Stores/types";
import { UserWithDetails } from "../Users/types";

export interface UserDetailsDetailed extends UserDetails {
  staff?: StaffWithDetails | null;
  user?: UserWithDetails | null;
}

export interface AddressWithDetails extends Address {
  user?: UserWithDetails | null;
  staff?: StaffWithDetails | null;
  order?: OrderWithDetails | null;
  store?: StoreWithDetails | null;
}

export interface NewUserDetails {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
}
