import { Image } from "@prisma/client";
import { json } from "@remix-run/node";
import { validateForm } from "~/utility/validate";
import { NewProduct } from "~/models/Products/types";
import { CartDimensions } from "~/helpers/cartHelpers";
import { getBrands } from "~/models/Brands/index.server";
import { PageNotification } from "~/hooks/PageNotification";
import { upsertProduct } from "~/models/Products/index.server";
import { convertAliToCmsVariantData } from "~/integrations/aliexpress/helpers";
import { getProductSubCategories } from "~/models/ProductSubCategories/index.server";
import { getAliExpressDataHub_Product } from "~/integrations/aliexpress/index.server";
import { AliExpress_ProductVariant } from "~/integrations/aliexpress/types";

const validateOptions = {};

export const dropshipProductUpsertLoader = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Not Found",
    });
  }

  const dropshipProductResult = await getAliExpressDataHub_Product(id);

  if (!dropshipProductResult) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Not Found",
    });
  }

  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();

  return json({ dropshipProductResult, productSubCategories, brands });
};

export const dropshipProductUpsertAction = async (request: Request) => {
  let notification: PageNotification;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const {
    name,
    productSubCategories,
    description,
    dropshipURL,
    dropshipSKU,
    gender,
    isActive,
    brand,
    variants,
    images,
    shippingDimensions,
    markupPercentage,
  } = formEntries;

  const parsedShippingDimensions = JSON.parse(
    shippingDimensions as string,
  ) as CartDimensions;

  const parsedNewVariantDetails = JSON.parse(
    variants as string,
  ) as AliExpress_ProductVariant[];

  const convertedVariantData = convertAliToCmsVariantData(
    parsedNewVariantDetails,
    parsedShippingDimensions,
    Number(markupPercentage),
  );

  switch (formEntries._action) {
    case "upsert": {
      if (formErrors) {
        return { serverValidationErrors: formErrors };
      }

      const updateData: NewProduct = {
        name: name as string,
        productSubCategories:
          productSubCategories && JSON.parse(productSubCategories as string),
        variants: convertedVariantData,
        dropshipURL: dropshipURL as string,
        dropshipSKU: dropshipSKU as string,
        description: description as string,
        gender: gender as string,
        brand: brand as string,
        isActive: isActive ? true : false,
        images:
          (JSON.parse(images as string).filter(Boolean) as Image[]) || null,
      };

      await upsertProduct(request, updateData);

      notification = {
        type: "success",
        message: "Product Added.",
      };

      return { success: true, notification };
    }
  }
};
