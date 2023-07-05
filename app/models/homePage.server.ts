import { prisma } from "~/db.server";

export const getHomePage = async () => {
  return prisma.page.findFirst({
    where: {
      isHomePage: true,
    },
    include: {
      pageItems: {
        include: {
          advertBannerBlock: {
            include: {
              campaign: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
              promotion: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
            },
          },
          advertTileBlock: {
            include: {
              campaigns: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
              promotions: {
                include: {
                  bannerImage: true,
                  tileImage: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
