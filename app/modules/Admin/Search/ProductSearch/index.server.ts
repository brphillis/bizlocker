import { getBrands } from "~/models/Brands/index.server";
import { getProductSubCategories } from "~/models/ProductSubCategories/index.server";
import { json } from "@remix-run/node";
import { searchProducts } from "~/models/Products/index.server";

export const productSearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const { products, totalPages, count } = await searchProducts(undefined, url);
  const brands = await getBrands();
  const productSubCategories = await getProductSubCategories();

  return json({
    brands,
    count,
    products,
    productSubCategories,
    totalPages,
  });
};
