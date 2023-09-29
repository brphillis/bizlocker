import { searchCampaigns } from "~/models/campaigns.server";
import { searchImages } from "~/models/images.server";
import { searchProducts } from "~/models/products.server";
import { searchPromotions } from "~/models/promotions.server";
import { blockMaster, getBlockContentTypes } from "./blockMaster";

// a register for the blockoptions so the function knows which keys to look for in the formdata
export const getFormBlockOptions = (form: {
  [k: string]: FormDataEntryValue;
}): BlockOptions => {
  const {
    backgroundColor,
    borderColor,
    borderDisplay,
    borderRadius,
    borderSize,
    columns,
    count,
    flipX,
    linkFive,
    linkFour,
    linkOne,
    linkSix,
    linkThree,
    linkTwo,
    margin,
    rows,
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
    flipX: flipX ? (flipX as string) : undefined,
    margin: margin ? (margin as string) : undefined,
    linkOne: linkOne ? (linkOne as string) : undefined,
    linkTwo: linkTwo ? (linkTwo as string) : undefined,
    linkThree: linkThree ? (linkThree as string) : undefined,
    linkFour: linkFour ? (linkFour as string) : undefined,
    linkFive: linkFive ? (linkFive as string) : undefined,
    linkSix: linkSix ? (linkSix as string) : undefined,
    rows: rows ? parseInt(rows as string) : undefined,
    shortText: shortText ? (shortText as string) : undefined,
    shortTextColor: shortTextColor ? (shortTextColor as string) : undefined,
    size: size as "small" | "medium" | "large",
    sortBy: sortBy as SortBy,
    sortOrder: sortOrder as SortOrder,
    style: style ? (style as string) : undefined,
    title: title ? (title as string) : undefined,
    titleColor: titleColor ? (titleColor as string) : undefined,
  } as BlockOptions;

  return blockOptions;
};

// builds the object required for updating the block in the backend
export const getBlockUpdateValues = (form: {
  [k: string]: FormDataEntryValue;
}): NewBlockData => {
  const { pageId, blockName, itemIndex, contentType } = form;

  const parsedObjectData = buildNewBlockData(blockName as BlockName, form);

  const blockUpdateValues = {
    pageId: parseInt(pageId as string),
    blockName: blockName as BlockName,
    itemIndex: parseInt(itemIndex as string),
    contentType: contentType as BlockContentType,
    contentData: parsedObjectData,
  } as NewBlockData;

  return blockUpdateValues;
};

export const buildNewBlockData = (
  blockName: BlockName,
  form: {
    [k: string]: FormDataEntryValue;
  }
) => {
  let newData: any = {};

  // we go through the blockmaster object getting the relevant data
  blockMaster.map(({ name, hasMultipleContent }: BlockMaster) => {
    if (blockName === name) {
      // we get the types of content by key that the block requires
      const blockContentTypes = getBlockContentTypes(name);

      // in newData we set the keys recieved from getBlockContentTypes
      blockContentTypes?.map(
        (contentTypeName) =>
          (newData[contentTypeName] = hasMultipleContent ? [] : undefined)
      );

      let { contentSelection } = form;

      contentSelection = JSON.parse(contentSelection as string);

      // we then assign the data to each key
      (contentSelection as unknown as ContentSelection[]).forEach(
        ({ type, contentId }: ContentSelection) => {
          blockContentTypes?.map((contentName: any) => {
            if (type === contentName && hasMultipleContent) {
              newData[contentName] = [...newData[contentName], contentId];
            } else if (type === contentName && !hasMultipleContent) {
              newData[contentName] = contentId;
            }
            return null;
          });
        }
      );
    }
    return null;
  });

  return newData;
};

// returns content data that a user searches for in the pagebuilder
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
