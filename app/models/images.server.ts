import { prisma } from "~/db.server";
export type { Image } from "@prisma/client";

export function getImages() {
  return prisma.image.findMany();
}

export const getImage = async (id: string) => {
  return prisma.image.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      promotionBanner: true,
      promotionTile: true,
      campaignBanner: true,
      campaignTile: true,
    },
  });
};

export const upsertImage = async (
  altText: string,
  image?: Image,
  id?: string
) => {
  let updatedImage;

  if (!id && image) {
    updatedImage = await prisma.image.create({
      data: {
        altText: altText,
        url: image.url,
      },
    });
  } else if (id) {
    const existingImage = await prisma.image.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingImage) {
      throw new Error("Image not found");
    }

    updatedImage = await prisma.image.update({
      where: {
        id: parseInt(id),
      },
      data: {
        altText: altText,
        url: image?.url,
      },
    });
  }

  return updatedImage;
};

export const deleteImage = async (id: string) => {
  const image = await prisma.image.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!image) {
    return false;
  }

  return await prisma.image.delete({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchImages = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
) => {
  const title =
    formData?.name || (url && url.searchParams.get("title")?.toString()) || "";

  const connectionType =
    formData?.name ||
    (url && url.searchParams.get("connectionType")?.toString()) ||
    "";

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

  if (title) {
    filter.altText = {
      contains: title,
      mode: "insensitive",
    };
  }

  filter.user = { is: null };

  if (connectionType === "promotion") {
    filter.OR = [
      {
        promotionBanner: { isNot: null },
      },
      {
        promotionTile: { isNot: null },
      },
    ];
  }

  if (connectionType === "campaign") {
    filter.OR = [
      {
        campaignBanner: { isNot: null },
      },
      {
        campaignTile: { isNot: null },
      },
    ];
  }

  if (connectionType === "brand") {
    filter.brand = { isNot: null };
  }

  if (connectionType === "product") {
    filter.product = { isNot: null };
  }

  if (connectionType === "article") {
    filter.article = { isNot: null };
  }

  if (connectionType === "disconnected") {
    filter.OR = [
      {
        promotionBanner: { is: null },
      },
      {
        promotionTile: { is: null },
      },
    ];
    filter.OR = [
      {
        campaignBanner: { is: null },
      },
      {
        campaignTile: { is: null },
      },
    ];
    filter.brand = { is: null };
    filter.product = { is: null };
    filter.article = { is: null };
  }

  // Find and count the images
  const [images, totalImages] = await Promise.all([
    prisma.image.findMany({
      where: filter,
      include: {
        campaignTile: true,
        campaignBanner: true,
      },
      skip,
      take,
    }),
    prisma.image.count({
      where: filter,
    }),
  ]);

  const totalPages = Math.ceil(totalImages / perPage);

  return { images, totalPages };
};
