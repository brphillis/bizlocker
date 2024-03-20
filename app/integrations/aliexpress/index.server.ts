import {
  AliExpressHubGetProduct_Result,
  AliExpressHubSearch_Params,
  AliExpressHubSearch_Result,
} from "./types";

const aliExpressDataHubKey =
  "efad72c391mshdc6cb48cdfc23ffp1afb6ejsnec2848cb122c";

const aliExpressDataHubHost = "aliexpress-datahub.p.rapidapi.com";

const headers = {
  "X-RapidAPI-Key": aliExpressDataHubKey,
  "X-RapidAPI-Host": aliExpressDataHubHost,
};

export const searchAliExpressDataHub_Product = async (
  aliExpressSearchParams: AliExpressHubSearch_Params,
): Promise<AliExpressHubSearch_Result[]> => {
  const url = "https://aliexpress-datahub.p.rapidapi.com/item_search";

  const queryParams = new URLSearchParams(aliExpressSearchParams);

  const fullUrl = `${url}?${queryParams}`;

  const response = await fetch(fullUrl, { headers });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();

  return data.result.resultList;
};

export const getAliExpressDataHub_Product = async (
  itemId: string,
): Promise<AliExpressHubGetProduct_Result> => {
  const url = "https://aliexpress-datahub.p.rapidapi.com/item_detail_3";

  const queryParams = new URLSearchParams({
    itemId,
    currency: "AUD",
  });

  const fullUrl = `${url}?${queryParams}`;

  const response = await fetch(fullUrl, { headers });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();

  const images = data.result.item.images;

  const base64Images = await Promise.all(
    images.map(downloadAndConvertToBase64),
  );

  data.result.item.images = base64Images;

  return data.result;
};

const downloadAndConvertToBase64 = async (
  imageUrl: string,
): Promise<string | null> => {
  const response = await fetch("https:" + imageUrl);

  if (!response.ok) {
    throw new Error(
      `Error downloading resource: ${response.status} - ${response.statusText}`,
    );
  }

  const contentType = response.headers.get("Content-Type");

  // Check if the content type is a video
  if (contentType && contentType.startsWith("video/")) {
    // Skip if the content type is a video
    console.warn(`Skipping video content type: ${contentType}`);
    return null;
  }

  // Check if the content type is present and starts with "image/"
  if (contentType && contentType.startsWith("image/")) {
    const buffer = await response.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");

    // Use the correct content type based on the original resource
    return `data:${contentType};base64,${base64Data}`;
  } else {
    // Skip if the content type is not supported (neither image nor video)
    console.warn(`Unsupported content type: ${contentType}`);
    return null;
  }
};
