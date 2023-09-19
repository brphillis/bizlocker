import { prisma } from "~/db.server";

export const getHomePage = async () => {
  return prisma.homePage.findFirst({
    include: {
      blocks: {
        include: {
          blockOptions: true,
          heroBlock: {
            include: {
              product: {
                include: {
                  images: true,
                  heroImage: true,
                  variants: true,
                },
              },
              contentImage: true,
            },
          },
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
              contentImage: {
                include: {
                  image: true,
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
              contentImages: {
                include: {
                  image: true,
                },
              },
            },
          },
          textBlock: true,
          productBlock: {
            include: {
              content: {
                include: {
                  productCategory: true,
                  productSubCategory: true,
                  brand: true,
                },
              },
            },
          },
          articleBlock: {
            include: {
              content: {
                include: {
                  articleCategory: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const upsertHomePageInfo = async (
  title: string,
  description: string,
  homePageId?: number
) => {
  let homePage;

  if (!homePageId) {
    homePage = await prisma.homePage.create({
      // Provide the desired properties for the new homePage
      data: {
        title: title,
        description: description,
      },
    });
  } else {
    // Retrieve the homePage by homePageId
    homePage = await prisma.homePage.findUnique({
      where: {
        id: homePageId,
      },
    });

    if (!homePage) {
      throw new Error(`homePage not found for homePageId: ${homePageId}`);
    }

    // Update the existing homePage's title and thumbnail
    homePage = await prisma.homePage.update({
      where: {
        id: homePage.id,
      },
      data: {
        title: title,
        description: description,
      },
    });
  }

  return homePage.id;
};
