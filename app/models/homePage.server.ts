import { prisma } from "~/db.server";

export const getHomePage = async () => {
  return prisma.homePage.findFirst({
    include: {
      blocks: {
        include: {
          blockOptions: true,
          bannerBlock: {
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
          tileBlock: {
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
          textBlock: true,
          productBlock: {
            include: {
              content: {
                include: {
                  rootCategory: true,
                  productCategory: true,
                  brand: true,
                },
              },
            },
          },
        },
      },
    },
  });
};
