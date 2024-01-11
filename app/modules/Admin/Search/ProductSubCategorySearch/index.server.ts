import type { Params } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { getProductCategories } from "~/models/productCategories.server";
import { searchProductSubCategories } from "~/models/productSubCategories.server";

export const productSubCategorySearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const { productSubCategories, totalPages } = await searchProductSubCategories(
    undefined,
    url,
  );

  const productCategories = await getProductCategories();

  return json({ productSubCategories, productCategories, totalPages });
};
