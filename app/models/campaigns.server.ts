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
        productSubCategories: true,
      },
    });
  } else return prisma.campaign.findMany();
}

export const getCampaign = async (id: string) => {
  return prisma.campaign.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      bannerImage: true,
      tileImage: true,
      department: true,
      excludedProducts: true,
      productSubCategories: true,
      brands: true,
    },
  });
};

export const upsertCampaign = async (updateData: any) => {
  const {
    name,
    department,
    productSubCategories,
    brands,
    minSaleRange,
    maxSaleRange,
    gender = "",
    parsedBanner,
    parsedTile,
    isActive,
    id,
  } = updateData;

  let updatedCampaign;

  const brandData = brands.map((brandId: string) => ({
    id: parseInt(brandId),
  }));

  const productSubCategoryData = productSubCategories.map(
    (categoryId: string) => ({
      id: parseInt(categoryId),
    })
  );

  if (!id) {
    // Create a new campaign
    updatedCampaign = await prisma.campaign.create({
      data: {
        name,
        department: {
          connect: {
            id: parseInt(department),
          },
        },
        productSubCategories: {
          connect: productSubCategoryData,
        },
        brands: {
          connect: brandData,
        },
        minSaleRange: parseFloat(minSaleRange),
        maxSaleRange: parseFloat(maxSaleRange),
        targetGender: gender as Gender,
        isActive,
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
    // Update an existing campaign
    const existingCampaign = await prisma.campaign.findUnique({
      where: { id: parseInt(id) },
      include: {
        tileImage: true,
        bannerImage: true,
        productSubCategories: true,
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
    const oldProductSubCategoryData = existingCampaign.productSubCategories.map(
      (category: any) => ({ id: category.id })
    );
    const oldBrandData = existingCampaign.brands.map((brand: any) => ({
      id: brand.id,
    }));

    // Conditionally include targetGender based on the presence of gender
    const data: any = {
      name,
      department: {
        connect: {
          id: parseInt(department),
        },
      },
      productSubCategories: {
        disconnect: oldProductSubCategoryData,
        connect: productSubCategoryData,
      },
      brands: {
        disconnect: oldBrandData,
        connect: brandData,
      },
      minSaleRange: parseFloat(minSaleRange),
      maxSaleRange: parseFloat(maxSaleRange),
      isActive,
      tileImage: tileImageData,
      bannerImage: bannerImageData,
    };

    if (gender !== "") {
      data.targetGender = gender as Gender;
    } else {
      data.targetGender = null; // Disconnect the old gender by setting it to null
    }

    updatedCampaign = await prisma.campaign.update({
      where: { id: parseInt(id) },
      data,
      include: {
        tileImage: true,
        bannerImage: true,
      },
    });
  }

  return updatedCampaign;
};

export const searchCampaigns = async (
  formData?: { [k: string]: FormDataEntryValue },
  url?: URL
) => {
  const name =
    formData?.name || (url && url.searchParams.get("name")?.toString()) || "";
  const departmentName =
    formData?.departmentName || url?.searchParams.get("departmentName") || "";
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

export const getRandomCampaign = async (
  productSubCategoryIdOrName?: string
) => {
  let productSubCategory;

  if (
    productSubCategoryIdOrName &&
    isNaN(parseInt(productSubCategoryIdOrName))
  ) {
    productSubCategory = await prisma.productSubCategory.findFirst({
      where: { name: productSubCategoryIdOrName },
      include: {
        campaigns: {
          include: {
            bannerImage: true,
            tileImage: true,
          },
        },
      },
    });
  } else if (
    productSubCategoryIdOrName &&
    !isNaN(parseInt(productSubCategoryIdOrName))
  ) {
    productSubCategory = await prisma.productSubCategory.findUnique({
      where: { id: parseInt(productSubCategoryIdOrName as string) },
      include: {
        campaigns: {
          include: {
            bannerImage: true,
            tileImage: true,
          },
        },
      },
    });
  }

  if (!productSubCategory) {
    const randomCampaignAnyCategory = await getRandomCampaignAnyCategory();

    if (randomCampaignAnyCategory) {
      return randomCampaignAnyCategory;
    }
  }

  const { campaigns } = productSubCategory || {};

  if (campaigns?.length === 0 || !campaigns) {
    const randomCampaignAnyCategory = await getRandomCampaignAnyCategory();

    if (randomCampaignAnyCategory) {
      return randomCampaignAnyCategory;
    }
  } else {
    const randomIndex = Math.floor(Math.random() * campaigns.length);
    const randomCampaign = campaigns[randomIndex];

    return randomCampaign;
  }
};

const getRandomCampaignAnyCategory = async () => {
  const campaigns = await prisma.campaign.findMany({
    include: {
      bannerImage: true,
      tileImage: true,
    },
  });

  if (!campaigns || campaigns.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * campaigns.length);
  const randomCampaign = campaigns[randomIndex];

  return randomCampaign;
};
