import { prisma } from "~/db.server";
import {
  handleS3Update,
  handleS3Upload,
} from "~/integrations/aws/s3/s3.server";

export type { Brand } from "@prisma/client";

export function getBrands() {
  return prisma.brand.findMany();
}

export const getBrand = async (id: string) => {
  return prisma.brand.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      image: true,
    },
  });
};

export const upsertBrand = async (name: string, image?: Image, id?: string) => {
  let updatedBrand;

  if (!id && image) {
    const repoLink = await handleS3Upload(image);
    updatedBrand = await prisma.brand.create({
      data: {
        name: name,
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
      const repoLink = await handleS3Update(
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
      const repoLink = await handleS3Upload(image);

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
        image: imageData,
      },
      include: {
        image: true,
      },
    });
  }

  return updatedBrand;
};

export const deleteBrand = async (id: string) => {
  const brand = await prisma.brand.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!brand) {
    return false;
  }

  return await prisma.brand.delete({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchBrands = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
) => {
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
