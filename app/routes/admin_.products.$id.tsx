import { useState } from "react";
import { tokenAuth } from "~/auth.server";
import { getBrands } from "~/models/brands.server";
import { capitalizeFirst } from "~/utility/stringHelpers";
import RichTextEditor from "~/components/RichTextEditor.client";
import ImageUploadSlider from "~/components/ImageUploadSlider.client";
import { getProductCategories } from "~/models/productCategories.server";
import { getAvailableColors, getAvailableSizes } from "~/models/enums.server";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  deleteProduct,
  getProduct,
  upsertProduct,
} from "~/models/products.server";
import {
  json,
  redirect,
  type ActionArgs,
  type LoaderArgs,
} from "@remix-run/server-runtime";
import SelectGender from "~/components/Forms/SelectGender";
import SelectProductCategories from "~/components/Forms/SelectProductCategories";
import SelectBrand from "~/components/Forms/SelectBrand";
import ProductVariantFormModule from "~/components/Forms/ProductVariantFormModule";
import SelectPromotion from "~/components/Forms/SelectPromotion";
import { getPromotions } from "~/models/promotions.server";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;
  const productCategories = await getProductCategories();
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
    productCategories,
    brands,
    promotions,
    availableColors,
    availableSizes,
  });
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request);
  if (!authenticated.valid) {
    return redirect("/login");
  }
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const {
    name,
    productCategories,
    description,
    gender,
    isActive,
    variants,
    images,
    brand,
    promotion,
  } = form;

  //if single variant we set it to base
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
        productCategories:
          productCategories && JSON.parse(productCategories as string),
        variants: variantData,
        description: description as string,
        gender: gender as string,
        isActive: isActive ? true : false,
        images:
          images && (JSON.parse(images as string).filter(Boolean) as Image[]),
        brand: (brand as string) || "Generic",
        promotion: promotion as string,
        id: id,
      };

      console.log("PROMOS", promotion);

      await upsertProduct(updateData);

      return redirect("/admin/products");

    case "delete":
      await deleteProduct(id as string);
      return redirect("/admin/products");
  }
};

const Product = () => {
  const navigate = useNavigate();
  const {
    product,
    productCategories,
    brands,
    promotions,
    availableColors,
    availableSizes,
  } =
    (useLoaderData() as {
      product: Product;
      productCategories: ProductCategory[];
      brands: Brand[];
      promotions: Promotion[];
      availableColors: string[];
      availableSizes: string[];
    }) || {};
  const { statusText } = (useActionData() as { statusText: string }) || {};

  const mode = product ? "edit" : "add";

  const [currentImages, setCurrentImages] = useState<Image[] | undefined>(
    product?.images
  );

  const [isActive, setisActive] = useState<string | undefined>(
    mode === "add" ? " " : product?.isActive ? " " : ""
  );

  const [richText, setRichText] = useState<string>(product?.description);

  return (
    <div
      className="
    absolute inset-0 flex h-max max-w-[100vw] flex-col items-center justify-start bg-black/80 py-3"
    >
      <Form
        method="POST"
        className="
        relative w-[600px] max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <div className="flex flex-row justify-between">
          <h1>{mode && capitalizeFirst(mode)} Product</h1>

          <label className="label mt-1 h-1 cursor-pointer">
            <input
              type="checkbox"
              className="toggle-success toggle ml-3"
              checked={isActive ? true : false}
              onChange={(e) =>
                setisActive(e.target.checked ? "true" : undefined)
              }
            />
            <span className="label-text ml-3">Active</span>
          </label>
        </div>
        <input name="isActive" value={isActive || ""} readOnly hidden />

        <div className="divider w-full" />

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
                  className="input-bordered input w-[95vw] sm:w-[215px]"
                  defaultValue={product?.name}
                />
              </div>

              <SelectBrand brands={brands} valueToChange={product} />
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
              <SelectProductCategories
                productCategories={productCategories}
                valueToChange={product}
              />

              <div className="w-[95vw] sm:w-[215px]" />
            </div>
          </div>

          <div className="divider w-full pt-4" />

          <ImageUploadSlider
            images={currentImages}
            onUpdateImages={setCurrentImages}
          />

          <input
            hidden
            readOnly
            name="images"
            value={JSON.stringify(currentImages) || ""}
          />

          <div className="divider w-full pt-4" />

          <ProductVariantFormModule
            product={product}
            availableColors={availableColors}
            availableSizes={availableSizes}
          />

          <div className="divider w-full pt-4" />

          <div className="form-control mt-3 w-[495px] max-w-[95vw] self-center">
            <label className="label">
              <span className="label-text">Description</span>
            </label>

            <RichTextEditor
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

          <div className="divider w-full pt-12" />

          {statusText && (
            <p className="my-2 text-center text-sm text-red-500/75">
              {statusText}
            </p>
          )}

          <div className="flex flex-row justify-center gap-6">
            <button
              type="button"
              className="btn-primary btn mt-6 w-max"
              onClick={() => navigate("..")}
            >
              Back
            </button>

            <button
              type="submit"
              name="_action"
              value="upsert"
              className="btn-primary btn mt-6 w-max"
            >
              Submit
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Product;
