import { Image } from "@prisma/client";
import { BlockName } from "~/utility/blockMaster/types";
import { BrandWithContent } from "~/models/Brands/types";
import { CampaignWithContent } from "~/models/Campaigns/types";
import { blockMaster } from "~/utility/blockMaster/blockMaster";
import { PromotionWithContent } from "~/models/Promotions/types";
import {
  BlockContentSorted,
  BlockContentWithDetails,
} from "~/models/Blocks/types";
import { returnSortedBlockContent } from "./blockHelpers";
import { ProductSubCategoryWithDetails } from "~/models/ProductSubCategories/types";

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
  contentOrder: string[],
  content: BlockContentWithDetails,
): RenderBlockContent[] => {
  // Organize BlockContent for Block Renderer / FE Dev Readability
  const organizedContent: RenderBlockContent[] = [];

  Object.keys(content).forEach((key) => {
    const items = content[key as keyof BlockContentWithDetails];
    if (items && Array.isArray(items) && items.length > 0) {
      items.forEach((item: unknown) => {
        const sortedItem: RenderBlockContent = {};
        sortedItem[key] = item;
        organizedContent.push(sortedItem);
      });
    }
  });

  if (!contentOrder || (contentOrder && contentOrder.length === 0)) {
    return organizedContent;
  }

  // Sort Block Content in order of BlockContentOrder
  const sortedContent = returnSortedBlockContent(
    organizedContent,
    contentOrder,
    "blockrenderer",
  );

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
  } else if (contentType === "productSubCategory" && tileOrBanner) {
    const subCategory =
      contentData?.productSubCategory as ProductSubCategoryWithDetails;
    name = subCategory?.name || name;
    link = `/products?productSubCategory=${name}`;
    imageSrc = subCategory?.tileImage?.href || imageSrc;
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
  obj: Record<string, unknown> | null | undefined | unknown[],
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
