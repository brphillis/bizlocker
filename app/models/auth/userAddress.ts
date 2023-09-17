import { prisma } from "~/db.server";

export const getUserAddress = async (id: string) => {
  return await prisma.address.findUnique({
    where: {
      userId: id,
    },
  });
};

export const updateUserAddress = async (updateData: any) => {
  const { id, addressLine1, addressLine2, suburb, postcode, state, country } =
    updateData;

  return await prisma.address.update({
    where: {
      userId: id,
    },
    data: {
      addressLine1,
      addressLine2,
      suburb,
      postcode,
      state,
      country,
    },
  });
};
