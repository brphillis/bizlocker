import type {
  AusPostDeliveryOption,
  CalculateDeliveryPriceType,
  GetPostageServicesType,
} from "./types";

const baseURL = "https://digitalapi.auspost.com.au";

const apiKey = process.env.AUSPOST_ACCESS!;

export const getAusPostServices = async ({
  from_postcode,
  to_postcode,
  length,
  width,
  height,
  weight,
}: GetPostageServicesType): Promise<AusPostDeliveryOption[]> => {
  const queryParams = new URLSearchParams({
    from_postcode,
    to_postcode,
    length: length.toString(),
    width: width.toString(),
    height: height.toString(),
    weight: weight.toString(),
  });

  const postageTypesURL = `${baseURL}/postage/parcel/domestic/service.json?${queryParams.toString()}`;

  const response = await fetch(postageTypesURL, {
    headers: {
      "AUTH-KEY": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  const serviceTypesJSON = await response.json();
  // @ts-expect-error:nested JSON obj dissection
  return (serviceTypesJSON as unknown).services
    .service as AusPostDeliveryOption[];
};

export const calculateDeliveryPrice = async ({
  from_postcode,
  to_postcode,
  length,
  width,
  height,
  weight,
  service_code,
}: CalculateDeliveryPriceType) => {
  const queryParams = new URLSearchParams({
    from_postcode,
    to_postcode,
    length: length.toString(),
    width: width.toString(),
    height: height.toString(),
    weight: weight.toString(),
    service_code,
  });

  const calculateRateURL = `${baseURL}/postage/parcel/domestic/calculate.json?${queryParams.toString()}`;

  const response = await fetch(calculateRateURL, {
    headers: {
      "AUTH-KEY": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  const priceJSON = await response.json();
  return priceJSON;
};
