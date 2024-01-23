import { UserDetails } from "@prisma/client";
import { prisma } from "~/db.server";
import { NewUserDetails } from "./types";

export const getUserDetails = async (
  id: string,
): Promise<UserDetails | null> => {
  return await prisma.userDetails.findUnique({
    where: {
      userId: parseInt(id),
    },
  });
};

export const upsertUserDetails = async (
  updateData: NewUserDetails,
): Promise<UserDetails> => {
  const { id, firstName, lastName, dateOfBirth, phoneNumber } = updateData;

  return await prisma.userDetails.upsert({
    where: {
      userId: parseInt(id),
    },
    update: {
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
    },
    create: {
      userId: parseInt(id),
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
    },
  });
};
