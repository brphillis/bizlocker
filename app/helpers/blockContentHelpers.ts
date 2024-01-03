import type { BlockContentWithDetails } from "~/models/blocks.server";
import type { BrandWithContent } from "~/models/brands.server";
import type { CampaignWithContent } from "~/models/campaigns.server";
import type { PromotionWithContent } from "~/models/promotions.server";
import type { BlockContentType, BlockName } from "~/utility/blockMaster/types";
import type {
  BlockOptions,
  Brand,
  Campaign,
  Image,
  Promotion,
} from "@prisma/client";
import { blockMaster } from "~/utility/blockMaster/blockMaster";

//gets the correct option for the item, example "title1"
export const getItemOption = (
  options: BlockOptions,
  key: string,
  index: number
): string | undefined => {
  const result = options[`${key}${index + 1}` as keyof BlockOptions] as string;

  if (result) {
    return result;
  } else return undefined;
};

export const determineSingleContentType = (
  content: BlockContentWithDetails
): BlockContentType | undefined => {
  if (content) {
    for (const key in content) {
      if (
        content.hasOwnProperty(key) &&
        typeof content[key as keyof BlockContentWithDetails] === "object" &&
        content[key as keyof BlockContentWithDetails] !== null // Check for null or undefined
      ) {
        // Ensure that the value is an object before calling Object.keys
        const nestedObject = content[
          key as keyof BlockContentWithDetails
        ] as Record<string, any>;

        if (Object.keys(nestedObject).length > 0) {
          return key as BlockContentType;
        }
      }
    }
  }
  return undefined;
};

export const concatBlockContent = (
  content: BlockContentWithDetails
): BlockContentWithDetails[] => {
  const joinedContent: any = [];

  if ((content?.image as Image[])?.length > 0) {
    (content?.image as Image[])?.forEach((e: any) =>
      joinedContent.push({ image: e })
    );
  }
  if ((content?.promotion as Promotion[])?.length > 0) {
    (content?.promotion as Promotion[]).forEach((e: any) =>
      joinedContent.push({ promotion: e })
    );
  }
  if ((content?.campaign as Campaign[])?.length > 0) {
    (content?.campaign as Campaign[])?.forEach((e: any) =>
      joinedContent.push({ campaign: e })
    );
  }
  if ((content?.brand as Brand[])?.length > 0) {
    (content?.brand as Brand[])?.forEach((e: any) =>
      joinedContent.push({ brand: e })
    );
  }
  if ((content?.icon as string[])?.length > 0) {
    (content?.icon as string[])?.forEach((e: any) =>
      joinedContent.push({ icon: e })
    );
  }

  return joinedContent;
};

export const buildContentImageFromContent = (
  contentType: BlockContentType,
  contentData: any,
  tileOrBanner?: "tileImage" | "bannerImage",
  itemLink?: string
) => {
  let name: string = "tileImage";
  let link: string = " ";
  let imageSrc: string = " ";
  if (contentType === "promotion" && tileOrBanner) {
    const promotion = contentData?.promotion as PromotionWithContent;
    name = promotion?.name || name;
    link = `/promotion/${name}`;
    imageSrc = promotion?.[tileOrBanner]?.href || imageSrc;
  } else if (contentType === "campaign" && tileOrBanner) {
    const campaign = contentData?.campaign as CampaignWithContent;
    name = campaign?.name || name;
    link = `/campaign/${name}`;
    imageSrc = campaign?.[tileOrBanner]?.href || imageSrc;
  } else if (contentType === "brand") {
    const brand = contentData?.brand as BrandWithContent;
    name = brand?.name || name;
    link = `/products?brand=${name}`;
    imageSrc = brand?.image?.href || imageSrc;
  } else if (contentType === "image") {
    imageSrc = (contentData?.image as Image)?.href || imageSrc;
    name = (contentData?.image as Image)?.altText || "";

    if (itemLink) {
      link = itemLink;
    }
  }
  //if a custom links is set in the editor we over ride with it
  return { name, link, imageSrc };
};

export const blockHasMaxContentItems = (blockName: BlockName): boolean => {
  const blockDetails = blockMaster.find((e) => e.name === blockName);

  if (blockDetails && blockDetails.maxContentItems) {
    return true;
  } else return false;
};
