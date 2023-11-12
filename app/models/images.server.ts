import { prisma } from "~/db.server";
import {
  deleteImage_Integration,
  uploadImage_Integration,
} from "~/integrations/_master/storage";
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
    const repoLink = await uploadImage_Integration(image);
    updatedImage = await prisma.image.create({
      data: {
        href: repoLink,
        altText: altText,
      },
    });
  } else if (id && image) {
    const existingImage = await prisma.image.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingImage) {
      throw new Error("Image not found");
    }

    const repoLink = await uploadImage_Integration(image);

    updatedImage = await prisma.image.update({
      where: {
        id: parseInt(id),
      },
      data: {
        altText: altText,
        href: repoLink,
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

  if (image.href) {
    await deleteImage_Integration(image.href);
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
      { promotionBanner: { some: {} } },
      { promotionTile: { some: {} } },
    ];
  }

  if (connectionType === "campaign") {
    filter.OR = [
      { campaignBanner: { some: {} } },
      { campaignTile: { some: {} } },
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
