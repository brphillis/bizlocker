import type { Params } from "@remix-run/react";
import { getBrands } from "~/models/brands.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import { json } from "@remix-run/node";
import { searchProducts } from "~/models/products.server";

export const productSearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const { products, totalPages } = await searchProducts(undefined, url);
  const brands = await getBrands();
  const productSubCategories = await getProductSubCategories();

  return json({
    products,
    brands,
    productSubCategories,
    totalPages,
  });
};
