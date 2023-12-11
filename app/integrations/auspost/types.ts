export type GetPostageServicesType = {
  from_postcode: string;
  to_postcode: string;
  length: number;
  width: number;
  height: number;
  weight: number;
};

export type CalculateDeliveryPriceType = {
  from_postcode: string;
  to_postcode: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  service_code: string;
};

export type AusPostDeliveryOption = {
  code: string;
  name: string;
  price: string;
  max_extra_cover: number;
  options: AusPostDeliveryOptionsOption;
};

export type AusPostDeliveryOptionsOption = {
  code: string;
  name: string;
  suboptions: AusPostDeliveryOptionsSubOption;
};

export type AusPostDeliveryOptionsSubOption = {
  option: AusPostDeliveryOption;
};
