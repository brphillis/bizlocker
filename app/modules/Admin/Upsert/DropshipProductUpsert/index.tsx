import { FormEvent, useEffect, useState } from "react";
import { Image } from "@prisma/client";
import { validateForm } from "~/utility/validate";
import { getFormData } from "~/helpers/formHelpers";
import TabContent from "~/components/Tabs/TabContent";
import useNotification from "~/hooks/PageNotification";
import BasicTable from "~/components/Tables/BasicTable";
import { ActionReturnTypes } from "~/utility/actionTypes";
import { ClientOnly } from "~/components/Client/ClientOnly";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicToggle from "~/components/Forms/Toggle/BasicToggle";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import SelectGender from "~/components/Forms/Select/SelectGender";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import { AliExpress_ProductVariant } from "~/integrations/aliexpress/types";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import RichTextInput from "~/components/Forms/Input/RichTextInput/index.client";
import UploadMultipleImages from "~/components/Forms/Upload/UploadMultipleImages/index.client";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
  useSubmit,
} from "@remix-run/react";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";
import {
  getAliExpresProductShippingDimensions,
  getAliExpressProductDetails,
  getAliExpressProductVariants,
} from "~/integrations/aliexpress/helpers";
import { dropshipProductUpsertLoader } from "./index.server";

const validateOptions = {
  name: true,
  productSubCategories: true,
  description: true,
  variants: true,
  images: true,
};

type Props = {
  offRouteModule?: boolean;
};

const DropshipProductUpsert = ({ offRouteModule }: Props) => {
  const { dropshipProductResult, productSubCategories, brands } =
    useLoaderData<typeof dropshipProductUpsertLoader>();

  const { success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  const submit = useSubmit();

  const { contentType } = useParams();
  useNotification(notification);

  const [richText, setRichText] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const tabNames = ["general", "variants", "images", "shipping"];
  const [activeTab, setActiveTab] = useState<string | undefined>(tabNames?.[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const [productVariants, setProductVariants] = useState<
    AliExpress_ProductVariant[]
  >(getAliExpressProductVariants(dropshipProductResult.item));

  const product = getAliExpressProductDetails(dropshipProductResult.item);

  const shippingDimensions = getAliExpresProductShippingDimensions(
    dropshipProductResult.delivery,
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let form = getFormData(event);
    event.preventDefault();

    form = handleWindowedFormData(form);

    const { formErrors } = validateForm(new FormData(form), validateOptions);

    if (formErrors) {
      setLoading(false);
      return;
    }

    submit(form, {
      method: "POST",
      action: `/admin/upsert/${contentType}`,
      navigate: offRouteModule ? false : true,
    });

    if (offRouteModule) {
      navigate(-1);
    }
  };

  useEffect(() => {
    if (success) {
      navigate("/admin/search/product");
    }
  }, [success, navigate]);

  return (
    <DarkOverlay>
      <WindowContainer
        hasMode={true}
        title="Dropship Product"
        setActiveTab={handleTabChange}
        tabNames={tabNames}
        activeTab={activeTab}
        hasIsActive={true}
      >
        <Form
          method="POST"
          onSubmit={handleSubmit}
          className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto"
        >
          <TabContent tab="general" activeTab={activeTab} extendStyle="gap-3">
            <BasicInput
              name="name"
              label="Name"
              placeholder="Name"
              type="text"
              extendContainerStyle="w-full"
              defaultValue={product.name || undefined}
            />

            <BasicInput
              name="sales"
              label="Sales"
              placeholder="Sales"
              type="number"
              extendContainerStyle="w-full"
              defaultValue={product.sales || undefined}
            />

            <BasicInput
              name="markupPercentage"
              label="Mark Up Percentage"
              placeholder="20"
              type="number"
              extendContainerStyle="w-full"
              defaultValue={20}
            />

            <SelectGender
              defaultValue={product?.gender}
              label="Product is Gendered?"
              extendContainerStyle="w-full"
            />

            <BasicSelect
              name="brand"
              label="Brand"
              placeholder="Select Brand"
              extendContainerStyle="w-full"
              selections={brands}
              defaultValue={"1"}
            />

            <BasicMultiSelect
              name="productSubCategories"
              label="Categories"
              extendContainerStyle="w-full"
              extendStyle="!h-[150px]"
              selections={productSubCategories}
            />

            <ClientOnly fallback={<div id="skeleton" />}>
              {() => (
                <RichTextInput
                  label="Description"
                  labelStyle="!text-brand-black"
                  name="description"
                  value={richText}
                  onChange={setRichText}
                  extendStyle="mb-6 h-[200px] pb-3"
                />
              )}
            </ClientOnly>

            <input
              hidden
              readOnly
              name="dropshipSKU"
              value={product.dropshipSKU}
            />

            <input
              hidden
              readOnly
              name="dropshipURL"
              value={product.dropshipURL}
            />
          </TabContent>

          <TabContent tab="variants" activeTab={activeTab} extendStyle="gap-3">
            <BasicTable
              size="md"
              mobileSize="xs"
              onRowClick={(_, index) =>
                setProductVariants((prevProductVariants) => {
                  const updatedVariants = prevProductVariants.filter(
                    (_, i) => i !== index,
                  );
                  return updatedVariants;
                })
              }
              objectArray={productVariants?.map(
                (e: AliExpress_ProductVariant) => ({
                  color: e.color,
                  size: e.size,
                  price: e.price,
                  quantity: e.quantity,
                }),
              )}
            />

            <input
              hidden
              readOnly
              name="variants"
              value={JSON.stringify(productVariants) || ""}
            />
          </TabContent>

          <TabContent tab="images" activeTab={activeTab} extendStyle="gap-3">
            <ClientOnly fallback={<div id="skeleton" />}>
              {() => (
                <UploadMultipleImages
                  defaultImages={
                    dropshipProductResult?.item.images.map(
                      (imageSrc: string, index: number) => ({
                        href: imageSrc,
                        altText:
                          dropshipProductResult.item.title + "_image_" + index,
                      }),
                    ) as Image[]
                  }
                />
              )}
            </ClientOnly>
          </TabContent>

          <TabContent tab="shipping" activeTab={activeTab} extendStyle="gap-3">
            <>
              <BasicInput
                name="length"
                label="Length (cm)"
                placeholder="Length"
                extendContainerStyle="w-full"
                type="number"
                defaultValue={shippingDimensions?.length || ""}
              />

              <BasicInput
                name="width"
                label="Width (cm)"
                placeholder="Width"
                extendContainerStyle="w-full"
                type="number"
                defaultValue={shippingDimensions?.width || ""}
              />

              <BasicInput
                name="height"
                label="Height (cm)"
                placeholder="Height"
                extendContainerStyle="w-full"
                type="number"
                defaultValue={shippingDimensions?.height || ""}
              />

              <BasicInput
                name="weight"
                label="Weight (kg)"
                placeholder="Weight"
                extendContainerStyle="w-full"
                type="number"
                decimals={2}
                defaultValue={shippingDimensions?.weight || ""}
              />

              <BasicToggle
                label="Is Fragile"
                defaultValue={shippingDimensions?.fragile || false}
              />

              <input
                hidden
                readOnly
                name="shippingDimensions"
                value={JSON.stringify(shippingDimensions) || ""}
              />
            </>
          </TabContent>

          <BackSubmitButtons loading={loading} setLoading={setLoading} />
        </Form>
      </WindowContainer>
    </DarkOverlay>
  );
};

export default DropshipProductUpsert;
