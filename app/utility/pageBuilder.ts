import { searchCampaigns } from "~/models/campaigns.server";
import { searchImages } from "~/models/images.server";
import { searchProducts } from "~/models/products.server";
import { searchPromotions } from "~/models/promotions.server";

export const getFormBlockOptions = (form: {
  [k: string]: FormDataEntryValue;
}): NewBlockOptions => {
  const {
    backgroundColor,
    borderColor,
    borderDisplay,
    borderRadius,
    borderSize,
    columns,
    count,
    margin,
    primaryLink,
    rows,
    secondaryLink,
    shortText,
    shortTextColor,
    size,
    sortBy,
    sortOrder,
    style,
    title,
    titleColor,
  } = form;

  const blockOptions = {
    backgroundColor: backgroundColor ? (backgroundColor as string) : undefined,
    borderColor: borderColor ? (borderColor as string) : undefined,
    borderDisplay: borderDisplay ? (borderDisplay as string) : undefined,
    borderRadius: borderRadius ? (borderRadius as string) : undefined,
    borderSize: borderSize ? (borderSize as string) : undefined,
    columns: columns ? parseInt(columns as string) : undefined,
    count: count ? parseInt(count as string) : undefined,
    margin: margin ? (margin as string) : undefined,
    primaryLink: primaryLink ? (primaryLink as string) : undefined,
    rows: rows ? parseInt(rows as string) : undefined,
    secondaryLink: secondaryLink ? (secondaryLink as string) : undefined,
    shortText: shortText ? (shortText as string) : undefined,
    shortTextColor: shortTextColor ? (shortTextColor as string) : undefined,
    size: size as "small" | "medium" | "large",
    sortBy: sortBy as SortBy,
    sortOrder: sortOrder as SortOrder,
    style: style ? (style as string) : undefined,
    title: title ? (title as string) : undefined,
    titleColor: titleColor ? (titleColor as string) : undefined,
  } as NewBlockOptions;

  return blockOptions;
};

type NewBlockData = {
  pageId: number;
  blockName: BlockName;
  itemIndex: number;
  contentType?: BlockContentType;
  contentData?: Promotion[] | Campaign[];
  stringData?: string;
};

export const getBlockUpdateValues = (form: {
  [k: string]: FormDataEntryValue;
}): NewBlockData => {
  const { pageId, blockName, itemIndex, contentType } = form;

  const parsedObjectData = parseObjectData(blockName as string, form);

  const blockUpdateValues = {
    pageId: parseInt(pageId as string),
    blockName: blockName as BlockName,
    itemIndex: parseInt(itemIndex as string),
    contentType: contentType as BlockContentType,
    contentData: parsedObjectData,
  } as NewBlockData;

  return blockUpdateValues;
};

export const parseObjectData = (
  blockName: string,
  form: {
    [k: string]: FormDataEntryValue;
  }
) => {
  let objectData;

  if (blockName === "product") {
    const { productCategory, productSubCategory, brand, gender } = form;
    objectData = {
      productCategory: productCategory,
      productSubCategory: productSubCategory,
      brand: brand,
      gender: gender,
    };
  }
  if (blockName === "article") {
    const { articleCategory } = form;
    objectData = {
      articleCategory: articleCategory,
    };
  }
  if (blockName === "banner") {
    const { promotion, campaign, image } = form;
    objectData = {
      promotion: promotion,
      campaign: campaign,
      image: image ? JSON.parse(image as string) : undefined,
    };
  }
  if (blockName === "tile") {
    const { promotion, campaign, image } = form;
    objectData = {
      promotion: promotion,
      campaign: campaign,
      image: image ? JSON.parse(image as string) : undefined,
    };
  }
  if (blockName === "hero") {
    const { product } = form;
    objectData = {
      product: product ? JSON.parse(product as string) : undefined,
    };
  }
  if (blockName === "text") {
    const { richText } = form;
    objectData = {
      richText: richText,
    };
  }

  return objectData;
};

export const searchContentData = async (
  contentType: BlockContentType,
  name?: string
) => {
  const formData = new FormData();
  if (name) {
    formData.set("name", name as string);
  }
  formData.set("page", "1");
  formData.set("perPage", "10");

  let searchResults;

  switch (contentType) {
    case "promotion":
      const { promotions } = await searchPromotions(
        Object.fromEntries(formData)
      );
      searchResults = promotions;

      return { searchResults };
    case "campaign":
      const { campaigns } = await searchCampaigns(Object.fromEntries(formData));
      searchResults = campaigns;

      return { searchResults };

    case "image":
      const { images } = await searchImages(Object.fromEntries(formData));
      searchResults = images;

      return { searchResults };

    case "product":
      const { products } = await searchProducts(Object.fromEntries(formData));
      searchResults = products;

      return { searchResults };

    default:
      return { searchResults };
  }
};
