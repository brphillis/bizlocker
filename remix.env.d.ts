/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />
/// <reference types="@prisma/client" />

type NavigationRouteItem = {
  name: string;
  icon?: string;
  link?: string;
  children?: NavigationRouteItem[];
};

interface ActionReturnTypes {
  validationErrors: ValidationErrors;
  validationError: string;
  permissionError: string;
  notification: PageNotification;
  success: boolean;
  actionShippingOptions: AusPostDeliveryOption[];
  publishSuccess: boolean;
  updateSuccess: boolean;
  searchResults: any;
  metaValidationError: string[];
  actionPreview: PreviewPage;
  actionBlocks: Block[];
  user: User;
}

// 001 - BUILDER TYPES
type PageType = "homePage" | "article" | "webPage" | "previewPage";

type BlockName =
  | "tile"
  | "banner"
  | "map"
  | "text"
  | "product"
  | "article"
  | "hero";

type BlockContentType =
  | "campaign"
  | "promotion"
  | "image"
  | "product"
  | "productCategory"
  | "productSubCategory"
  | "brand"
  | "article"
  | "articleCategory"
  | "richText"
  | "gender"
  | "icon"
  | "store";

type BackgroundPatternName = "wavy" | "isometric";

interface LocalImage {
  altText: string;
  href: string;
}

interface NewBlockData {
  previewPageId: number;
  blockName: BlockName;
  itemIndex: number;
  contentBlockId: string;
  contentType: BlockContentType;
  contentData: ContentData;
}

type BlockMaster = {
  name: BlockName;
  component: React.ComponentType<any>;
  icon: string;
  options: BlockMasterOptions;
  content: Object;
  addOns?: string[];
  contentRequired?: boolean;
  hasMultipleContent?: boolean;
  maxContentItems?: number;
};

interface BlockMasterOptions {
  autoplay?: boolean;
  backgroundColor?: boolean;
  backgroundBrightness?: boolean;
  backgroundBrightnessSecondary?: boolean;
  backgroundPatternName?: boolean;
  backgroundPatternColor?: boolean;
  backgroundPatternOpacity?: boolean;
  backgroundPatternSize?: boolean;
  backgroundPatternNameSecondary?: boolean;
  backgroundPatternColorSecondary?: boolean;
  backgroundPatternOpacitySecondary?: boolean;
  backgroundPatternSizeSecondary?: boolean;
  backgroundWidth?: boolean;
  backgroundColorSecondary?: boolean;
  backgroundWidthSecondary?: boolean;
  borderColor?: boolean;
  borderDisplay?: boolean;
  borderRadius?: boolean;
  borderSize?: boolean;
  columns?: boolean;
  columnsMobile?: boolean;
  count?: boolean;
  flipX?: boolean;
  margin?: boolean;
  link1?: boolean;
  link2?: boolean;
  link3?: boolean;
  link4?: boolean;
  link5?: boolean;
  link6?: boolean;
  color1?: boolean;
  color2?: boolean;
  color3?: boolean;
  color4?: boolean;
  color5?: boolean;
  color6?: boolean;
  itemColor?: boolean;
  itemSecondaryColor?: boolean;
  titleAlign?: boolean;
  titleSize?: boolean;
  titleWeight?: boolean;
  itemBorderDisplay?: boolean;
  itemBorderSize?: boolean;
  itemBorderColor?: boolean;
  itemBorderRadius?: boolean;
  colorSecondary1?: boolean;
  colorSecondary2?: boolean;
  colorSecondary3?: boolean;
  colorSecondary4?: boolean;
  colorSecondary5?: boolean;
  colorSecondary6?: boolean;
  title1?: boolean;
  title2?: boolean;
  title3?: boolean;
  title4?: boolean;
  title5?: boolean;
  title6?: boolean;
  filter1?: boolean;
  filter2?: boolean;
  filter3?: boolean;
  filter4?: booolean;
  filter5?: booolean;
  filter6?: boolean;
  rows?: boolean;
  shortText?: boolean;
  shortTextColor?: boolean;
  size?: boolean;
  sizeMobile?: boolean;
  sortBy?: boolean;
  padding?: boolean;
  sortOrder?: boolean;
  speed?: boolean;
  style?: boolean;
  title?: boolean;
  titleColor?: boolean;
  order?: boolean;
}

type ContentSelection = {
  type: BlockContentType;
  name: string;
  contentId: number | string;
};

type ConcatenatedBlockContent = Array<Promotion | Campaign | Brand | Image>;

// 002 - POSTAGE TYPES
type GetPostageServicesType = {
  from_postcode: string;
  to_postcode: string;
  length: number;
  width: number;
  height: number;
  weight: number;
};

type CalculateDeliveryPriceType = {
  from_postcode: string;
  to_postcode: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  service_code: string;
};

type AusPostDeliveryOption = {
  code: string;
  name: string;
  price: string;
  max_extra_cover: number;
  options: AusPostDeliveryOptionsOption;
};

type AusPostDeliveryOptionsOption = {
  code: string;
  name: string;
  suboptions: AusPostDeliveryOptionsSubOption;
};

type AusPostDeliveryOptionsSubOption = {
  option: AusPostDeliveryOption;
};

type GoogleAuthResponse = {
  iss: string;
  nbf: number;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  azp: string;
  name: string;
  picture: string;
  given_name: string;
};

interface ValidationErrors {
  [key: string]: string;
}

interface FormConfig {
  [key: string]: {
    required: boolean;
    validator?: (value: string) => string | null;
  };
}

type VerifyTypes = "email" | "password";

type SelectValue = {
  id: string | number;
  name: string;
};

type NewAddress = {
  addressLine1?: string;
  addressLine2?: string;
  postcode?: string;
  suburb?: string;
  state?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
};

type CountrySelect = {
  code: string;
  name: string;
};

// 006 - ORDER TYPES

type SquareShippingDetails = {
  addressLine1?: string;
  addressLine2?: string;
  administrativeDistrictLevel1?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  locality?: string;
  postalCode?: string;
};

type Role = "DEVELOPER" | "ADMIN" | "MANAGER" | "STAFF" | "EDITOR" | "USER";
type OrderStatus = "created" | "cancelled" | "paid" | "shipped" | "complete";
type ApprovalStatus =
  | "created"
  | "cancelled"
  | "approved"
  | "processing"
  | "complete";

type NewOrderItem = {
  id?: number;
  quantity: number;
  unitPrice: number;
  variant?: ProductVariant;
  variantId: number;
  order?: Order;
  orderId?: string;
};

type CartDimensions = {
  height: number;
  width: number;
  length: number;
  weight: number;
  fragile: boolean;
};

// 006 - CATEGORY TYPES

type NewProductVariant = {
  id?: number;
  name?: string;
  sku?: string;
  price?: number;
  salePrice?: number;
  isOnSale?: boolean;
  isFragile?: boolean;
  stock?: number;
  product?: Product;
  color?: Color;
  size?: string;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  orders?: Order[];
  isActive?: boolean;
  isPromoted?: boolean;
};

// 009 - SEARCH TYPES
type BasicSearchArgs = {
  id?: string;
  title?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  productcategoryname?: string;
  articlecategoryname?: string;
  departmentName?: string;
  brand?: string;
  department?: string;
  promotion?: string;
  productCategory?: string;
  articleCategory?: string;
  productSubCategory?: string;
  category?: string;
  page: number;
  perPage: number;
  sortBy?: string;
  sortOrder?: string;
};

type SortBy = "createdAt" | "totalSold" | "price" | "name" | "title";
type SortOrder = "asc" | "desc";

// 010 SQUARE TYPES
interface Money {
  amount: number;
  currency: string;
}

interface CreatePaymentLinkRequest {
  idempotency_key: string;
  amount_money: Money;
  reference_id?: string;
  note?: string;
  line_items?: LineItem[];
  pickup_details?: PickupDetails;
  pre_populate_buyer_email?: string;
  pre_populate_shipping_address?: Address;
  redirect_url?: string;
  order_service_charge?: OrderServiceCharge;
  version_token?: string;
  location_id?: string;
  app_fee_money?: Money;
  autocomplete?: boolean;
  ask_for_shipping_address?: boolean;
  payee_email_address?: string;
  buyer_payment_instrument_ids?: string[];
  expiration_duration_minutes?: number;
}

interface LineItem {
  uid?: string;
  name: string;
  quantity: string;
  base_price_money: Money;
  variation_name?: string;
  note?: string;
  gross_sales_money?: Money;
  total_discount_money?: Money;
  total_tax_money?: Money;
  total_money?: Money;
}

interface PickupDetails {
  recipient: Recipient;
  expires_at?: string;
  schedule_type?: string;
  pickup_at?: string;
  pickup_window_duration_minutes?: number;
  prep_time_duration_minutes?: number;
  note?: string;
}

interface Recipient {
  customer_id?: string;
  display_name?: string;
  email_address?: string;
  phone_number?: string;
  curbside_details?: CurbsideDetails;
}

interface CurbsideDetails {
  curbside_details?: string;
  buyer_arrived_at?: string;
}

interface OrderServiceCharge {
  uid?: string;
  name: string;
  catalog_object_id?: string;
  percentage?: string;
  amount_money?: Money;
  applied_money?: Money;
  total_money?: Money;
  total_tax_money?: Money;
  calculation_phase?: string;
  taxable?: boolean;
  taxes?: OrderLineItemAppliedTax[];
  version?: number;
}

interface OrderLineItemAppliedTax {
  uid?: string;
  tax_uid?: string;
  applied_money?: Money;
  metadata?: Record<string, string>;
  version?: number;
}

interface MapFunctions {
  navigateToSpot: (
    latitude: number,
    longitude: number,
    newZoom: number
  ) => void;
}

type TotalStock = {
  totalStock: number;
  storeStock: StoreStock[];
};

type StoreStock = {
  total: number;
  storeName: string;
  storeId: number;
};

type ToastType = "success" | "error" | "warning" | "info" | "question";

type PageNotification = {
  message: string;
  type: ToastType;
};
