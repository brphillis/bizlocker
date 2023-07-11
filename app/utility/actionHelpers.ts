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
