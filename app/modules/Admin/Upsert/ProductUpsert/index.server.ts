import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import { getBrands } from "~/models/brands.server";
import type { Image, Staff } from "@prisma/client";
import { getPromotions } from "~/models/promotions.server";
import { getAvailableColors } from "~/models/enums.server";
import type { PageNotification } from "~/hooks/PageNotification";
import { getUserDataFromSession, STAFF_SESSION_KEY } from "~/session.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import {
  deleteProduct,
  getProduct,
  type NewProduct,
  type ProductWithDetails,
  upsertProduct,
} from "~/models/products.server";
const validateOptions = {
  name: true,
  productSubCategories: true,
  description: true,
  variants: true,
  images: true,
  brand: true,
};

export const productUpsertLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const { storeId } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

  if (!storeId) {
    throw new Response(null, {
      status: 505,
      statusText: "You Must Be Assigned to a Store",
    });
  }

  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();
  const promotions = await getPromotions();
  const availableColors = await getAvailableColors();

  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Not Found",
    });
  }

  const product =
    id === "add" ? ({} as ProductWithDetails) : await getProduct(id);

  if (!product) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Not Found",
    });
  }

  return json({
    storeId,
    product,
    productSubCategories,
    brands,
    promotions,
    availableColors,
  });
};

export const productUpsertAction = async (
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
    productSubCategories,
    description,
    infoURL,
    gender,
    isActive,
    variants,
    images,
    heroImage,
    brand,
    promotion,
  } = formEntries;

  //if single variant we set its name to base and ensure array
  let variantData = variants && JSON.parse(variants?.toString());
  if (!Array.isArray(variantData)) {
    variantData = [variantData];
    variantData[0] = { ...variantData[0], name: "BASE" };
  }

  switch (formEntries._action) {
    case "upsert":
      if (formErrors) {
        return { serverValidationErrors: formErrors };
      }

      const parsedHeroImage = heroImage
        ? (JSON.parse(heroImage?.toString()) as Image)
        : undefined;

      const updateData: NewProduct = {
        name: name as string,
        productSubCategories:
          productSubCategories && JSON.parse(productSubCategories as string),
        variants: variantData,
        infoURL: infoURL as string,
        description: description as string,
        gender: gender as string,
        isActive: isActive ? true : false,
        images:
          (JSON.parse(images as string).filter(Boolean) as Image[]) || null,
        heroImage: parsedHeroImage || null,
        brand: brand as string,
        promotion: promotion as string,
        id: id,
      };

      await upsertProduct(request, updateData);

      notification = {
        type: "success",
        message: `Product ${id === "add" ? "Added" : "Updated"}.`,
      };

      return { success: true, notification };

    case "delete":
      await deleteProduct(id as string);

      notification = {
        type: "warning",
        message: "Product Deleted",
      };

      return { success: true };
  }
};
