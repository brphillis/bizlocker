export type AliExpressHubSearch_Params = {
  q: string;
  page: string;
  sort?: "salesDesc" | "priceAsc" | "priceDesc" | "latest";
  catId?: string;
  brandId?: string;
  loc?: string;
  attr?: string;
  startPrice?: string;
  endPrice?: string;
  locale?: string;
  region?: string;
  currency?: string;
};

export type AliExpress_Product = {
  name: string;
  images: string[];
  dropshipURL: string;
  dropshipSKU: string;
  isActive: boolean;
  gender: string;
  sales: number;
};

export type AliExpress_ProductVariant = {
  price: number;
  color?: string;
  size?: string;
  quantity: number;
  sku: string;
};

export type AliExpressHubSearch_Response = {
  result: {
    resultList: AliExpressHubSearch_Result[];
  };
};

export type AliExpressHubSearch_Result = {
  item: AliExpressHubSearch_ResultItem;
  delivery: AliExpressHubSearch_ResultDelivery;
};

export type AliExpressHubSearch_ResultItem = {
  itemId: number;
  title: string;
  sales: number;
  image: string;
  price: AliExpressHubSearch_ResultPrice;
  delivery: AliExpressHubSearch_ResultDelivery;
  sku: object; //TODO
};

export type AliExpressHubSearch_ResultDelivery = {
  freeShipping: boolean;
  shippingDisplay: string;
  shippingFee: number;
};

export type AliExpressHubSearch_ResultPrice = {
  pc: number;
  app: number;
};

export type AliExpressHubGetProduct_Result = {
  item: AliExpressHubProduct_ResultItem;
  delivery: AliExpressHubGetProduct_ResultDelivery;
};

export type AliExpressHubGetProduct_ResultDelivery = {
  shippingFrom: string;
  shippingFromCode: string;
  shippingTo: string;
  shippingOutDays: number;
  shippingList: AliExpressHubGetProduct_ResultDelivery_ShippingListItem[];
  packageDetail: AliExpressHubGetProduct_ResultDelivery_PackageDetails;
};

export type AliExpressHubGetProduct_ResultDelivery_ShippingListItem = {
  shippingFrom: string;
  shippingFromCode: string;
  shippingTo: string;
  shippingToCode: string;
  shippingFee: string;
  shippingCompany: string;
  shippingTime: string;
  serviceName: string;
  estimateDelivery: string;
  estimateDeliveryDate: string;
  trackingAvailable: boolean;
  note: string[];
};

export type AliExpressHubGetProduct_ResultDelivery_PackageDetails = {
  weight: number;
  length: number;
  height: number;
  width: number;
};

export type AliExpressHubProduct_ResultItem = {
  available: boolean;
  itemId: string;
  title: string;
  catId: number;
  sales: number;
  wishCount: number;
  itemUrl: string;
  images: string[];
  video: AliExpressHubProductItem_Video;
  properties: AliExpressHubProductItem_Properties;
  description: object; //TODO
  sku: AliExpressHubProduct_ResultItem_Sku;
};

export type AliExpressHubProduct_ResultItem_Sku = {
  props: AliExpressHubProduct_ResultItem_Sku_Prop[];
  base: AliExpressHubProduct_ResultItem_Sku_Base[];
};

export type AliExpressHubProduct_ResultItem_Sku_Base = {
  skuId: string;
  propMap: string;
  price: number;
  promotionPrice: number;
  quantity: number;
};

export type AliExpressHubProduct_ResultItem_Sku_Prop = {
  pid: number;
  name: "Size" | "Color";
  values: AliExpressHubProduct_ResultItem_Sku_Prop_Value[];
};

export type AliExpressHubProduct_ResultItem_Sku_Prop_Value = {
  vid: number;
  name: string;
  propTips: string;
};

export type AliExpressHubProductItem_Video = {
  id: number;
  thumbnail: string;
  url: string;
};

export type AliExpressHubProductItem_Properties = {
  cut: string;
  list: AliExpressHubProductItem_Properties_ListItem[];
};

export type AliExpressHubProductItem_Properties_ListItem = {
  name: string;
  value: string;
};
