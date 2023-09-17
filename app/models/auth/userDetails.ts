import { prisma } from "~/db.server";

export const getUserDetails = async (id: string) => {
  return await prisma.userDetails.findUnique({
    where: {
      userId: id,
    },
  });
};

export const updateUserDetails = async (updateData: any) => {
  const { id, firstName, lastName, dateOfBirth, phoneNumber } = updateData;

  return await prisma.userDetails.update({
    where: {
      userId: id,
    },
    data: {
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
    },
  });
};
