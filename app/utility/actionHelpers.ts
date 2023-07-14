import { searchProducts } from "~/models/products.server";

export const productSearchFormData = async (form?: {
  [k: string]: FormDataEntryValue;
}) => {
  const {
    name,
    rootCategory,
    productCategory,
    brand,
    sortBy,
    sortOrder,
    perPage,
    pageNumber,
  } = form || {};

  const searchQuery = {
    name: name as string,
    rootCategory: rootCategory as string,
    category: productCategory as string,
    brand: brand as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as string,
    page: (pageNumber && parseInt(pageNumber as string)) || 1,
    perPage: (perPage && parseInt(perPage as string)) || 10,
  };
  const { products, totalPages } = await searchProducts(searchQuery);

  return { products, totalPages };
};

export const productSearchParams = async (url: URL) => {
  const searchQuery = {
    name: url.searchParams.get("name")?.toString() as string,
    rootCategory: url.searchParams.get("rootCategory") as string,
    category: url.searchParams.get("productCategory") as string,
    brand: url.searchParams.get("brand") as string,
    sortBy: url.searchParams.get("sortBy") as SortBy,
    sortOrder: url.searchParams.get("sortOrder") as SortOrder,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("itemsPerPage")) || 10,
  };

  const { products, totalPages } = await searchProducts(searchQuery);

  return { products, totalPages };
};
