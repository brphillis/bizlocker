import { prisma } from "~/db.server";
import type { BlockContent, Brand, Image } from "@prisma/client";
import {
  updateImage_Integration,
  uploadImage_Integration,
} from "~/integrations/_master/storage";
import type { ProductWithDetails } from "./products.server";
import type { CampaignWithContent } from "./campaigns.server";
export type { Brand } from "@prisma/client";

export interface BrandWithContent extends Brand {
  campaigns?: CampaignWithContent[] | null;
  image?: Image | null;
  blockContent?: BlockContent[] | null;
  products?: ProductWithDetails[] | null;
}

export interface NewBrand {
  id?: string;
  name: string;
  image?: Image;
  isActive: boolean;
}

export const getBrands = async (): Promise<Brand[] | null> => {
  return await prisma.brand.findMany();
};

export const getBrand = async (
  id: string
): Promise<BrandWithContent | null> => {
  return prisma.brand.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      image: true,
    },
  });
};

export const upsertBrand = async (
  brandData: NewBrand
): Promise<Brand | null> => {
  const { id, name, image, isActive } = brandData;

  let updatedBrand = null;

  if (!id && image) {
    const repoLink = await uploadImage_Integration(image);
    updatedBrand = await prisma.brand.create({
      data: {
        name: name,
        isActive,
        image: {
          create: {
            href: repoLink,
            altText: image.altText,
          },
        },
      },
    });
  }
  if (!id && !image) {
    updatedBrand = await prisma.brand.create({
      data: {
        name: name,
        isActive,
      },
    });
  } else if (id) {
    const existingBrand = await prisma.brand.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        image: true,
      },
    });

    if (!existingBrand) {
      throw new Error("Brand not found");
    }

    let imageData = {};

    if (image && existingBrand.image) {
      const repoLink = await updateImage_Integration(
        existingBrand.image as Image,
        image
      );

      imageData = {
        update: {
          altText: image.altText,
          href: repoLink,
        },
      };
    }

    if (image && !existingBrand.image) {
      const repoLink = await uploadImage_Integration(image);

      imageData = {
        create: {
          url: repoLink,
          altText: image.altText,
        },
      };
    }

    if (!image && existingBrand.image) {
      imageData = {
        delete: true,
      };
    }

    updatedBrand = await prisma.brand.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        isActive,
        image: imageData,
      },
      include: {
        image: true,
      },
    });
  }

  return updatedBrand;
};

export const deleteBrand = async (id: string): Promise<Brand | null> => {
  return await prisma.brand.findUnique({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchBrands = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
): Promise<{ brands: Brand[]; totalPages: number }> => {
  const name =
    formData?.name || (url && url.searchParams.get("name")?.toString()) || "";
  const pageNumber =
    (formData?.pageNumber && parseInt(formData.pageNumber as string)) ||
    (url && Number(url.searchParams.get("pageNumber"))) ||
    1;
  const perPage =
    (formData?.perPage && parseInt(formData.perPage as string)) ||
    (url && Number(url.searchParams.get("perPage"))) ||
    10;
  let brands;
  let totalBrands;

  const skip = (pageNumber - 1) * perPage;
  let take = perPage;
  if (perPage !== undefined) {
    if (name) {
      brands = await prisma.brand.findMany({
        where: {
          OR: [
            {
              name: {
                contains: (name as string) || "",
                mode: "insensitive",
              },
            },
          ],
        },
        skip,
        take,
      });

      const totalCount = await prisma.brand.count({
        where: {
          OR: [
            {
              name: {
                contains: (name as string) || "",
                mode: "insensitive",
              },
            },
          ],
        },
      });

      totalBrands = totalCount;
    } else {
      brands = await prisma.brand.findMany({
        skip,
        take,
      });

      totalBrands = await prisma.brand.count();
    }
    // Update `take` for the last page if needed
    if (skip + take > totalBrands) {
      take = totalBrands - skip;
    }
  } else {
    // Retrieve all brands without pagination
    brands = await prisma.brand.findMany();
    totalBrands = brands.length;
  }

  const totalPages = Math.ceil(totalBrands / (Number(perPage) || 10));

  return { brands, totalPages };
};
