import type {
  BlockContentWithDetails,
  BlockContentSorted,
} from "~/models/blocks.server";
import type { BrandWithContent } from "~/models/brands.server";
import type { CampaignWithContent } from "~/models/campaigns.server";
import type { PromotionWithContent } from "~/models/promotions.server";
import type { BlockName } from "~/utility/blockMaster/types";
import type { Image } from "@prisma/client";
import { blockMaster } from "~/utility/blockMaster/blockMaster";
import { sanitizeArray } from "./arrayHelpers";

export const getContentType = (
  content: BlockContentSorted,
): string | undefined => {
  if (content) {
    const key = Object.keys(content)[0];
    if (key) {
      return key;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
};

export const sortBlockContent = (
  content: BlockContentWithDetails,
): { [key: string]: any }[] => {
  let sortedContent: { [key: string]: any }[] = [];

  Object.keys(content).forEach((key) => {
    const items = content[key as keyof BlockContentWithDetails];
    if (items && Array.isArray(items) && items.length > 0) {
      items.forEach((item: any) => {
        const sortedItem: { [key: string]: any } = {};
        sortedItem[key] = item;
        sortedContent.push(sortedItem);
      });
    }
  });

  return sortedContent;
};

export const buildImageFromBlockContent = (
  contentData: BlockContentSorted,
  tileOrBanner?: "tileImage" | "bannerImage",
  itemLink?: string,
) => {
  const contentType = getContentType(contentData);

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

//useful for checking if a content item has connections
export const hasNonEmptyArrayObjectOrIdKey = (
  obj: Record<string, any> | null | undefined | any[],
): boolean => {
  obj = obj ?? {};

  const hasNonEmptyArray = Array.isArray(obj) && obj.length > 0;

  const hasNonEmptyObject =
    typeof obj === "object" && obj !== null && Object.keys(obj).length > 0;

  const hasIdKeyNotNull = Object.keys(obj).some((key) => {
    const value = Array.isArray(obj) ? null : obj?.[key];
    return (
      key.toLowerCase().includes("id") &&
      key.toLowerCase() !== "id" &&
      value !== null
    );
  });

  return hasNonEmptyArray || hasNonEmptyObject || hasIdKeyNotNull;
};
