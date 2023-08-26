import { useState } from "react";
import { getBrands } from "~/models/brands.server";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import { getPromotions } from "~/models/promotions.server";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import SelectBrand from "~/components/Forms/Select/SelectBrand";
import SelectGender from "~/components/Forms/Select/SelectGender";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import SelectPromotion from "~/components/Forms/Select/SelectPromotion";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { getAvailableColors, getAvailableSizes } from "~/models/enums.server";
import ProductVariantFormModule from "~/components/Forms/Modules/ProductVariantFormModule";
import {
  deleteProduct,
  getProduct,
  upsertProduct,
} from "~/models/products.server";
import SelectProductSubCategories from "~/components/Forms/Select/SelectProductSubCategories";
import {
  json,
  redirect,
  type ActionArgs,
  type LinksFunction,
  type LoaderArgs,
} from "@remix-run/server-runtime";

import swiper from "../../node_modules/swiper/swiper.css";
import swiperNav from "../../node_modules/swiper/modules/navigation/navigation.min.css";
import UploadMultipleImages from "~/components/Forms/Upload/UploadMultipleImages/index.client";
import RichTextInput from "~/components/Forms/Input/RichTextInput/index.client";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: swiper },
  { rel: "stylesheet", href: swiperNav },
];

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();
  const promotions = await getPromotions();
  const availableColors = await getAvailableColors();
  const availableSizes = await getAvailableSizes();
  let product;

  if (id && id !== "add") {
    product = await getProduct(id);
  }

  return json({
    product,
    productSubCategories,
    brands,
    promotions,
    availableColors,
    availableSizes,
  });
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const {
    name,
    productSubCategories,
    description,
    gender,
    isActive,
    variants,
    images,
    brand,
    promotion,
  } = form;

  //if single variant we set its name to base
  let variantData = variants && JSON.parse(variants?.toString());
  if (!Array.isArray(variantData)) {
    variantData = [variantData];
    variantData[0] = { ...variantData[0], name: "BASE" };
  }

  switch (form._action) {
    case "upsert":
      if (!name || name.length < 3) {
        const validationError = "name must be at least 3 chars.";
        return { validationError };
      }

      const updateData = {
        name: name as string,
        productSubCategories:
          productSubCategories && JSON.parse(productSubCategories as string),
        variants: variantData,
        description: description as string,
        gender: gender as string,
        isActive: isActive ? true : false,
        images:
          images && (JSON.parse(images as string).filter(Boolean) as Image[]),
        brand: brand as string,
        promotion: promotion as string,
        id: id,
      };

      await upsertProduct(updateData);

      return redirect("/admin/products");

    case "delete":
      await deleteProduct(id as string);
      return redirect("/admin/products");
  }
};

const Product = () => {
  const {
    product,
    productSubCategories,
    brands,
    promotions,
    availableColors,
    availableSizes,
  } = useLoaderData();

  const { statusText } = (useActionData() as { statusText: string }) || {};

  const mode = product ? "edit" : "add";

  const [richText, setRichText] = useState<string>(product?.description);

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="scrollbar-hide relative w-[600px] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
          valueToChange={product}
          type="Product"
          mode={mode}
          hasIsActive={true}
          hasDelete={false}
        />

        <div className="form-control">
          <div className="form-control gap-3">
            <div className="flex flex-wrap justify-evenly gap-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Name"
                  className="input input-bordered w-[95vw] sm:w-[215px]"
                  defaultValue={product?.name}
                />
              </div>

              <SelectBrand
                brands={brands}
                defaultValue={product?.brandId?.toString()}
              />
            </div>

            <div className="flex flex-wrap justify-evenly gap-3">
              <SelectGender
                defaultValue={product?.gender}
                label="Product is Gendered?"
              />

              <SelectPromotion
                promotions={promotions}
                valueToChange={product}
              />
            </div>

            <div className="flex flex-wrap justify-evenly gap-3">
              <SelectProductSubCategories
                productSubCategories={productSubCategories}
                valueToChange={product}
              />

              <div className="w-[95vw] sm:w-[215px]" />
            </div>
          </div>

          <div className="divider w-full pt-4" />

          <UploadMultipleImages defaultImages={product?.images} />

          <div className="divider w-full pt-4" />

          <ProductVariantFormModule
            product={product}
            availableColors={availableColors}
            availableSizes={availableSizes}
          />

          <div className="divider w-full pt-4" />

          <div className="form-control my-3 w-[495px] max-w-[95vw] self-center">
            <label className="label">
              <span className="label-text">Description</span>
            </label>

            <RichTextInput
              value={richText}
              onChange={setRichText}
              className="mb-6 h-[200px] pb-3"
            />

            <input
              hidden
              readOnly
              name="description"
              value={richText || product?.description}
            />
          </div>

          {statusText && (
            <p className="my-2 text-center text-sm text-red-500/75">
              {statusText}
            </p>
          )}

          <BackSubmitButtons />
        </div>
      </Form>
    </DarkOverlay>
  );
};

export default Product;
