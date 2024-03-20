import { type FormEvent, useEffect, useState } from "react";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectGender from "~/components/Forms/Select/SelectGender";
import UploadHeroImage from "~/components/Forms/Upload/UploadHeroImage";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import RichTextInput from "~/components/Forms/Input/RichTextInput/index.client";
import useNotification from "~/hooks/PageNotification";
import UploadMultipleImages from "~/components/Forms/Upload/UploadMultipleImages/index.client";
import {
  Form,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
  useParams,
} from "@remix-run/react";
import ProductVariantUpsert from "./ProductVariantUpsert";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";
import TabValidationErrors from "~/components/Forms/Validation/TabValidationErrors";
import TabContent from "~/components/Tabs/TabContent";
import type { productUpsertLoader } from "./index.server";
import { IoTrashSharp } from "react-icons/io5";
import { ActionAlert } from "~/components/Notifications/Alerts";
import { sortArrayAlphabetically } from "~/helpers/arrayHelpers";
import { ClientOnly } from "~/components/Client/ClientOnly";

const validateOptions = {
  name: true,
  productSubCategories: true,
  description: true,
  variants: true,
  images: true,
  brand: true,
};

type Props = {
  offRouteModule?: boolean;
};

const UpsertProduct = ({ offRouteModule }: Props) => {
  const { storeId, product, productSubCategories, brands, promotions } =
    useLoaderData<typeof productUpsertLoader>();
  const { serverValidationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  const submit = useSubmit();
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

    const { formErrors, formEntries } = validateForm(
      new FormData(form),
      validateOptions,
    );

    if (formEntries._action === "delete") {
      ActionAlert(
        "Warning",
        "Delete this Product?",
        () => {
          submit(form, {
            method: "POST",
            action: `/admin/upsert/${contentType}?contentId=${contentId}`,
            navigate: offRouteModule ? false : true,
          });

          if (offRouteModule) {
            navigate(-1);
          }
        },
        () => {
          setLoading(false);
          return;
        },
        "warning",
      );
    } else {
      if (formErrors) {
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
        >
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[640px] max-w-full"
          >
            <TabContent tab="general" activeTab={activeTab}>
              <>
                <button
                  type="submit"
                  name="_action"
                  value="delete"
                  className="absolute z-50 top-[-10px] max-md:top-0 right-0 text-white bg-error rounded-full p-1 text-sm"
                >
                  <IoTrashSharp />
                </button>

                <div className="form-control gap-3">
                  <BasicInput
                    id="ProductName"
                    label="Name"
                    type="text"
                    name="name"
                    placeholder="Name"
                    extendContainerStyle="w-full"
                    defaultValue={product?.name}
                    validationErrors={
                      clientValidationErrors || serverValidationErrors
                    }
                  />

                  <BasicSelect
                    name="brand"
                    label="Brand"
                    placeholder="Select Brand"
                    extendContainerStyle="w-full"
                    selections={brands}
                    defaultValue={product?.brandId?.toString() || "1"}
                    validationErrors={
                      clientValidationErrors || serverValidationErrors
                    }
                  />

                  <SelectGender
                    defaultValue={product?.gender}
                    label="Product is Gendered?"
                    extendContainerStyle="w-full"
                  />

                  <BasicSelect
                    name="promotion"
                    label="Promotion"
                    placeholder="Select Promotion"
                    extendContainerStyle="w-full"
                    selections={promotions}
                    defaultValue={product?.promotionId?.toString()}
                  />

                  <BasicMultiSelect
                    name="productSubCategories"
                    label="Categories"
                    extendContainerStyle="w-full"
                    extendStyle="!h-[150px]"
                    selections={
                      sortArrayAlphabetically(
                        productSubCategories,
                        "name",
                      ) as SelectValue[]
                    }
                    defaultValues={product?.productSubCategories}
                    validationErrors={
                      clientValidationErrors || serverValidationErrors
                    }
                  />
                </div>

                <ClientOnly fallback={<div id="skeleton" />}>
                  <RichTextInput
                    label="Description"
                    labelStyle="!text-brand-black"
                    name="description"
                    value={richText || product?.description}
                    onChange={setRichText}
                    extendStyle="mb-6 h-[200px] pb-3"
                    validationErrors={
                      clientValidationErrors || serverValidationErrors
                    }
                  />
                </ClientOnly>
              </>
            </TabContent>

            <TabContent tab="images" activeTab={activeTab}>
              <>
                <TabValidationErrors
                  formName="images"
                  clientValidationErrors={clientValidationErrors}
                  serverValidationErrors={serverValidationErrors}
                />

                <ClientOnly fallback={<div id="skeleton" />}>
                  <UploadMultipleImages defaultImages={product?.images} />
                </ClientOnly>

                <div className="divider w-full pt-4" />

                <UploadHeroImage valueToChange={product} />
              </>
            </TabContent>

            <TabContent tab="variants" activeTab={activeTab}>
              <>
                <TabValidationErrors
                  formName="variants"
                  clientValidationErrors={clientValidationErrors}
                  serverValidationErrors={serverValidationErrors}
                />

                <ProductVariantUpsert storeId={storeId} product={product} />
              </>
            </TabContent>

            <TabContent tab="other" activeTab={activeTab}>
              <BasicInput
                label="Dropship URL"
                type="text"
                name="dropshipURL"
                placeholder="Info URL"
                extendContainerStyle="w-full"
                defaultValue={product?.dropshipURL}
                validationErrors={
                  clientValidationErrors || serverValidationErrors
                }
              />

              <BasicInput
                label="Dropship SKU"
                type="text"
                name="dropshipSKU"
                placeholder="Dropship SKU"
                extendContainerStyle="w-full"
                defaultValue={product?.dropshipSKU}
                validationErrors={
                  clientValidationErrors || serverValidationErrors
                }
              />
            </TabContent>

            <BackSubmitButtons
              loading={loading}
              setLoading={setLoading}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />
          </Form>
        </WindowContainer>
      </DarkOverlay>
      <Outlet />
    </>
  );
};

export default UpsertProduct;
