import { prisma } from "~/db.server";

export const getUserAddress = async (id: string) => {
  return await prisma.address.findUnique({
    where: {
      userId: id,
    },
  });
};

export const upsertUserAddress = async (updateData: any) => {
  const { id, addressLine1, addressLine2, suburb, postcode, state, country } =
    updateData;

  return await prisma.address.upsert({
    where: {
      userId: id,
    },
    update: {
      addressLine1,
      addressLine2,
      suburb,
      postcode,
      state,
      country,
    },
    create: {
      userId: id,
      addressLine1,
      addressLine2,
      suburb,
      postcode,
      state,
      country,
    },
  });
};
