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

type ValidationErrors = {
  name?: string;
  contentSelection?: string;
};

type VerifyTypes = "email" | "password";

type SelectValue = {
  id: string;
  name: string;
};

type ContentSelection = {
  type: BlockContentType;
  name: string;
  contentId: number | string;
};

interface Image {
  id?: number;
  url: string;
  altText?: string;
  user?: User;
  userId?: string;
  article?: Article;
  articleId?: number;
  product?: Product;
  productId?: number;
  productSubCategory?: ProductSubCategory;
  productSubCategoryId?: number;
  brand?: Brand;
  brandId?: number;
  campaignTile?: Campaign;
  campaignBanner?: Campaign;
  promotionTile?: Promotion;
  promotionBanner?: Promotion;
  createdAt?: DateTime;
  updatedAt?: DateTime;
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

interface Address extends NewAddress {
  id?: string;
  userId?: string;
  user?: User;
}

type NewAddress = {
  addressLine1?: string;
  addressLine2?: string;
  postcode?: string;
  suburb?: string;
  state?: string;
  country?: string;
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
  index: number;
  displayInNavigation: boolean;
  isActive: boolean;
  productCategories: ProductCategory[];
  campaigns: Campaign[];
  promotions: Promotion[];
}

type ProductCategory = {
  id: number;
  name: string;
  department: Department;
  departmentId: number;
  articleCategories?: ArticleCategory[];
  productSubCategories?: ProductSubCategory[];
  index: number;
  displayInNavigation: boolean;
  isActive: boolean;
};

interface ProductSubCategory {
  id: number;
  name: string;
  productCategory?: ProductCategory;
  productCategoryId?: number;
  productSubCategory?: ProductCategory;
  productSubCategoryId?: number;
  products: Product[];
  productBlockContent: ProductBlockContent[];
  image?: Image;
  imageId?: number;
  campaigns: Campaign[];
  index: number;
  displayInNavigation: boolean;
  isActive: boolean;
}

interface Article {
  id: number;
  title: string;
  description: string;
  backgroundColor: string;
  blocks: Block[];
  thumbnail?: Image;
  isActive?: boolean;
  articleCategories: ArticleCategory[];
  createdAt: Date;
  updatedAt: Date;
}

interface ArticleCategory {
  id: number;
  name: string;
  articles?: Article[];
  productCategory?: ProductCategory | null;
}

interface Product {
  id: number;
  name: string;
  description: string;
  images: Image[];
  heroImage?: Image;
  heroImageId?: number;
  productSubCategories: ProductSubCategory[];
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
  productSubCategories: ProductSubCategory[];
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
type PageType = "homePage" | "article" | "webPage";
type BlockName = "banner" | "hero" | "tile" | "text" | "product" | "article";
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
  | "gender";

type BackgroundPatternName = "wavy" | "isometric";

interface HomePage {
  id: number;
  title: string;
  description: string;
  backgroundColor: string;
  blocks: Block[];
  createdAt: Date;
  updatedAt: Date;
}

interface WebPage {
  id: number;
  title: string;
  description: string;
  backgroundColor: string;
  blocks: Block[];
  thumbnail?: Image;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface NewBlockData {
  pageId: number;
  blockName: BlockName;
  itemIndex: number;
  contentType: BlockContentType;
  contentData: ContentData;
}

type BlockContent = {
  richText?: string;
  productCategory?: ProductCategory[] | ProductCategory;
  productSubCategory?: ProductSubCategory[] | ProductSubCategory;
  articleCategory?: ArticleCategory[] | ArticleCategory;
  gender?: Gender[] | Gender;
  brand?: Brand[] | Brand;
  promotion?: Promotion[] | Promotion;
  campaign?: Campaign[] | Campaign;
  image?: Image[] | Image;
  product?: Product[] | Product;
  article?: Article[] | Article;
};

type BlockMaster = {
  name: BlockName;
  component: React.ComponentType<any>;
  options: BlockMasterOptions;
  content: Object;
  contentRequired?: boolean;
  hasMultipleContent?: boolean;
  maxContentItems?: number;
};

interface BlockMasterOptions {
  autoplay?: boolean;
  backgroundColor?: boolean;
  backgroundBrightness?: boolean;
  backgroundBrightnessTwo?: boolean;
  backgroundPatternName?: boolean;
  backgroundPatternColor?: boolean;
  backgroundPatternOpacity?: boolean;
  backgroundPatternSize?: boolean;
  backgroundPatternNameTwo?: boolean;
  backgroundPatternColorTwo?: boolean;
  backgroundPatternOpacityTwo?: boolean;
  backgroundPatternSizeTwo?: boolean;
  backgroundWidth?: boolean;
  backgroundColorTwo?: boolean;
  backgroundWidthTwo?: boolean;
  borderColor?: boolean;
  borderDisplay?: boolean;
  borderRadius?: boolean;
  borderSize?: boolean;
  columns?: boolean;
  columnsMobile?: boolean;
  count?: boolean;
  flipX?: boolean;
  margin?: boolean;
  linkOne?: boolean;
  linkTwo?: boolean;
  linkThree?: boolean;
  linkFour?: boolean;
  linkFive?: boolean;
  linkSix?: boolean;
  colorOne?: boolean;
  colorTwo?: boolean;
  colorThree?: boolean;
  colorFour?: boolean;
  colorFive?: boolean;
  colorSix?: boolean;
  filterOne?: boolean;
  filterTwo?: boolean;
  filterThree?: boolean;
  filterFour?: booolean;
  filterFive?: booolean;
  filterSix?: boolean;
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

interface Block extends BannerBlock, TileBlock, TextBlock, ProductBlock {
  id: string;
  order: number;
  page: Page;
  pageId: number;
  content: BlockContent;
  name: BlockName;
  blockOptions: BlockOptions[];
}

interface BlockOptions {
  id: string;
  autoplay?: string | null;
  backgroundColor?: Color | null;
  backgroundWidth?: string | null;
  backgroundBrightness?: number | null;
  backgroundBrightnessTwo?: number | null;
  backgroundPatternName?: string | null;
  backgroundPatternColor?: string | null;
  backgroundPatternOpacity?: number | null;
  backgroundPatternSize?: number | null;
  backgroundPatternNameTwo?: string | null;
  backgroundPatternColorTwo?: string | null;
  backgroundPatternOpacityTwo?: number | null;
  backgroundPatternSizeTwo?: number | null;
  backgroundColorTwo?: Color | null;
  backgroundWidthTwo?: string | null;
  borderColor?: Color | null;
  borderDisplay?: string | null;
  borderRadius?: string | null;
  borderSize?: string | null;
  colorOne?: string | null;
  colorTwo?: string | null;
  colorThree?: string | null;
  colorFour?: string | null;
  colorFive?: string | null;
  colorSix?: string | null;
  columns?: number | null;
  columnsMobile?: number | null;
  count?: number | null;
  flipX?: string | null;
  padding?: string | null;
  margin?: string | null;
  linkOne?: string | null;
  linkTwo?: string | null;
  linkThree?: string | null;
  linkFour?: string | null;
  linkFive?: string | null;
  linkSix?: string | null;
  filterOne?: string | null;
  filterTwo?: string | null;
  filterThree?: string | null;
  filterFour?: string | null;
  filterFive?: string | null;
  filterSix?: string | null;
  rows?: number | null;
  shortText?: string | null;
  shortTextColor?: Color | null;
  size?: "small" | "medium" | "large" | "native";
  sizeMobile?: "small" | "medium" | "large" | "native";
  sortBy?: SortBy | null;
  sortOrder?: SortOrder | null;
  speed?: string | null;
  style?: string | null;
  title?: string | null;
  titleColor?: Color | null;
  order?: int | null;
}

interface HeroBlock {
  id: string;
  name: string;
  type: string;
  block?: Block;
  product?: Product;
  productId?: string;
  image?: Image;
  imageId?: number;
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
  image?: Image;
  imageId?: number;
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
  image?: Image[];
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

type ConcatenatedBlockContent = Array<Promotion | Campaign | Brand | Image>;

interface ProductBlockContent {
  id: string;
  productBlock?: ProductBlock;
  productBlockId?: string;
  productCategory?: ProductCategory;
  productCategoryId?: number;
  productSubCategory?: ProductSubCategory;
  productSubCategoryId?: number;
  brand?: Brand;
  brandId?: number;
  gender?: Gender;

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

interface TextBlockContent {
  id: string;
  richText: string;
  createdAt: Date;
  updatedAt: Date;
}

type NewProductBlockContent = {
  productCategory?: string;
  productSubCategory?: string;
  brand?: string;
  gender?: Gender;
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
