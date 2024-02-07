import { prisma } from "~/db.server";
import { Brand, Image } from "@prisma/client";
import {
  updateImage_Integration,
  uploadImage_Integration,
} from "~/integrations/_master/storage/index.server";

import { BrandWithContent, NewBrand } from "./types";
export const getBrands = async (): Promise<Brand[] | null> => {
  return await prisma.brand.findMany();
};

export const getBrand = async (
  id: string,
): Promise<BrandWithContent | null> => {
  return prisma.brand.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      heroImage: true,
    },
  });
};

export const upsertBrand = async (
  brandData: NewBrand,
): Promise<Brand | null> => {
  const { id, name, heroImage, isActive } = brandData;

  let updatedBrand = null;

  if (!id && heroImage) {
    const repoLink = await uploadImage_Integration(heroImage);
    updatedBrand = await prisma.brand.create({
      data: {
        name: name,
        isActive,
        heroImage: {
          create: {
            href: repoLink,
            altText: heroImage.altText,
          },
        },
      },
    });
  }
  if (!id && !heroImage) {
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
        heroImage: true,
      },
    });

    if (!existingBrand) {
      throw new Error("Brand not found");
    }

    let imageData = {};

    if (heroImage && existingBrand.heroImage) {
      const repoLink = await updateImage_Integration(
        existingBrand.heroImage as Image,
        heroImage,
      );

      imageData = {
        update: {
          altText: heroImage.altText,
          href: repoLink,
        },
      };
    }

    if (heroImage && !existingBrand.heroImage) {
      const repoLink = await uploadImage_Integration(heroImage);

      imageData = {
        create: {
          url: repoLink,
          altText: heroImage.altText,
        },
      };
    }

    if (!heroImage && existingBrand.heroImage) {
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
        heroImage: imageData,
      },
      include: {
        heroImage: true,
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
  url?: URL,
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
