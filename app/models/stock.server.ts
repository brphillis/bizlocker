import { prisma } from "~/db.server";

export const getProductVariantStock = async (id: string) => {
  return prisma.stockLevel.findMany({
    where: {
      productVariantId: parseInt(id),
    },
    include: {
      store: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};
