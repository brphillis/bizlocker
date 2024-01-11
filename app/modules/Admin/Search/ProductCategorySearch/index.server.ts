import { getDepartments } from "~/models/departments.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { searchProductCategories } from "~/models/productCategories.server";

export const productCategorySearchLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);

  const { productCategories, totalPages } = await searchProductCategories(
    undefined,
    url,
  );
  const departments = await getDepartments();
  const productSubCategories = await getProductSubCategories();

  return json({
    productCategories,
    totalPages,
    departments,
    productSubCategories,
  });
};
