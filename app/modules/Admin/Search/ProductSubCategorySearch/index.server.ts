import { json } from "@remix-run/server-runtime";
import { getProductCategories } from "~/models/ProductCategories/index.server";
import { searchProductSubCategories } from "~/models/ProductSubCategories/index.server";

export const productSubCategorySearchLoader = async (request: Request) => {
  const url = new URL(request.url);

  const { productSubCategories, totalPages } = await searchProductSubCategories(
    undefined,
    url,
  );

  const productCategories = await getProductCategories();

  return json({ productSubCategories, productCategories, totalPages });
};
