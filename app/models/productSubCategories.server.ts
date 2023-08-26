import { prisma } from "~/db.server";

export const getProductSubCategories = async (inDetail?: boolean) => {
  if (inDetail) {
    return await prisma.productSubCategory.findMany({
      include: {
        productCategory: {
          include: {
            productSubCategories: true,
          },
        },
      },
    });
  } else return await prisma.productSubCategory.findMany();
};

export const getProductSubCategory = async (id: string) => {
  return await prisma.productSubCategory.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      image: true,
    },
  });
};

export const upsertProductSubCategory = async (
  name: string,
  image?: Image,
  id?: string
) => {
  let updatedProductSubCategory;

  if (!id && image) {
    updatedProductSubCategory = await prisma.productSubCategory.create({
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
    updatedProductSubCategory = await prisma.productSubCategory.create({
      data: {
        name: name,
      },
    });
  } else if (id) {
    const existingProductSubCategory =
      await prisma.productSubCategory.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          image: true, // Include the existing image
        },
      });

    if (!existingProductSubCategory) {
      throw new Error("Category not found");
    }

    let imageData = {};

    if (image && existingProductSubCategory.image) {
      imageData = {
        update: {
          url: image.url,
          altText: image.altText,
        },
      };
    }
    if (image && !existingProductSubCategory.image) {
      imageData = {
        create: {
          url: image.url,
          altText: image.altText,
        },
      };
    }
    if (!image && existingProductSubCategory.image) {
      imageData = {
        delete: true,
      };
    }

    updatedProductSubCategory = await prisma.productSubCategory.update({
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

  return updatedProductSubCategory;
};

export const deleteProductSubCategory = async (id: string) => {
  const productSubCategory = await prisma.productSubCategory.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!productSubCategory) {
    return false;
  }
  // Delete the productSubCategory
  return await prisma.productSubCategory.delete({
    where: {
      id: parseInt(id),
    },
  });
};

export const searchProductSubCategories = async (
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

  let productSubCategories;
  let totalProductSubCategories;

  const skip = (pageNumber - 1) * perPage;
  let take = perPage;
  if (perPage !== undefined) {
    if (name) {
      productSubCategories = await prisma.productSubCategory.findMany({
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

      const totalCount = await prisma.productSubCategory.count({
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

      totalProductSubCategories = totalCount;
    } else {
      productSubCategories = await prisma.productSubCategory.findMany({
        skip,
        take,
      });

      totalProductSubCategories = await prisma.productSubCategory.count();
    }
    // Update `take` for the last page if needed
    if (skip + take > totalProductSubCategories) {
      take = totalProductSubCategories - skip;
    }
  } else {
    // Retrieve all productSubCategories without pagination
    productSubCategories = await prisma.productSubCategory.findMany();
    totalProductSubCategories = productSubCategories.length;
  }

  const totalPages = Math.ceil(
    totalProductSubCategories / (Number(perPage) || 10)
  );

  return { productSubCategories, totalPages };
};
