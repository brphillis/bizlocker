import { json } from "@remix-run/node";
import { Image } from "@prisma/client";
import { validateForm } from "~/utility/validate";
import { PageNotification } from "~/hooks/PageNotification";
import { getProductCategories } from "~/models/ProductCategories/index.server";
import {
  NewProductSubCategory,
  ProductSubCategoryWithDetails,
} from "~/models/ProductSubCategories/types";
import {
  deleteProductSubCategory,
  getProductSubCategory,
  upsertProductSubCategory,
} from "~/models/ProductSubCategories/index.server";

const validateOptions = {
  name: true,
  index: true,
};

export const productSubCategoryUpsertLoader = async (request: Request) => {
  const productCategories = await getProductCategories();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("contentId");

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

export const productSubCategoryUpsertAction = async (request: Request) => {
  let notification: PageNotification;

  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  const id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const { name, productCategory, index, displayInNavigation, isActive, image } =
    formEntries;

  switch (formEntries._action) {
    case "upsert": {
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
    }

    case "delete": {
      await deleteProductSubCategory(id as string);

      notification = {
        type: "warning",
        message: "Category Deleted",
      };

      return json({ success: true, notification });
    }
  }
};
