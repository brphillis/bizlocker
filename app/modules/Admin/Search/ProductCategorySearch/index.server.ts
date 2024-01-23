import { getDepartments } from "~/models/Departments/index.server";
import { getProductSubCategories } from "~/models/ProductSubCategories/index.server";
import { json } from "@remix-run/node";
import { searchProductCategories } from "~/models/ProductCategories/index.server";

export const productCategorySearchLoader = async (request: Request) => {
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
