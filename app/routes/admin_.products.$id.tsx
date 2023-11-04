import { useEffect, useState } from "react";
import { validateForm } from "~/utility/validate";
import { getBrands } from "~/models/brands.server";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import { getPromotions } from "~/models/promotions.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectGender from "~/components/Forms/Select/SelectGender";
import UploadHeroImage from "~/components/Forms/Upload/UploadHeroImage";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { getAvailableColors } from "~/models/enums.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import RichTextInput from "~/components/Forms/Input/RichTextInput/index.client";
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
import ProductVariantFormModule from "~/components/Forms/Modules/ProductVariantFormModule";
import UploadMultipleImages from "~/components/Forms/Upload/UploadMultipleImages/index.client";
import {
  redirect,
  type ActionArgs,
  type LinksFunction,
  type LoaderArgs,
} from "@remix-run/server-runtime";

import swiper from "../../node_modules/swiper/swiper.css";
import swiperNav from "../../node_modules/swiper/modules/navigation/navigation.min.css";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: swiper },
  { rel: "stylesheet", href: swiperNav },
];

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params?.id;
  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();
  const promotions = await getPromotions();
  const availableColors = await getAvailableColors();
  let product;

  if (id && id !== "add") {
    product = await getProduct(id);
  }

  return {
    product,
    productSubCategories,
    brands,
    promotions,
    availableColors,
  };
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
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
  } = form;

  //if single variant we set its name to base
  let variantData = variants && JSON.parse(variants?.toString());
  if (!Array.isArray(variantData)) {
    variantData = [variantData];
    variantData[0] = { ...variantData[0], name: "BASE" };
  }

  switch (form._action) {
    case "upsert":
      const validate = {
        name: true,
        productSubCategories: true,
        description: true,
        variants: true,
        images: true,
        brand: true,
      };

      const validationErrors = validateForm(form, validate);
      if (validationErrors) {
        return { validationErrors };
      }

      const parsedHeroImage = heroImage
        ? (JSON.parse(heroImage?.toString()) as Image)
        : undefined;

      const updateData = {
        name: name as string,
        productSubCategories:
          productSubCategories && JSON.parse(productSubCategories as string),
        variants: variantData,
        infoURL: infoURL as string,
        description: description as string,
        gender: gender as string,
        isActive: isActive ? true : false,
        images:
          images && (JSON.parse(images as string).filter(Boolean) as Image[]),
        heroImage: parsedHeroImage,
        brand: brand as string,
        promotion: promotion as string,
        id: id,
      };

      await upsertProduct(updateData);

      return { success: true };

    case "delete":
      await deleteProduct(id as string);
      return { success: true };
  }
};

const Product = () => {
  const { product, productSubCategories, brands, promotions, availableColors } =
    useLoaderData();
  const { validationErrors, success } =
    (useActionData() as {
      validationErrors: ValidationErrors;
      success: boolean;
    }) || {};

  const navigate = useNavigate();

  const mode = product ? "edit" : "add";

  const [richText, setRichText] = useState<string>(product?.description);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
  }, [success, navigate]);

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
          valueToChange={product}
          type="Product"
          mode={mode}
          hasIsActive={true}
          hasDelete={true}
        />

        <div className="form-control">
          <div className="form-control gap-3">
            <div className="flex flex-wrap justify-evenly gap-3">
              <BasicInput
                label="Name"
                type="text"
                name="name"
                placeholder="Name"
                defaultValue={product?.name}
                validationErrors={validationErrors}
              />

              <BasicSelect
                name="brand"
                label="Brand"
                placeholder="Brand"
                selections={brands}
                defaultValue={product?.brandId?.toString()}
              />
            </div>

            <div className="flex flex-wrap justify-evenly gap-3">
              <SelectGender
                defaultValue={product?.gender}
                label="Product is Gendered?"
              />

              <BasicSelect
                name="promotion"
                label="Promotion"
                placeholder="Promotion"
                selections={promotions}
                defaultValue={product?.promotionId?.toString()}
              />
            </div>

            <div className="flex flex-wrap justify-evenly gap-3">
              <BasicMultiSelect
                name="productSubCategories"
                label="Categories"
                selections={productSubCategories}
                defaultValues={product?.productSubCategories}
              />

              <BasicInput
                label="Info URL"
                type="text"
                name="infoURL"
                placeholder="Info URL"
                defaultValue={product?.infoURL}
                validationErrors={validationErrors}
              />
            </div>
          </div>

          <div className="divider w-full pt-4" />

          <UploadMultipleImages defaultImages={product?.images} />

          <div className="divider w-full pt-4" />

          <UploadHeroImage valueToChange={product} />

          <div className="divider w-full pt-4" />

          <ProductVariantFormModule
            product={product}
            availableColors={availableColors}
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

          <BackSubmitButtons loading={loading} setLoading={setLoading} />
        </div>
      </Form>
    </DarkOverlay>
  );
};

export default Product;
