import { prisma } from "../../db.server";
import { Image } from "@prisma/client";
import {
  deleteImage_Integration,
  updateImage_Integration,
  uploadImage_Integration,
} from "../../integrations/_master/storage/index.server";
import { ImageWithDetails } from "./types";

export const buildImageCreateQuery = async (image?: Image | null) => {
  if (image) {
    const repoLink = await uploadImage_Integration(image);

    if (repoLink) {
      return {
        create: {
          href: repoLink,
          altText: image?.altText,
        },
      };
    } else return undefined;
  } else return undefined;
};

export function getImages(): Promise<Image[]> {
  return prisma.image.findMany();
}

export const getImage = async (
  id: string,
): Promise<ImageWithDetails | null> => {
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
  image: Image,
  id?: string,
): Promise<Image> => {
  if (!id) {
    const repoLink = await uploadImage_Integration(image);
    return await prisma.image.create({
      data: {
        href: repoLink,
        altText: altText,
      },
    });
  } else {
    const existingImage = await prisma.image.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!existingImage) {
      throw new Error("Image not found");
    }

    const repoLink = await uploadImage_Integration(image);

    return await prisma.image.update({
      where: {
        id: parseInt(id),
      },
      data: {
        altText: altText,
        href: repoLink,
      },
    });
  }
};

export const deleteImage = async (id: string): Promise<Image> => {
  const image = await prisma.image.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!image) {
    throw new Error("Image Not Found");
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
  url?: URL,
): Promise<{ images: Image[]; totalPages: number }> => {
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
  const filter: { [key: string]: unknown } = {};

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

export const buildImageUpdateQuery = async (
  image?: Image | null,
  existingImage?: Image | null,
) => {
  const uploadFunction = uploadImage_Integration;
  const updateFunction = updateImage_Integration;

  let imageData = {};

  if (image && existingImage) {
    const repoLink = await updateFunction(existingImage as Image, image);

    imageData = {
      update: {
        href: repoLink,
        altText: image.altText,
      },
    };
  }

  if (image && !existingImage) {
    const repoLink = await uploadFunction(image);

    imageData = {
      create: {
        href: repoLink,
        altText: image.altText,
      },
    };
  }

  if (!image && existingImage) {
    imageData = {
      delete: true,
    };
  }

  return imageData;
};
