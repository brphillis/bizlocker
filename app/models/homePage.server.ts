import { prisma } from "~/db.server";

export const getHomePage = async () => {
  return prisma.homePage.findFirst({
    include: {
      blocks: {
        include: {
          blockOptions: true,
          heroBlock: {
            include: {
              content: {
                include: {
                  product: {
                    include: {
                      variants: true,
                      heroImage: true,
                      brand: {
                        include: {
                          image: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          bannerBlock: {
            include: {
              content: {
                include: {
                  image: true,
                  promotion: {
                    include: {
                      bannerImage: true,
                    },
                  },
                  campaign: {
                    include: {
                      bannerImage: true,
                    },
                  },
                },
              },
            },
          },
          tileBlock: {
            include: {
              content: {
                include: {
                  image: true,
                  promotion: {
                    include: {
                      tileBlockContent: true,
                      tileImage: true,
                    },
                  },
                  campaign: {
                    include: {
                      tileBlockContent: true,
                      tileImage: true,
                    },
                  },
                },
              },
            },
          },
          textBlock: {
            include: {
              content: true,
            },
          },
          productBlock: {
            include: {
              content: {
                include: {
                  brand: true,
                  productCategory: true,
                  productSubCategory: true,
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
