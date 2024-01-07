import { type FormEvent, useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { getBrands } from "~/models/brands.server";
import type { Image, Staff } from "@prisma/client";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import { getPromotions } from "~/models/promotions.server";
import { getAvailableColors } from "~/models/enums.server";
import { ClientOnly } from "~/components/Client/ClientOnly";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectGender from "~/components/Forms/Select/SelectGender";
import UploadHeroImage from "~/components/Forms/Upload/UploadHeroImage";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { getUserDataFromSession, STAFF_SESSION_KEY } from "~/session.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import RichTextInput from "~/components/Forms/Input/RichTextInput/index.client";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import UploadMultipleImages from "~/components/Forms/Upload/UploadMultipleImages/index.client";
import {
  Form,
  Outlet,
  type Params,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
  useParams,
} from "@remix-run/react";
import {
  deleteProduct,
  getProduct,
  type NewProduct,
  type ProductWithDetails,
  upsertProduct,
} from "~/models/products.server";
import ProductVariantUpsert from "./ProductVariantUpsert";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";
import TabValidationErrors from "~/components/Forms/Validation/TabValidationErrors";
import TabContent from "~/components/Tabs/TabContent";

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
  params: Params<string>
) => {
  const { storeId } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

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
  params: Params<string>
) => {
  let notification: PageNotification;

  let { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  let id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions
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

type Props = {
  offRouteModule?: boolean;
};

const UpsertProduct = ({ offRouteModule }: Props) => {
  const {
    storeId,
    product,
    productSubCategories,
    brands,
    promotions,
    availableColors,
  } = useLoaderData<typeof productUpsertLoader>();
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  let submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  const { contentType } = useParams();
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [richText, setRichText] = useState<string>(product?.description);
  const [loading, setLoading] = useState<boolean>(false);

  const tabNames = ["general", "images", "variants", "other"];
  const [activeTab, setActiveTab] = useState<string | undefined>(tabNames?.[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let form = getFormData(event);
    event.preventDefault();

    form = handleWindowedFormData(form);

    console.log("form", form);

    const { formErrors } = validateForm(new FormData(form), validateOptions);

    if (formErrors) {
      console.log("errs", formErrors);
      setClientValidationErrors(formErrors);
      setLoading(false);
      return;
    }

    submit(form, {
      method: "POST",
      action: `/admin/upsert/${contentType}?contentId=${contentId}`,
      navigate: offRouteModule ? false : true,
    });

    if (offRouteModule) {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
  }, [success, navigate]);

  return (
    <>
      <DarkOverlay>
        <WindowContainer
          activeTab={activeTab}
          hasIsActive={true}
          hasMode={true}
          isActive={product?.isActive}
          setActiveTab={handleTabChange}
          tabNames={tabNames}
          title="Product"
          children={
            <Form
              method="POST"
              onSubmit={handleSubmit}
              className="scrollbar-hide relative w-[640px] max-w-full overflow-y-auto"
            >
              <TabContent
                tab="general"
                activeTab={activeTab}
                children={
                  <>
                    <div className="form-control gap-3">
                      <BasicInput
                        id="ProductName"
                        label="Name"
                        type="text"
                        name="name"
                        placeholder="Name"
                        customWidth="w-full"
                        defaultValue={product?.name}
                        validationErrors={
                          clientValidationErrors || serverValidationErrors
                        }
                      />

                      <BasicSelect
                        name="brand"
                        label="Brand"
                        placeholder="Brand"
                        customWidth="w-full"
                        selections={brands}
                        defaultValue={product?.brandId?.toString() || "1"}
                        validationErrors={
                          clientValidationErrors || serverValidationErrors
                        }
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
                        validationErrors={
                          clientValidationErrors || serverValidationErrors
                        }
                      />
                    </div>

                    <ClientOnly fallback={<div id="skeleton" />}>
                      {() => (
                        <RichTextInput
                          label="Description"
                          name="description"
                          value={richText || product?.description}
                          onChange={setRichText}
                          extendStyle="mb-6 h-[200px] pb-3"
                          validationErrors={
                            clientValidationErrors || serverValidationErrors
                          }
                        />
                      )}
                    </ClientOnly>
                  </>
                }
              />

              <TabContent
                tab="images"
                activeTab={activeTab}
                children={
                  <>
                    <TabValidationErrors
                      formName="images"
                      clientValidationErrors={clientValidationErrors}
                      serverValidationErrors={serverValidationErrors}
                    />

                    <ClientOnly fallback={<div id="skeleton" />}>
                      {() => (
                        <UploadMultipleImages defaultImages={product?.images} />
                      )}
                    </ClientOnly>

                    <div className="divider w-full pt-4" />

                    <UploadHeroImage valueToChange={product} />
                  </>
                }
              />

              <TabContent
                tab="variants"
                activeTab={activeTab}
                children={
                  <>
                    <TabValidationErrors
                      formName="variants"
                      clientValidationErrors={clientValidationErrors}
                      serverValidationErrors={serverValidationErrors}
                    />

                    <ProductVariantUpsert
                      storeId={storeId}
                      product={product}
                      availableColors={availableColors}
                    />
                  </>
                }
              />

              <TabContent
                tab="other"
                activeTab={activeTab}
                children={
                  <BasicInput
                    label="Dropship URL"
                    type="text"
                    name="infoURL"
                    placeholder="Info URL"
                    customWidth="w-full"
                    defaultValue={product?.infoURL}
                    validationErrors={
                      clientValidationErrors || serverValidationErrors
                    }
                  />
                }
              />

              <BackSubmitButtons
                loading={loading}
                setLoading={setLoading}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />
            </Form>
          }
        />
      </DarkOverlay>
      <Outlet />
    </>
  );
};

export default UpsertProduct;
