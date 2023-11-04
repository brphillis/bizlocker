import type { Gender } from "@prisma/client";
import { prisma } from "~/db.server";
import {
  updateImage_Integration,
  uploadImage_Integration,
} from "~/integrations/_master/storage";

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

export const getPromotion = async (id?: string, name?: string) => {
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
        name: name,
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
    const repoLinkTile = await uploadImage_Integration(parsedTile);
    const repoLinkBanner = await uploadImage_Integration(parsedBanner);

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

    const repoLinkTile = await updateImage_Integration(
      existingPromotion?.tileImage as Image,
      parsedTile
    );
    const repoLinkBanner = await updateImage_Integration(
      existingPromotion?.bannerImage as Image,
      parsedBanner
    );

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

export const searchPromotions = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
) => {
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
  } catch (error) {
    console.error("Error in searchPromotions:", error);
    throw error; // Rethrow the error for higher-level error handling
  }
};
