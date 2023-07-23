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
      id: parseInt(id),
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

  const productCategoryData = productCategories.map((categoryId: string) => ({
    id: parseInt(categoryId),
  }));

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
        productCategories: {
          connect: productCategoryData,
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
      productCategories: {
        disconnect: oldProductCategoryData,
        connect: productCategoryData,
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

export const getRandomCampaign = async (productCategoryIdOrName?: string) => {
  let productCategory;

  if (productCategoryIdOrName && isNaN(parseInt(productCategoryIdOrName))) {
    productCategory = await prisma.productCategory.findFirst({
      where: { name: productCategoryIdOrName },
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
    productCategoryIdOrName &&
    !isNaN(parseInt(productCategoryIdOrName))
  ) {
    productCategory = await prisma.productCategory.findUnique({
      where: { id: parseInt(productCategoryIdOrName as string) },
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

  if (!productCategory) {
    const randomCampaignAnyCategory = await getRandomCampaignAnyCategory();

    if (randomCampaignAnyCategory) {
      return randomCampaignAnyCategory;
    }
  }

  const { campaigns } = productCategory || {};

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
