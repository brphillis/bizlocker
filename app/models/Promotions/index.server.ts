import { prisma } from "../../db.server";
import { Gender, Image, Product, Promotion } from "@prisma/client";
import {
  updateImage_Integration,
  uploadImage_Integration,
} from "../../integrations/_master/storage/index.server";
import {
  NewPromotion,
  PromotionUpsertQuery,
  PromotionWithContent,
} from "./types";

export const getPromotions = (
  includeImages?: boolean,
  includeProducts?: boolean,
): Promise<PromotionWithContent[]> => {
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
};

export const getPromotion = async (
  id?: string,
  name?: string,
): Promise<PromotionWithContent | null> => {
  if (id) {
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
  }
  if (name) {
    return prisma.promotion.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
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
  } else return null;
};

export const getRandomPromotionBanner =
  async (): Promise<PromotionWithContent | null> => {
    const promotions = await prisma.promotion.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        bannerImage: true,
      },
    });

    if (promotions.length > 0) {
      const randomIndex = Math.floor(Math.random() * promotions.length);
      return promotions[randomIndex];
    } else {
      return null;
    }
  };

export const upsertPromotion = async (
  updateData: NewPromotion,
): Promise<{
  createdPromotion: Promotion | null;
  updatedPromotion: Promotion | null;
}> => {
  const {
    name,
    metaDescription,
    department,
    discountPercentage,
    gender = "",
    products,
    parsedBanner,
    parsedTile,
    isActive,
    id,
  } = updateData;

  if (!id) {
    const repoLinkTile = await uploadImage_Integration(parsedTile);
    const repoLinkBanner = await uploadImage_Integration(parsedBanner);

    const createdPromotion = await prisma.promotion.create({
      data: {
        name,
        metaDescription,
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
            href: repoLinkTile,
            altText: parsedTile.altText,
          },
        },
        bannerImage: {
          create: {
            href: repoLinkBanner,
            altText: parsedBanner.altText,
          },
        },
        products: products
          ? {
              connect: products.map((productId: string) => ({
                id: parseInt(productId),
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

    return { createdPromotion, updatedPromotion: null };
  } else {
    const promotion = await prisma.promotion.findUnique({
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

    const repoLinkTile = await updateImage_Integration(
      promotion?.tileImage as Image,
      parsedTile,
    );
    const repoLinkBanner = await updateImage_Integration(
      promotion?.bannerImage as Image,
      parsedBanner,
    );

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    const data: PromotionUpsertQuery = {
      name,
      metaDescription,
      department: {
        connect: {
          id: parseInt(department),
        },
      },
      discountPercentage: parseFloat(discountPercentage),
      isActive,
      tileImage: {
        update: {
          href: repoLinkTile,
          altText: parsedTile.altText,
        },
      },
      bannerImage: {
        update: {
          href: repoLinkBanner,
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
        connect: products.map((product: unknown) => ({
          id: (product as Product).id,
        })),
      };
    }

    const updatedPromotion = await prisma.promotion.update({
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
    return { updatedPromotion, createdPromotion: null };
  }
};

export const searchPromotions = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL,
): Promise<{ promotions: Promotion[]; totalPages: number }> => {
  try {
    const name =
      formData?.name || (url && url.searchParams.get("name")?.toString()) || "";
    const departmentName =
      formData?.departmentName || url?.searchParams.get("departmentName") || "";
    const pageNumber =
      (formData?.pageNumber && parseInt(formData.pageNumber as string)) ||
      (url && Number(url.searchParams.get("pageNumber"))) ||
      1;
    const perPage =
      (formData?.perPage && parseInt(formData.perPage as string)) ||
      (url && Number(url.searchParams.get("perPage"))) ||
      10;

    const skip = (pageNumber - 1) * perPage;
    const take = perPage;

    // Construct a filter based on the search parameters provided
    const filter: { [key: string]: unknown } = {};

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
  } catch (error) {
    throw new Error("Error Searching Promotions");
  }
};

export const GetRandomActivePromotions = async (
  count: number,
  includeTile?: boolean,
  includeBanner?: boolean,
): Promise<PromotionWithContent[]> => {
  const randomPromotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
    },
    include: {
      tileImage: includeTile,
      bannerImage: includeBanner,
    },
  });

  // Shuffle the array of promotions to get random order
  const shuffledPromotions = shuffleArray(randomPromotions);

  // Return the specified count of random promotions
  return shuffledPromotions.slice(0, count) as PromotionWithContent[];
};

// Function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
