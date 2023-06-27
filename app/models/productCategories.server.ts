import { prisma } from "~/db.server";

export const getProductCategories = async (id?: string) => {
  return await prisma.productCategory.findMany();
};

export const getProductCategory = async (id: string) => {
  return await prisma.productCategory.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      image: true,
    },
  });
};

export const upsertProductCategory = async (
  name: string,
  image?: Image,
  id?: string
) => {
  let updatedProductCategory;

  if (!id && image) {
    updatedProductCategory = await prisma.productCategory.create({
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
    updatedProductCategory = await prisma.productCategory.create({
      data: {
        name: name,
      },
    });
  } else if (id) {
    const existingProductCategory = await prisma.productCategory.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        image: true, // Include the existing image
      },
    });

    if (!existingProductCategory) {
      throw new Error("Category not found");
    }

    let imageData = {};

    if (image && existingProductCategory.image) {
      imageData = {
        update: {
          url: image.url,
          altText: image.altText,
        },
      };
    }
    if (image && !existingProductCategory.image) {
      imageData = {
        create: {
          url: image.url,
          altText: image.altText,
        },
      };
    }
    if (!image && existingProductCategory.image) {
      imageData = {
        delete: true,
      };
    }

    updatedProductCategory = await prisma.productCategory.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        image: imageData,
      },
      include: {
        image: true, // Include the image in the updated response
      },
    });
  }

  return updatedProductCategory;
};

export const deleteProductCategory = async (id: string) => {
  const productCategory = await prisma.productCategory.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!productCategory) {
    return false;
  }
  // Delete the productCategory
  return await prisma.productCategory.delete({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchProductCategories = async (searchArgs: BasicSearchArgs) => {
  const { name, page, perPage } = searchArgs;

  let productCategories;
  let totalProductCategories;

  const skip = (page - 1) * perPage;
  let take = perPage;
  if (perPage !== undefined) {
    if (name) {
      productCategories = await prisma.productCategory.findMany({
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

      const totalCount = await prisma.productCategory.count({
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

      totalProductCategories = totalCount;
    } else {
      productCategories = await prisma.productCategory.findMany({
        skip,
        take,
      });

      totalProductCategories = await prisma.productCategory.count();
    }
    // Update `take` for the last page if needed
    if (skip + take > totalProductCategories) {
      take = totalProductCategories - skip;
    }
  } else {
    // Retrieve all productCategories without pagination
    productCategories = await prisma.productCategory.findMany();
    totalProductCategories = productCategories.length;
  }

  const totalPages = Math.ceil(
    totalProductCategories / (Number(perPage) || 10)
  );

  return { productCategories, totalPages };
};
