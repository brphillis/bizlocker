import { type FormEvent, useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { getFormData } from "~/helpers/formHelpers";
import DarkOverlay from "~/components/Layout/Overlays/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import WindowTitleBar from "~/components/Layout/TitleBars/WindowTitleBar";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { type ValidationErrors, validateForm } from "~/utility/validate";
import { getProductCategories } from "~/models/productCategories.server";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";
import {
  Form,
  type Params,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
  useSearchParams,
} from "@remix-run/react";
import {
  getDepartment,
  type DepartmentWithDetails,
  type NewDepartment,
  upsertDepartment,
} from "~/models/departments.server";

import "~/models/productSubCategories.server";

const validateOptions = {
  name: true,
  department: true,
  discountPercentage: true,
  bannerImage: true,
  tileImage: true,
};

export const departmentUpsertLoader = async (
  request: Request,
  params: Params<string>
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Department Not Found",
    });
  }

  const department =
    id === "add" ? ({} as DepartmentWithDetails) : await getDepartment(id);

  if (!department) {
    throw new Response(null, {
      status: 404,
      statusText: "Department Not Found",
    });
  }

  const productCategories = await getProductCategories();

  return json({ department, productCategories });
};

export const departmentUpsertAction = async (
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

  const { name, isActive, index, displayInNavigation, productCategories } =
    formEntries;

  switch (formEntries._action) {
    case "upsert":
      if (formErrors) {
        return { serverValidationErrors: formErrors };
      }
      const departmentData: NewDepartment = {
        name: name as string,
        index: parseInt(index as string),
        isActive: isActive ? true : false,
        displayInNavigation: displayInNavigation ? true : false,
        productCategories:
          productCategories && JSON.parse(productCategories as string),
        id: id,
      };

      await upsertDepartment(departmentData);

      notification = {
        type: "success",
        message: `Department ${id === "add" ? "Added" : "Updated"}.`,
      };

      return json({ success: true, notification });
  }
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
  useNotification(notification);

  const [clientValidationErrors, setClientValidationErrors] =
    useState<ValidationErrors>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const form = getFormData(event);
    event.preventDefault();

    const { formErrors } = validateForm(new FormData(form), validateOptions);
    if (formErrors) {
      setClientValidationErrors(formErrors);
      setLoading(false);
      return;
    }

    const submitFunction = () => {
      submit(form, {
        method: "POST",
        action: `/admin/upsert/department?contentId=${contentId}`,
        navigate: offRouteModule ? false : true,
      });
    };

    submitFunction();

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
      <Form
        method="POST"
        onSubmit={handleSubmit}
        className="scrollbar-hide relative w-[500px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <WindowTitleBar
          valueToChange={department}
          type="Department"
          hasIsActive={true}
          hasDelete={false}
        />

        <BasicInput
          label="Name"
          type="text"
          name="name"
          placeholder="Name"
          customWidth="w-full"
          defaultValue={department?.name || ""}
          validationErrors={serverValidationErrors || clientValidationErrors}
        />

        <BasicInput
          label="Index"
          type="number"
          name="index"
          placeholder="Index"
          customWidth="w-full"
          defaultValue={department?.index || 0}
          validationErrors={serverValidationErrors || clientValidationErrors}
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
            customWidth="w-full"
            selections={productCategories.filter(
              (e) => !e.departmentId || e.departmentId === department.id
            )}
            defaultValues={department?.productCategories}
          />
        )}

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          validationErrors={serverValidationErrors || clientValidationErrors}
        />
      </Form>
    </DarkOverlay>
  );
};

export default DepartmentUpsert;
