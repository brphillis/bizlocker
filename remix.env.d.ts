/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

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

interface Verifier {
  id: number;
  email: string;
  type: VerifyTypes;
  code: string | null;
  expiration: DateTime;
  createdAt: DateTime;
  updatedAt: DateTime | null;
}

type VerifyTypes = "email" | "password";

interface Image {
  id: number;
  url: string;
  altText?: string;
  user?: User;
  userId?: string;
  article?: Article;
  articleId?: number;
  product?: Product;
  productId?: number;
  productCategory?: ProductCategory;
  productCategoryId?: number;
  brand?: Brand;
  brandId?: number;
  campaignTile?: Campaign;
  campaignBanner?: Campaign;
  promotionTile?: Promotion;
  promotionBanner?: Promotion;
  createdAt: Date;
  updatedAt: Date;
}

type LoginData = {
  username: string;
  password: string;
};

type User = {
  id: string;
  email: string;
  password?: string | null;
  avatar?: Image | null;
  cart?: Cart;
  cartId?: number;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  userDetails?: UserDetails;
  address?: Address;
  doubleAuthentication: boolean;
  isActive: boolean;
};

type UserDetails = {
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  dateOfBirth?: Date | null;
  gender?: Gender | null;
  user?: User;
  userId?: string;
};

type Address = {
  id: string;
  addressLine1?: string;
  addressLine2?: string;
  postcode?: string;
  suburb?: string;
  state?: string;
  country?: string;
  userId?: string;
  user?: User;
};

type CountrySelect = {
  code: string;
  name: string;
};

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

interface Order {
  orderId: string;
  status: OrderStatus;
  totalPrice: number;
  paymentCode: string;
  paymentUrl: string;
  paymentLinkId: string;
  items: OrderItem[];
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

type OrderStatus = "created" | "cancelled" | "paid" | "shipped" | "complete";

interface OrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  variant: ProductVariant;
  variantId: number;
  order: Order;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
}

type NewOrderItem = {
  id?: number;
  quantity: number;
  unitPrice: number;
  variant?: ProductVariant;
  variantId: number;
  order?: Order;
  orderId?: string;
};

interface Cart {
  id: number;
  user: User;
  userId: string;
  cartItems: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface CartItem {
  id: number;
  quantity: number;
  cart: Cart;
  cartId: number;
  variant: ProductVariant;
  variantId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Department {
  id: number;
  name: string;
  rootCategories: RootCategory[];
  campaigns: Campaign[];
  promotions: Promotion[];
}

type RootCategory = {
  id: number;
  name: string;
  department: Department;
  articleCategories?: ArticleCategory[];
  productCategories?: ProductCategory[];
};

type Article = {
  id: number;
  title: string;
  blocks: Block[];
  thumbnail?: Image;
  isActive?: boolean;
  articleCategories: ArticleCategory[];
  createdAt: Date;
  updatedAt: Date;
};

type ArticleCategory = {
  id: number;
  name: string;
  articles?: Article[];
  rootCategory?: RootCategory | null;
};

interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  isOnSale: boolean;
  stock?: number;
  productId: number;
  product: Product;
  color?: Color;
  size?: Size;
  totalSold: number;
  cartItems: CartItem[];
  orderItems: OrderItem[];
  orderId?: string;
  isActive: boolean;
  isPromoted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type NewProductVariant = {
  id?: number;
  name?: string;
  sku?: string;
  price?: number;
  salePrice?: number;
  isOnSale?: boolean;
  stock?: number;
  product?: Product;
  color?: Color;
  size?: Size;
  orders?: Order[];
  isActive?: boolean;
  isPromoted?: boolean;
};

interface Product {
  id: number;
  name: string;
  description: string;
  images: Image[];
  productCategories: ProductCategory[];
  brand?: Brand;
  brandId?: number;
  variants: ProductVariant[];
  discountPercentageHigh: number;
  discountPercentageLow: number;
  totalSold: number;
  isActive: boolean;
  gender?: Gender;
  campaigns: Campaign[];
  promotion?: Promotion;
  promotionId?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCategory {
  id: number;
  name: string;
  rootCategory?: RootCategory;
  rootCategoryId?: number;
  products: Product[];
  productBlockContent: ProductBlockContent[];
  image?: Image;
  imageId?: number;
  campaigns: Campaign[];
}

interface Brand {
  id: number;
  name: string;
  products: Product[];
  productBlockContent: ProductBlockContent[];
  image?: Image;
  imageId?: number;
  campaigns: Campaign[];
  createdAt: Date;
  updatedAt: Date;
}

interface Promotion {
  id: number;
  name: string;
  products: Product[];
  discountPercentage: number;
  targetGender?: Gender;
  isActive: boolean;
  tileImage: Image;
  tileImageId: number;
  bannerImage: Image;
  bannerImageId: number;
  department: Department;
  departmentId: number;
  bannerBlocks: BannerBlock[];
  tileBlocks: TileBlock[];
  createdAt: Date;
  updatedAt?: Date;
}

interface Campaign {
  id: number;
  name: string;
  excludedProducts: Product[];
  minSaleRange: number;
  maxSaleRange: number;
  targetGender?: Gender;
  isActive: boolean;
  tileImage: Image;
  tileImageId: number;
  bannerImage: Image;
  bannerImageId: number;
  department: Department;
  departmentId: number;
  productCategories: ProductCategory[];
  brands: Brand[];
  bannerBlocks: BannerBlock[];
  tileBlocks: TileBlock[];
  createdAt: Date;
  updatedAt?: Date;
}

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
  promotion?: string;
  rootCategory?: string;
  articleCategory?: string;
  productCategory?: string;
  category?: string;
  page: number;
  perPage: number;
  sortBy?: string;
  sortOrder?: string;
};

type SortBy = "createdAt" | "totalSold" | "price" | "name";
type SortOrder = "asc" | "desc";

type BlockName = "banner" | "tile" | "text" | "product" | "article";
type BlockContentType = "campaign" | "promotion";

interface HomePage {
  id: number;
  blocks: Block[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NewBlockData {
  blockName: BlockName;
  itemIndex: number;
  contentType?: BlockContentType;
  contentData?: Promotion[] | Campaign[];
  stringData?: string;
  objectData?: ProductBlockContent;
}

interface Block extends BannerBlock, TileBlock, TextBlock, ProductBlock {
  id: string;
  order: number;
  page: Page;
  pageId: number;
  content: Campaign[] | Promotion[] | string[] | ProductBlockContent[];
  blockOptions: BlockOptions;
  bannerBlock?: BannerBlock;
  bannerBlockId?: string;
  tileBlock?: TileBlock;
  tileBlockId?: string;
}

interface NewBlockOptions {
  columns?: number | null;
  rows?: number | null;
  count?: number | null;
  size: "small" | "medium" | "large";
  sortBy?: SortBy | null;
  sortOrder?: SortOrder | null;
}

interface BlockOptions extends NewBlockOptions {
  id: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  block?: Block | null;
  blockOptionsId: string;
}

interface BannerBlock {
  id: string;
  name: string;
  type: string;
  block?: Block;
  campaign?: Campaign;
  campaignId?: string;
  promotion?: Promotion;
  promotionId?: string;
}

interface TileBlock {
  id: string;
  name: string;
  type: string;
  block?: Block;
  campaign?: Campaign[];
  campaignId?: string;
  promotion: Promotion[];
  promotionId?: string;
}

interface TextBlock {
  id: string;
  name: string;
  block?: Block;
  content: string[];
}

interface ProductBlock {
  id: string;
  name: string;
  block?: Block;
  productBlockContent: ProductBlockContent;
  createdAt: DateTime;
  updatedAt: DateTime;
}

interface ProductBlockContent {
  id: string;
  productBlock?: ProductBlock;
  productBlockId?: string;
  rootCategory?: RootCategory;
  rootCategoryId?: number;
  productCategory?: ProductCategory;
  productCategoryId?: number;
  brand?: Brand;
  brandId?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ArticleBlockContent {
  id: string;
  articleBlock?: ArticleBlock;
  articleBlockId?: string;
  articleCategory?: ArticleCategory;
  articleCategoryId?: number;
  createdAt: Date;
  updatedAt: Date;
}

type NewProductBlockContent = {
  rootCategory?: string;
  productCategory?: string;
  brand?: string;
};

type NewArticleBlockContent = {
  articleCategory?: string;
};

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
