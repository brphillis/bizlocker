/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />

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

type ContentSelection = {
  type: BlockContentType;
  name: string;
  contentId: number | string;
};

type BackgroundPatternName = "wavy" | "isometric";

interface LocalImage {
  altText: string;
  href: string;
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

type TransformToOptionalBooleans<T> = {
  [K in keyof T]?: boolean;
};

type MetaType = {
  title: string;
  name: string;
  content: string;
  description: string;
  product: {
    name: string;
  };
  promotion: {
    name: string;
    metaDescription: string;
  };
};

interface CatchError {
  message: string;
  code: string;
}

interface HttpError {
  status: string;
  statusText: string;
}
