import { prisma } from "~/db.server";
export type { Brand } from "@prisma/client";

export function getBrands(id?: string) {
  if (!id) {
    return prisma.brand.findMany();
  } else {
    return prisma.brand.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        image: true,
      },
    });
  }
}

export const upsertBrand = async (name: string, image?: Image, id?: string) => {
  let updatedBrand;

  if (!id && image) {
    updatedBrand = await prisma.brand.create({
      data: {
        name: name,
        image: {
          create: {
            url: image.url,
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
        image: true, // Include the existing image
      },
    });

    if (!existingBrand) {
      throw new Error("Brand not found");
    }

    let imageData = {};

    if (image && existingBrand.image) {
      imageData = {
        update: {
          url: image.url,
          altText: image.altText,
        },
      };
    }
    if (image && !existingBrand.image) {
      imageData = {
        create: {
          url: image.url,
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
        image: true, // Include the image in the updated brand response
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
  // Delete the brand
  return await prisma.brand.delete({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchBrands = async (searchArgs: BasicSearchArgs) => {
  const { name, page, perPage } = searchArgs;

  let brands;
  let totalBrands;

  const skip = (page - 1) * perPage;
  let take = perPage;
  if (perPage !== undefined) {
    if (name) {
      brands = await prisma.brand.findMany({
        where: {
          OR: [
            {
              name: {
                contains: name || "",
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
                contains: name || "",
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
