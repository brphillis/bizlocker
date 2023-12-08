import type {
  BannerBlockContent,
  Brand,
  Campaign,
  Department,
  Gender,
  Image,
  ProductSubCategory,
  Promotion,
  TileBlockContent,
} from "@prisma/client";
import { prisma } from "~/db.server";
import { getRandomOneOrTwo } from "~/helpers/numberHelpers";
import {
  updateImage_Integration,
  uploadImage_Integration,
} from "~/integrations/_master/storage";
import type { ProductWithDetails } from "./products.server";
import type { ImageWithDetails } from "./images.server";

export interface CampaignWithContent extends Campaign {
  bannerBlockContent: BannerBlockContent[] | null;
  bannerImage: ImageWithDetails | null;
  brands: Brand[] | null;
  department: Department | null;
  excludedProducts: ProductWithDetails[] | null;
  productSubCategories: ProductSubCategory[] | null;
  tileBlockContent: TileBlockContent[] | null;
  tileImage: ImageWithDetails | null;
}

export const getCampaigns = async (inDetail?: boolean): Promise<Campaign[]> => {
  if (inDetail) {
    return await prisma.campaign.findMany({
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
};

export const getCampaign = async (id: string): Promise<Campaign | null> => {
  return await prisma.campaign.findUnique({
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

export const upsertCampaign = async (
  updateData: any
): Promise<{
  createdCampaign: Campaign | null;
  updatedCampaign: Campaign | null;
}> => {
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

    const repoLinkTile = await uploadImage_Integration(parsedTile);
    const repoLinkBanner = await uploadImage_Integration(parsedBanner);

    const createdCampaign = await prisma.campaign.create({
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
            href: repoLinkTile,
            altText: parsedTile.altText,
          },
        },
        bannerImage: {
          create: {
            href: repoLinkBanner,
            altText: parsedBanner.altText,
          },
        },
      },
    });

    return { createdCampaign, updatedCampaign: null };
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

    const repoLinkTile = await updateImage_Integration(
      existingCampaign?.tileImage as Image,
      parsedTile
    );
    const repoLinkBanner = await updateImage_Integration(
      existingCampaign?.bannerImage as Image,
      parsedBanner
    );

    if (!existingCampaign) {
      throw new Error("Campaign not found");
    }

    let tileImageData = {
      create: {
        href: repoLinkTile,
        altText: parsedTile.altText,
      },
    };

    let bannerImageData = {
      create: {
        href: repoLinkBanner,
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

    const updatedCampaign = await prisma.campaign.update({
      where: { id: parseInt(id) },
      data,
      include: {
        tileImage: true,
        bannerImage: true,
      },
    });

    return { updatedCampaign, createdCampaign: null };
  }
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

export const getRandomCampaignOrPromotion = async (
  productSubCategoryIdOrName?: string
): Promise<
  | { campaign: Campaign | undefined; promotion: Promotion | undefined }
  | undefined
> => {
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
    const { campaign, promotion } = await getAnyCampaignOrPromotion();
    if (campaign || promotion) {
      return { campaign, promotion };
    }
  }

  const { campaigns } = productSubCategory || {};

  if (campaigns?.length === 0 || !campaigns) {
    const { campaign, promotion } = await getAnyCampaignOrPromotion();
    if (campaign || promotion) {
      return { campaign, promotion };
    }
  } else {
    const randomIndex = Math.floor(Math.random() * campaigns.length);
    const campaign = campaigns[randomIndex] as unknown as Campaign;
    let promotion;

    return { campaign, promotion };
  }
};

const getAnyCampaignOrPromotion = async (): Promise<{
  campaign: Campaign | undefined;
  promotion: Promotion | undefined;
}> => {
  let campaign: Campaign | Campaign[] | undefined;
  let promotion: Promotion | Promotion[] | undefined;
  const oneOrTwo = getRandomOneOrTwo();

  if (oneOrTwo === 1) {
    campaign = (await prisma.campaign.findMany({
      include: {
        bannerImage: true,
        tileImage: true,
      },
    })) as unknown as Campaign[];
  } else {
    promotion = (await prisma.promotion.findMany({
      include: {
        bannerImage: true,
        tileImage: true,
      },
    })) as unknown as Promotion[];
  }

  if (campaign) {
    const randomCampaignIndex = Math.floor(
      Math.random() * (campaign as Campaign[]).length
    );
    campaign = (campaign as Campaign[])[randomCampaignIndex] as Campaign;
  }
  if (promotion) {
    const randomPromotionIndex = Math.floor(
      Math.random() * (promotion as Promotion[]).length
    );
    promotion = (promotion as Promotion[])[randomPromotionIndex] as Promotion;
  }

  return { campaign, promotion };
};
