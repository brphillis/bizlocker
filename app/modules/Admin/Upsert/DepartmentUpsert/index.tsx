import { type FormEvent, useEffect, useState } from "react";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
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
import type { departmentUpsertLoader } from "./index.server";

const validateOptions = {
  name: true,
  index: true,
};

type Props = {
  offRouteModule?: boolean;
};

const DepartmentUpsert = ({ offRouteModule }: Props) => {
  const { department, productCategories } =
    useLoaderData<typeof departmentUpsertLoader>();

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
        isActive={department?.isActive}
        title="Department"
        children={
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className="scrollbar-hide relative w-[500px] max-w-full overflow-y-auto"
          >
            <BasicInput
              label="Name"
              type="text"
              name="name"
              placeholder="Name"
              extendContainerStyle="w-full"
              defaultValue={department?.name || ""}
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
              defaultValue={department?.index || 0}
              validationErrors={
                serverValidationErrors || clientValidationErrors
              }
            />

            <div className="form-control w-full">
              <label className="label text-sm">In Navigation</label>
              <select
                name="displayInNavigation"
                className="select w-full text-brand-black/75"
                defaultValue={department?.displayInNavigation ? "true" : ""}
              >
                <option value="true">Yes</option>
                <option value="">No</option>
              </select>
            </div>

            {productCategories && (
              <BasicMultiSelect
                name="productCategories"
                label="Categories"
                extendContainerStyle="w-full"
                selections={productCategories.filter(
                  (e) => !e.departmentId || e.departmentId === department.id,
                )}
                defaultValues={department?.productCategories}
              />
            )}

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

export default DepartmentUpsert;
