import { useEffect, useState } from "react";
import type { ActionReturnTypes } from "~/utility/actionTypes";
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
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  type ProductWithDetails,
  deleteProduct,
  getProduct,
  upsertProduct,
  type NewProduct,
} from "~/models/products.server";
import ProductVariantFormModule from "~/components/Forms/Modules/ProductVariantFormModule";
import UploadMultipleImages from "~/components/Forms/Upload/UploadMultipleImages/index.client";
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY, getUserDataFromSession } from "~/session.server";
import { ClientOnly } from "~/components/Client/ClientOnly";
import type { Image, Staff } from "@prisma/client";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const { storeId } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

  const productSubCategories = await getProductSubCategories();
  const brands = await getBrands();
  const promotions = await getPromotions();
  const availableColors = await getAvailableColors();

  const id = params?.id;

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

export const action = async ({ request, params }: ActionFunctionArgs) => {
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

      return { success: true };

    case "delete":
      await deleteProduct(id as string);
      return { success: true };
  }
};

const Product = () => {
  const {
    storeId,
    product,
    productSubCategories,
    brands,
    promotions,
    availableColors,
  } = useLoaderData<typeof loader>();
  const { validationErrors, success } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();

  const [richText, setRichText] = useState<string>(product?.description);
  const [loading, setLoading] = useState<boolean>(false);

  const tabNames = ["general", "images", "variants", "other"];
  const [activeTab, setActiveTab] = useState<string | undefined>(tabNames?.[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
  }, [success, navigate]);

  return (
    <>
      <DarkOverlay>
        <Form
          method="POST"
          className="scrollbar-hide relative w-[640px] max-w-full overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
        >
          <FormHeader
            valueToChange={product}
            type="Product"
            hasIsActive={true}
            hasDelete={false}
            tabNames={tabNames}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div
            className={`form-control ${activeTab !== "general" && "hidden"}`}
          >
            <div className="form-control gap-3">
              <BasicInput
                id="ProductName"
                label="Name"
                type="text"
                name="name"
                placeholder="Name"
                customWidth="w-full"
                defaultValue={product?.name}
                validationErrors={validationErrors}
              />

              <BasicSelect
                name="brand"
                label="Brand"
                placeholder="Brand"
                customWidth="w-full"
                selections={brands}
                defaultValue={product?.brandId?.toString() || "1"}
              />

              <SelectGender
                defaultValue={product?.gender}
                label="Product is Gendered?"
                customWidth="w-full"
              />

              <BasicSelect
                name="promotion"
                label="Promotion"
                placeholder="Promotion"
                customWidth="w-full"
                selections={promotions}
                defaultValue={product?.promotionId?.toString()}
              />

              <BasicMultiSelect
                name="productSubCategories"
                label="Categories"
                customWidth="w-full"
                extendStyle="!h-[150px]"
                selections={productSubCategories}
                defaultValues={product?.productSubCategories}
              />
            </div>

            <div className="form-control my-3 w-[495px] max-w-[95vw] self-center">
              <label className="label">
                <span className="label-text">Description</span>
              </label>

              <ClientOnly fallback={<div id="skeleton" />}>
                {() => (
                  <RichTextInput
                    value={richText}
                    onChange={setRichText}
                    className="mb-6 h-[200px] pb-3"
                  />
                )}
              </ClientOnly>

              <input
                hidden
                readOnly
                name="description"
                value={richText || product?.description}
              />
            </div>
          </div>

          <div className={`form-control ${activeTab !== "images" && "hidden"}`}>
            <ClientOnly fallback={<div id="skeleton" />}>
              {() => <UploadMultipleImages defaultImages={product?.images} />}
            </ClientOnly>

            <div className="divider w-full pt-4" />

            <UploadHeroImage valueToChange={product} />
          </div>

          <div
            className={`form-control ${activeTab !== "variants" && "hidden"}`}
          >
            <ProductVariantFormModule
              storeId={storeId}
              product={product}
              availableColors={availableColors}
            />
          </div>

          <div className={`form-control ${activeTab !== "other" && "hidden"}`}>
            <BasicInput
              label="Dropship URL"
              type="text"
              name="infoURL"
              placeholder="Info URL"
              customWidth="w-full"
              defaultValue={product?.infoURL}
              validationErrors={validationErrors}
            />
          </div>

          <BackSubmitButtons
            loading={loading}
            setLoading={setLoading}
            validationErrors={validationErrors}
          />
        </Form>
      </DarkOverlay>
      <Outlet />
    </>
  );
};

export default Product;
