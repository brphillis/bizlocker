import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import type { PageNotification } from "~/hooks/PageNotification";
import {
  getDepartments,
  type DepartmentWithDetails,
} from "~/models/departments.server";
import {
  getArticleCategories,
  type ArticleCategoryWithDetails,
} from "~/models/articleCategories.server";
import {
  getProductSubCategories,
  type ProductSubCategoryWithDetails,
} from "~/models/productSubCategories.server";
import {
  getProductCategory,
  type NewProductCategory,
  type ProductCategoryWithDetails,
  upsertProductCategory,
} from "~/models/productCategories.server";

const validateOptions = {
  name: true,
  department: true,
  index: true,
};

export const productCategoryUpsertLoader = async (
  request: Request,
  params: Params<string>,
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  const departments = await getDepartments();
  const productSubCategories = await getProductSubCategories();
  const articleCategories = await getArticleCategories();

  if (id === "add") {
    const productCategory = {};
    return json({ productCategory } as {
      productCategory: ProductCategoryWithDetails;
      departments: DepartmentWithDetails[];
      productSubCategories: ProductSubCategoryWithDetails[];
      articleCategories: ArticleCategoryWithDetails[];
    });
  }

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Category Not Found",
    });
  }

  const productCategory = await getProductCategory(id);

  return json({
    productCategory,
    departments,
    productSubCategories,
    articleCategories,
  });
};

export const productCategoryUpsertAction = async (
  request: Request,
  params: Params<string>,
) => {
  let notification: PageNotification;

  let { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  let id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const {
    name,
    index,
    department,
    displayInNavigation,
    isActive,
    articleCategories,
    productSubCategories,
  } = formEntries;

  switch (formEntries._action) {
    case "upsert":
      if (formErrors) {
        return json({ serverValidationErrors: formErrors });
      }

      const categoryData: NewProductCategory = {
        name: name as string,
        index: parseInt(index as string),
        department: department as string,
        displayInNavigation: displayInNavigation ? true : false,
        isActive: isActive ? true : false,
        productSubCategories:
          productSubCategories && JSON.parse(productSubCategories as string),
        articleCategories:
          articleCategories && JSON.parse(articleCategories as string),
        id: id,
      };

      await upsertProductCategory(categoryData);

      notification = {
        type: "success",
        message: `Category ${id === "add" ? "Added" : "Updated"}.`,
      };

      return json({ success: true, notification });
  }
};
