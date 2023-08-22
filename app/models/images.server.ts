import { prisma } from "~/db.server";
export type { Image } from "@prisma/client";

export function getImages() {
  return prisma.image.findMany();
}

// export const getBrand = async (id: string) => {
//   return prisma.brand.findUnique({
//     where: {
//       id: parseInt(id),
//     },
//     include: {
//       image: true,
//     },
//   });
// };

// export const upsertBrand = async (name: string, image?: Image, id?: string) => {
//   let updatedBrand;

//   if (!id && image) {
//     updatedBrand = await prisma.brand.create({
//       data: {
//         name: name,
//         image: {
//           create: {
//             url: image.url,
//             altText: image.altText,
//           },
//         },
//       },
//     });
//   }
//   if (!id && !image) {
//     updatedBrand = await prisma.brand.create({
//       data: {
//         name: name,
//       },
//     });
//   } else if (id) {
//     const existingBrand = await prisma.brand.findUnique({
//       where: {
//         id: parseInt(id),
//       },
//       include: {
//         image: true, // Include the existing image
//       },
//     });

//     if (!existingBrand) {
//       throw new Error("Brand not found");
//     }

//     let imageData = {};

//     if (image && existingBrand.image) {
//       imageData = {
//         update: {
//           url: image.url,
//           altText: image.altText,
//         },
//       };
//     }
//     if (image && !existingBrand.image) {
//       imageData = {
//         create: {
//           url: image.url,
//           altText: image.altText,
//         },
//       };
//     }
//     if (!image && existingBrand.image) {
//       imageData = {
//         delete: true,
//       };
//     }

//     updatedBrand = await prisma.brand.update({
//       where: {
//         id: parseInt(id),
//       },
//       data: {
//         name: name,
//         image: imageData,
//       },
//       include: {
//         image: true, // Include the image in the updated brand response
//       },
//     });
//   }

//   return updatedBrand;
// };

// export const deleteBrand = async (id: string) => {
//   const brand = await prisma.brand.findUnique({
//     where: {
//       id: parseInt(id),
//     },
//   });

//   if (!brand) {
//     return false;
//   }

//   return await prisma.brand.delete({
//     where: {
//       id: parseInt(id),
//     },
//   });
// };

export const searchImages = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
) => {
  const name =
    formData?.name || (url && url.searchParams.get("name")?.toString()) || "";

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

  if (name) {
    filter.name = {
      contains: name,
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
