import { searchCampaigns } from "~/models/campaigns.server";
import { searchPromotions } from "~/models/promotions.server";

export const getBlockOptions = (form: {
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

  const blockUpdateValues = {
    pageId: parseInt(pageId as string),
    blockName: blockName as BlockName,
    itemIndex: parseInt(itemIndex as string),
    contentType: contentType as BlockContentType,
    contentData: parsedContentData,
    stringData: stringData as string,
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

export const searchContentData = async (
  name: string,
  contentType: BlockContentType
) => {
  const searchQuery = {
    name: name as string,
    page: 1,
    perPage: 10,
  };

  let searchResults;

  switch (contentType) {
    case "promotion":
      const { promotions } = await searchPromotions(searchQuery);
      searchResults = promotions;
      return { searchResults };
    case "campaign":
      const { campaigns } = await searchCampaigns(searchQuery);
      searchResults = campaigns;

      return { searchResults };

    default:
      return { searchResults };
  }
};
