/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

interface Route {
  id: string;
  title: string;
  path: string;
  errorElement?: ReactElement;
  element?: ReactElement;
  children?: Route[];
  loader?: LoaderFunction;
  action?: ActionFunction;
  icon?: IconType;
}

type Image = {
  url: string;
  altText?: string;
};

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

type Order = {
  orderId: string;
  status: OrderStatus;
  totalPrice: number;
  paymentUrl: string;
  paymentLinkId: string;
  items: OrderItem[];
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
};

type OrderStatus = "created" | "cancelled" | "paid" | "shipped" | "complete";

type OrderItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  variant: ProductVariant;
  variantId: number;
  order: Order;
  orderId: string;
};

type Cart = {
  id?: number;
  user?: User;
  userId?: number;
  cartItems: CartItem[];
};

type CartItem = {
  id: number;
  quantity: number;
  cart: Cart;
  cartid: number;
  variant: ProductVariant;
  variantid: number;
};

type Department = {
  id: number;
  name: string;
  rootCategories: RootCategory[];
};

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
  content: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
  categories: ArticleCategory[];
  images: Image[];
};

type ArticleCategory = {
  id: number;
  name: string;
  articles?: Article[];
  rootCategory?: RootCategory | null;
};

type ProductVariant = {
  id?: number;
  name: string;
  sku: string;
  price: number;
  salePrice: number;
  isOnSale: boolean;
  stock?: number;
  product: Product;
  color?: Color;
  size?: Size;
  orders?: Order[];
  isActive: boolean;
};

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
};

type Product = {
  id: number;
  name: string;
  description: string;
  images: Image[];
  createdAt: Date;
  updatedAt: Date;
  categories: ProductCategory[];
  brand?: Brand | null;
  variants: ProductVariant[];
  totalSold?: number;
  isActive?: boolean;
  gender?: Gender | null;
};

type ProductCategory = {
  id: number;
  name: string;
  products: Product[];
  image?: Image;
  imageId?: number;
  rootCategory?: RootCategory | null;
};

type Brand = {
  id?: number;
  name: string;
  products?: Product[];
  image?: Image;
  imageId?: number;
};

type BasicSearchArgs = {
  id?: string;
  title?: string;
  name?: string;
  productcategoryname?: string;
  articlecategoryname?: string;
  brand?: string;
  rootCategory?: string;
  category?: string;
  page: number;
  perPage: number;
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

//   interface Address {
//     address_line_1: string;
//     address_line_2?: string;
//     administrative_district_level_1?: string;
//     administrative_district_level_2?: string;
//     administrative_district_level_3?: string;
//     country: string;
//     first_name?: string;
//     last_name?: string;
//     locality: string;
//     postal_code: string;
//     sublocality?: string;
//     sublocality_level_1?: string;
//     sublocality_level_2?: string;
//     sublocality_level_3?: string;
//   }

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
