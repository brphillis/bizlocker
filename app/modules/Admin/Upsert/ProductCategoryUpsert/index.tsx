import { type FormEvent, useEffect, useState } from "react";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
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
import type { productCategoryUpsertLoader } from "./index.server";

const validateOptions = {
  name: true,
  department: true,
  index: true,
};

type Props = {
  offRouteModule?: boolean;
};

const ProductCategoryUpsert = ({ offRouteModule }: Props) => {
  const { productCategory, departments, productSubCategories } =
    useLoaderData<typeof productCategoryUpsertLoader>();

  const { success, serverValidationErrors, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  let submit = useSubmit();
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get("contentId");
  const { contentType } = useParams();
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

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
        hasMode={true}
        isActive={productCategory?.isActive}
        title="Category"
        children={
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[500px] max-w-full overflow-y-auto"
          >
            <div className="form-control gap-3">
              <BasicInput
                name="name"
                label="Name"
                placeholder="Name"
                extendContainerStyle="w-full"
                type="text"
                defaultValue={productCategory?.name || ""}
                validationErrors={
                  serverValidationErrors || clientValidationErrors
                }
              />

              <BasicSelect
                name="department"
                label="Department"
                selections={departments}
                placeholder="Department"
                extendContainerStyle="w-full"
                defaultValue={productCategory?.department?.id.toString()}
                validationErrors={
                  clientValidationErrors || serverValidationErrors
                }
              />

              <BasicInput
                label="Index"
                type="number"
                name="index"
                placeholder="Index"
                extendContainerStyle="w-full"
                defaultValue={productCategory?.index || 100}
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
                  productCategory?.displayInNavigation ? "yes" : "no"
                }
              />

              {productSubCategories && (
                <BasicMultiSelect
                  name="productSubCategories"
                  label="Sub Categories"
                  extendContainerStyle="w-full"
                  selections={productSubCategories.filter(
                    (e: any) =>
                      !e.productCategoryId ||
                      e.productCategoryId === productCategory?.id,
                  )}
                  defaultValues={productCategory?.productSubCategories}
                />
              )}
            </div>

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
  );
};

export default ProductCategoryUpsert;
