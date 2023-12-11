/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />
/// <reference types="@prisma/client" />

type Role = "DEVELOPER" | "ADMIN" | "MANAGER" | "STAFF" | "EDITOR" | "USER";

type SortBy = "createdAt" | "totalSold" | "price" | "name" | "title";

type SortOrder = "asc" | "desc";

type OrderStatus = "created" | "cancelled" | "paid" | "shipped" | "complete";

type ApprovalStatus =
  | "created"
  | "cancelled"
  | "approved"
  | "processing"
  | "complete";

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

type NavigationRouteItem = {
  name: string;
  icon?: string;
  link?: string;
  children?: NavigationRouteItem[];
};

type SelectValue = {
  id: string | number;
  name: string;
};

type TransformToOptionalBooleans<T> = {
  [K in keyof T]?: boolean;
};

type BackgroundPatternName = "wavy" | "isometric";

interface LocalImage {
  altText: string;
  href: string;
}

type ContentSelection = {
  type: BlockContentType;
  name: string;
  contentId: number | string;
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
