import { useEffect, useState } from "react";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { tokenAuth } from "~/auth.server";
import { validateForm } from "~/utility/validate";
import { STAFF_SESSION_KEY } from "~/session.server";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import BasicInput from "~/components/Forms/Input/BasicInput";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import {
  type NewDepartment,
  getDepartment,
  upsertDepartment,
  type DepartmentWithDetails,
} from "~/models/departments.server";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";

import "~/models/productSubCategories.server";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";
import { getProductCategories } from "~/models/productCategories.server";
import useNotification, {
  type PageNotification,
} from "~/hooks/PageNotification";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params?.id;

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

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());

  const { name, isActive, index, displayInNavigation, productCategories } =
    form;

  let notification: PageNotification;

  switch (form._action) {
    case "upsert":
      const validate = {
        name: true,
        index: true,
      };

      const validationErrors = validateForm(form, validate);
      if (validationErrors) {
        return json({ validationErrors });
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

const ModifyDepartment = () => {
  const { department, productCategories } = useLoaderData<typeof loader>();

  const { validationErrors, success, notification } =
    (useActionData() as ActionReturnTypes) || {};

  const navigate = useNavigate();
  useNotification(notification);

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
        className="scrollbar-hide relative w-[500px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
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
          validationErrors={validationErrors}
        />

        <BasicInput
          label="Index"
          type="number"
          name="index"
          placeholder="Index"
          customWidth="w-full"
          defaultValue={department?.index || 0}
          validationErrors={validationErrors}
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
          validationErrors={validationErrors}
        />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyDepartment;
