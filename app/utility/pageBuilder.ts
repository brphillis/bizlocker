import { searchCampaigns } from "~/models/campaigns.server";
import { searchPromotions } from "~/models/promotions.server";

export const getFormBlockOptions = (form: {
  [k: string]: FormDataEntryValue;
}): NewBlockOptions => {
  const { sortBy, sortOrder, size, count, rows, columns } = form;

  const blockOptions = {
    sortBy: sortBy as SortBy,
    sortOrder: sortOrder as SortOrder,
    size: size as "small" | "medium" | "large",
    count: count && parseInt(count as string),
    rows: rows && parseInt(rows as string),
    columns: columns && parseInt(columns as string),
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
  const { pageId, blockName, itemIndex, contentType, contentData, stringData } =
    form;

  const parsedContentData = parseContentData(contentData);
  const parsedObjectData = parseObjectData(blockName as string, form);

  const blockUpdateValues = {
    pageId: parseInt(pageId as string),
    blockName: blockName as BlockName,
    itemIndex: parseInt(itemIndex as string),
    contentType: contentType as BlockContentType,
    contentData: parsedContentData,
    stringData: stringData as string,
    objectData: parsedObjectData,
  } as NewBlockData;

  return blockUpdateValues;
};

export const parseContentData = (contentData: FormDataEntryValue) => {
  let contentDataParsed;

  if (contentData) {
    contentDataParsed = JSON.parse(contentData as string) as
      | Campaign[]
      | Promotion[];

    contentDataParsed = Array.isArray(contentDataParsed)
      ? contentDataParsed
      : [contentDataParsed];

    return contentDataParsed;
  }
};

export const parseObjectData = (
  blockName: string,
  form: {
    [k: string]: FormDataEntryValue;
  }
) => {
  let objectData;

  if (blockName === "product") {
    const { rootCategory, productCategory, brand } = form;
    objectData = {
      rootCategory: rootCategory,
      productCategory: productCategory,
      brand: brand,
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

    default:
      return { searchResults };
  }
};
