import { json } from "@remix-run/node";
import type { Image } from "@prisma/client";
import { getProductCategories } from "~/models/productCategories.server";
import {
  deleteProductSubCategory,
  getProductSubCategory,
  type NewProductSubCategory,
  type ProductSubCategoryWithDetails,
  upsertProductSubCategory,
} from "~/models/productSubCategories.server";
import type { Params } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import type { PageNotification } from "~/hooks/PageNotification";

const validateOptions = {
  name: true,
  index: true,
};

export const productSubCategoryUpsertLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const productCategories = await getProductCategories();

  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Sub Category Not Found",
    });
  }

  const productSubCategory =
    id === "add"
      ? ({} as ProductSubCategoryWithDetails)
      : await getProductSubCategory(id);

  if (!productSubCategory) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Sub Category Not Found",
    });
  }

  return json({ productSubCategory, productCategories });
};

export const productSubCategoryUpsertAction = async (
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

  const { name, productCategory, index, displayInNavigation, isActive, image } =
    formEntries;

  switch (formEntries._action) {
    case "upsert":
      if (formErrors) {
        return { serverValidationErrors: formErrors };
      }

      const parsedImage = image
        ? (JSON.parse(image?.toString()) as Image)
        : undefined;

      const categoryData: NewProductSubCategory = {
        name: name as string,
        image: parsedImage,
        productCategory: productCategory as string,
        index: parseInt(index as string),
        displayInNavigation: displayInNavigation ? true : false,
        isActive: isActive ? true : false,
        id: id,
      };

      await upsertProductSubCategory(categoryData);

      notification = {
        type: "success",
        message: `Category ${id === "add" ? "Added" : "Updated"}.`,
      };

      return json({ success: true, notification });

    case "delete":
      await deleteProductSubCategory(id as string);

      notification = {
        type: "warning",
        message: "Category Deleted",
      };

      return json({ success: true, notification });
  }
};
