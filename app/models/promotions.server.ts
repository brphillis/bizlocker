import type { Gender } from "@prisma/client";
import { prisma } from "~/db.server";

export function getPromotions(
  includeImages?: boolean,
  includeProducts?: boolean
) {
  if (includeImages) {
    return prisma.promotion.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        bannerImage: true,
        tileImage: true,
        products: includeProducts,
      },
    });
  } else return prisma.promotion.findMany();
}

export const getPromotion = async (id: string) => {
  return prisma.promotion.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      bannerImage: true,
      tileImage: true,
      department: true,
      products: {
        include: {
          images: true,
          variants: true,
        },
      },
    },
  });
};

export const upsertPromotion = async (updateData: any) => {
  const {
    name,
    department,
    discountPercentage,
    gender = "",
    products,
    parsedBanner,
    parsedTile,
    isActive,
    id,
  } = updateData;

  let updatedPromotion;

  if (!id) {
    updatedPromotion = await prisma.promotion.create({
      data: {
        name,
        department: {
          connect: {
            id: parseInt(department),
          },
        },
        discountPercentage: parseFloat(discountPercentage),
        targetGender: gender as Gender,
        isActive,
        tileImage: {
          create: {
            url: parsedTile.url,
            altText: parsedTile.altText,
          },
        },
        bannerImage: {
          create: {
            url: parsedBanner.url,
            altText: parsedBanner.altText,
          },
        },
        products: products
          ? {
              connect: products.map((product: any) => ({
                id: product.id,
              })),
            }
          : undefined,
      },
      include: {
        tileImage: true,
        bannerImage: true,
        products: true,
        department: true,
      },
    });
  } else {
    const existingPromotion = await prisma.promotion.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        tileImage: true,
        bannerImage: true,
        products: true,
        department: true,
      },
    });

    if (!existingPromotion) {
      throw new Error("Promotion not found");
    }

    const data: any = {
      name,
      department: {
        connect: {
          id: parseInt(department),
        },
      },
      discountPercentage: parseFloat(discountPercentage),
      isActive,
      tileImage: {
        update: {
          url: parsedTile.url,
          altText: parsedTile.altText,
        },
      },
      bannerImage: {
        update: {
          url: parsedBanner.url,
          altText: parsedBanner.altText,
        },
      },
    };

    if (gender !== "") {
      data.targetGender = gender as Gender;
    } else {
      data.targetGender = null; // Disconnect the old gender by setting it to null
    }

    if (products) {
      data.products = {
        connect: products.map((product: any) => ({
          id: product.id,
        })),
      };
    }

    updatedPromotion = await prisma.promotion.update({
      where: {
        id: parseInt(id),
      },
      data,
      include: {
        tileImage: true,
        bannerImage: true,
        products: true,
        department: true,
      },
    });
  }

  return updatedPromotion;
};

export const searchPromotions = async (searchArgs: BasicSearchArgs) => {
  const { name, departmentName, page = 1, perPage = 10 } = searchArgs;

  const skip = (page - 1) * perPage;
  const take = perPage;

  // Construct a filter based on the search parameters provided
  const filter: { [key: string]: any } = {};

  if (name) {
    filter.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (departmentName) {
    filter.department = {
      name: {
        equals: departmentName,
        mode: "insensitive",
      },
    };
  }

  // Find and count the promotions
  const [promotions, totalPromotions] = await Promise.all([
    prisma.promotion.findMany({
      where: filter,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
          },
        },
        bannerImage: true,
        tileImage: true,
      },
      skip,
      take,
    }),
    prisma.promotion.count({
      where: filter,
    }),
  ]);

  const totalPages = Math.ceil(totalPromotions / perPage);

  return { promotions, totalPages };
};
