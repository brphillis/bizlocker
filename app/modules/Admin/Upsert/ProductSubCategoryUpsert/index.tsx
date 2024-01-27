import { type FormEvent, useEffect, useState } from "react";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification from "~/hooks/PageNotification";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
  useParams,
} from "@remix-run/react";
import WindowContainer, {
  handleWindowedFormData,
} from "~/components/Layout/Containers/WindowContainer";
import type { productSubCategoryUpsertLoader } from "./index.server";
import TabContent from "~/components/Tabs/TabContent";
import UploadImageCollapse from "~/components/Forms/Upload/UploadImageCollapse";
import SelectGender from "~/components/Forms/Select/SelectGender";

const validateOptions = {
  name: true,
  index: true,
};

type Props = {
  offRouteModule?: boolean;
};

const ProductSubCategoryUpsert = ({ offRouteModule }: Props) => {
  const { productSubCategory, productCategories } =
    useLoaderData<typeof productSubCategoryUpsertLoader>();
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
  const [loading, setLoading] = useState<boolean>(false);

  const tabNames = ["general", "images"];
  const [activeTab, setActiveTab] = useState<string | undefined>(tabNames?.[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    let form = getFormData(event);
    event.preventDefault();

    form = handleWindowedFormData(form);

    const { formErrors } = validateForm(new FormData(form), validateOptions);
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
  };

  useEffect(() => {
    if (success) {
      navigate(-1);
    }
  }, [success, navigate]);

  return (
    <DarkOverlay>
      <WindowContainer
        hasIsActive={true}
        isActive={productSubCategory?.isActive}
        title="Category"
        setActiveTab={handleTabChange}
        tabNames={tabNames}
        activeTab={activeTab}
      >
        <Form
          method="POST"
          onSubmit={handleSubmit}
          className="scrollbar-hide relative w-[600px] max-w-full overflow-y-auto"
        >
          <TabContent tab="general" activeTab={activeTab} extendStyle="gap-3">
            <BasicInput
              label="Name"
              type="text"
              name="name"
              placeholder="Name"
              extendContainerStyle="w-full"
              defaultValue={productSubCategory?.name || ""}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <BasicInput
              label="Index"
              type="number"
              name="index"
              placeholder="Index"
              extendContainerStyle="w-full"
              defaultValue={productSubCategory?.index || 0}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <BasicSelect
              name="displayInNavigation"
              label="Display In Navigation"
              selections={[
                { id: "yes", name: "Yes" },
                { id: "no", name: "No" },
              ]}
              placeholder="Display In Navigation"
              extendContainerStyle="w-full"
              defaultValue={
                productSubCategory?.displayInNavigation ? "yes" : "no"
              }
            />

            <BasicSelect
              name="productCategory"
              label="Category"
              selections={productCategories}
              placeholder="Parent Category"
              extendContainerStyle="w-full"
              defaultValue={productSubCategory.productCategoryId?.toString()}
            />

            <SelectGender
              defaultValue={productSubCategory?.gender}
              label="Gender"
              extendContainerStyle="w-full"
            />
          </TabContent>

          <TabContent tab="images" activeTab={activeTab} extendStyle="gap-3">
            <UploadImageCollapse
              name="image"
              label="Tile Image"
              tooltip="Optimal Square Image"
              defaultValue={productSubCategory?.image}
            />

            <UploadImageCollapse
              name="maleImage"
              label="Male Image"
              tooltip="Optimal Square Image"
              defaultValue={productSubCategory?.maleImage}
            />

            <UploadImageCollapse
              name="femaleImage"
              label="Female Image"
              tooltip="Optimal Square Image"
              defaultValue={productSubCategory?.femaleImage}
            />

            <UploadImageCollapse
              name="kidImage"
              label="Kid Image"
              tooltip="Optimal Square Image"
              defaultValue={productSubCategory?.kidImage}
            />
          </TabContent>

          <BackSubmitButtons
            loading={loading}
            setLoading={setLoading}
            validationErrors={serverValidationErrors || clientValidationErrors}
          />
        </Form>
      </WindowContainer>
    </DarkOverlay>
  );
};

export default ProductSubCategoryUpsert;
