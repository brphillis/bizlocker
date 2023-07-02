import { prisma } from "~/db.server";

export const getSalesToday = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const totalPrice = await prisma.order.aggregate({
    where: {
      createdAt: {
        gte: today,
      },
      NOT: {
        status: {
          in: ["cancelled", "created"],
        },
      },
    },
    _sum: {
      totalPrice: true,
    },
  });

  return totalPrice._sum.totalPrice ?? 0;
};
