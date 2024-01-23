import { Image, Staff, UserDetails } from "@prisma/client";
import { AddressWithDetails } from "../UserDetails/types";
import { StoreWithDetails } from "../Stores/types";
import { TeamWithStaff } from "../Teams/types";

export interface StaffWithDetails extends Staff {
  userDetails?: UserDetails | null;
  avatar?: Image | null;
  address?: AddressWithDetails | null;
  store?: StoreWithDetails | null;
  team?: TeamWithStaff | null;
}

export interface NewStaffDetails {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  postcode: string;
  suburb: string;
  state: string;
  country: string;
  avatar?: Image | null;
  role: Role;
  jobTitle: string;
  password?: string;
  store: string;
  isActive: boolean;
}
