import type { Address, UserDetails } from "@prisma/client";
import { prisma } from "~/db.server";
import type { OrderWithDetails } from "../orders.server";
import type { StaffWithDetails } from "./staff.server";
import type { StoreWithDetails } from "../stores.server";
import type { UserWithDetails } from "./users.server";

export interface UserDetailsDetailed extends UserDetails {
  staff: StaffWithDetails | null;
  user: UserWithDetails | null;
}

export interface AddressWithDetails extends Address {
  user: UserWithDetails | null;
  staff: StaffWithDetails | null;
  order: OrderWithDetails | null;
  store: StoreWithDetails | null;
}

export const getUserDetails = async (
  id: string
): Promise<UserDetails | null> => {
  return await prisma.userDetails.findUnique({
    where: {
      userId: id,
    },
  });
};

export const upsertUserDetails = async (
  updateData: any
): Promise<UserDetails> => {
  const { id, firstName, lastName, dateOfBirth, phoneNumber } = updateData;

  return await prisma.userDetails.upsert({
    where: {
      userId: id,
    },
    update: {
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
    },
    create: {
      userId: id,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
    },
  });
};
