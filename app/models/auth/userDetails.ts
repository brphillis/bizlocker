import { prisma } from "~/db.server";

export const getUserDetails = async (id: string) => {
  return await prisma.userDetails.findUnique({
    where: {
      userId: id,
    },
  });
};

export const upsertUserDetails = async (updateData: any) => {
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
