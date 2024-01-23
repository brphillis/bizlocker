import { json } from "@remix-run/node";
import { validateForm } from "~/utility/validate";
import { PageNotification } from "~/hooks/PageNotification";
import { getDepartments } from "~/models/Departments/index.server";
import { DepartmentWithDetails } from "~/models/Departments/types";
import { ArticleCategoryWithDetails } from "~/models/ArticleCategories/types";
import {
  NewProductCategory,
  ProductCategoryWithDetails,
} from "~/models/ProductCategories/types";
import { getArticleCategories } from "~/models/ArticleCategories/index.server";
import { ProductSubCategoryWithDetails } from "~/models/ProductSubCategories/types";
import { getProductSubCategories } from "~/models/ProductSubCategories/index.server";
import {
  getProductCategory,
  upsertProductCategory,
} from "~/models/ProductCategories/index.server";

const validateOptions = {
  name: true,
  department: true,
  index: true,
};

export const productCategoryUpsertLoader = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("contentId");

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

export const productCategoryUpsertAction = async (request: Request) => {
  let notification: PageNotification;

  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  const id = contentId === "add" || !contentId ? undefined : contentId;

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
    case "upsert": {
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
  }
};
