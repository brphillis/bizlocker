import type { Gender } from "@prisma/client";
import { prisma } from "~/db.server";

export function getCampaigns(inDetail?: boolean) {
  if (inDetail) {
    return prisma.campaign.findMany({
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        bannerImage: true,
        tileImage: true,
        brands: true,
        productCategories: true,
      },
    });
  } else return prisma.campaign.findMany();
}

export const getCampaign = async (id: string) => {
  return prisma.campaign.findUnique({
    where: {
      id: id,
    },
    include: {
      bannerImage: true,
      tileImage: true,
      department: true,
      excludedProducts: true,
      productCategories: true,
      brands: true,
    },
  });
};

export const upsertCampaign = async (updateData: any) => {
  const {
    name,
    department,
    productCategories,
    brands,
    minSaleRange,
    maxSaleRange,
    gender = "", // Provide a default value for gender
    parsedBanner,
    parsedTile,
    isActive,
    id,
  } = updateData;

  let updatedCampaign;

  const brandData = brands.map((brandName: string) => ({
    where: { name: brandName },
    create: { name: brandName },
  }));

  const productCategoryData = productCategories.map((categoryName: string) => ({
    where: { name: categoryName },
    create: { name: categoryName },
  }));

  if (!id) {
    updatedCampaign = await prisma.campaign.create({
      data: {
        name: name,
        department: {
          connectOrCreate: {
            where: { name: department },
            create: { name: department },
          },
        },
        productCategories: {
          connectOrCreate: productCategoryData,
        },
        brands: {
          connectOrCreate: brandData,
        },
        minSaleRange: parseFloat(minSaleRange),
        maxSaleRange: parseFloat(maxSaleRange),
        targetGender: gender as Gender,
        isActive: isActive,
        tileImage: {
          create: {
            url: parsedTile.url,
            altText: parsedTile.altText,
          },
        },
        bannerImage: {
          create: {
            url: parsedBanner.url,
            altText: parsedBanner.altText,
          },
        },
      },
    });
  } else {
    const existingCampaign = await prisma.campaign.findUnique({
      where: {
        id: id,
      },
      include: {
        tileImage: true,
        bannerImage: true,
        productCategories: true,
        brands: true,
      },
    });

    if (!existingCampaign) {
      throw new Error("Campaign not found");
    }

    let tileImageData = {
      create: {
        url: parsedTile.url,
        altText: parsedTile.altText,
      },
    };

    let bannerImageData = {
      create: {
        url: parsedBanner.url,
        altText: parsedBanner.altText,
      },
    };

    // Disconnect from old product categories and brands
    const oldProductCategoryData = existingCampaign.productCategories.map(
      (category: any) => ({
        name: category.name,
      })
    );
    const oldBrandData = existingCampaign.brands.map((brand: any) => ({
      name: brand.name,
    }));

    // Conditionally include targetGender based on the presence of gender
    const data: any = {
      name: name,
      department: {
        connectOrCreate: {
          where: { name: department },
          create: { name: department },
        },
      },
      productCategories: {
        disconnect: oldProductCategoryData,
        connectOrCreate: productCategoryData,
      },
      brands: {
        disconnect: oldBrandData,
        connectOrCreate: brandData,
      },
      minSaleRange: parseFloat(minSaleRange),
      maxSaleRange: parseFloat(maxSaleRange),
      isActive: isActive,
      tileImage: tileImageData,
      bannerImage: bannerImageData,
    };

    if (gender !== "") {
      data.targetGender = gender as Gender;
    } else {
      data.targetGender = null; // Disconnect the old gender by setting it to null
    }

    updatedCampaign = await prisma.campaign.update({
      where: {
        id: id,
      },
      data: data,
      include: {
        tileImage: true,
        bannerImage: true,
      },
    });
  }

  return updatedCampaign;
};

export const searchCampaigns = async (searchArgs: BasicSearchArgs) => {
  const { name, departmentName, page = 1, perPage = 10 } = searchArgs;

  const skip = (page - 1) * perPage;
  const take = perPage;

  // Construct a filter based on the search parameters provided
  const filter: { [key: string]: any } = {};

  if (name) {
    filter.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  if (departmentName) {
    filter.department = {
      name: {
        equals: departmentName,
        mode: "insensitive",
      },
    };
  }

  // Find and count the campaigns
  const [campaigns, totalCampaigns] = await Promise.all([
    prisma.campaign.findMany({
      where: filter,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        excludedProducts: {
          select: {
            id: true,
            name: true,
          },
        },
        bannerImage: true,
        tileImage: true,
      },
      skip,
      take,
    }),
    prisma.campaign.count({
      where: filter,
    }),
  ]);

  const totalPages = Math.ceil(totalCampaigns / perPage);

  return { campaigns, totalPages };
};
