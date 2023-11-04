import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {} from "~/models/productSubCategories.server";
import { useEffect, useState } from "react";
import { getDepartment, upsertDepartment } from "~/models/departments.server";
import { HiTrash } from "react-icons/hi2";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { validateForm } from "~/utility/validate";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params?.id;
  const department = id && id !== "add" && (await getDepartment(id));
  if (department) {
    return department;
  } else return null;
};

export const action = async ({ request, params }: ActionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { name, isActive, index, displayInNavigation, productCategories } =
    form;

  switch (form._action) {
    case "upsert":
      const validate = {
        name: true,
        index: true,
        productCategories: true,
      };

      const validationErrors = validateForm(form, validate);
      if (validationErrors) {
        return { validationErrors };
      }

      const departmentData = {
        name: name as string,
        index: parseInt(index as string),
        isActive: isActive ? true : false,
        displayInNavigation: displayInNavigation ? true : false,
        productCategories:
          productCategories && JSON.parse(productCategories as string),
        id: id,
      };

      await upsertDepartment(departmentData);
      return { success: true };
  }
};

const ModifyDepartment = () => {
  const navigate = useNavigate();
  const department = useLoaderData();
  const { validationErrors, success } =
    (useActionData() as {
      success: boolean;
      validationErrors: ValidationErrors;
    }) || {};
  const mode = department ? "edit" : "add";

  const { productCategories } = department || {};
  const [currentProductCategories, setCurrentProductCategories] =
    useState<ProductCategory[]>(productCategories);

  const [loading, setLoading] = useState<boolean>(false);

  const removeProductCategory = (index: number) => {
    if (index >= 0 && index < currentProductCategories.length) {
      const newArray = [...currentProductCategories];
      newArray.splice(index, 1);
      setCurrentProductCategories(newArray);
    } else {
      console.error("Invalid index to remove.");
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
        className="scrollbar-hide relative w-[500px] max-w-[100vw] overflow-y-auto bg-base-200 px-3 py-6 sm:px-6"
      >
        <FormHeader
          valueToChange={department}
          type="Department"
          mode={mode}
          hasIsActive={true}
          hasDelete={false}
        />

        <div className="form-control min-w-[400px] gap-3 max-md:gap-0 max-sm:min-w-full">
          <div className="flex flex-wrap justify-evenly gap-3">
            <BasicInput
              label="Name"
              type="text"
              name="name"
              placeholder="Name"
              defaultValue={department?.name || ""}
              validationErrors={validationErrors}
            />

            <div className="w-full sm:w-[215px]"></div>
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <BasicInput
              label="Index"
              type="number"
              name="index"
              placeholder="Index"
              defaultValue={department?.index || 0}
              validationErrors={validationErrors}
            />

            <div className="form-control w-full sm:w-[215px]">
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
          </div>

          {department && currentProductCategories?.length > 0 && (
            <>
              <div className="divider m-0 w-full" />

              <div className="flex max-h-[400px] w-full flex-col items-center justify-center gap-1 overflow-y-auto">
                {currentProductCategories?.map(
                  ({ name }: ProductCategory, i: number) => {
                    return (
                      <div
                        key={"department_productCategory_" + name}
                        className="flex w-full items-center justify-between bg-base-300 p-3 text-brand-black"
                      >
                        <div>{name}</div>
                        <HiTrash
                          size={24}
                          className="cursor-pointer rounded-full bg-error p-[0.3rem] text-primary-content"
                          onClick={() => removeProductCategory(i)}
                        />
                      </div>
                    );
                  }
                )}
              </div>
            </>
          )}

          <input
            hidden
            readOnly
            name="productCategories"
            value={JSON.stringify(currentProductCategories) || ""}
          />
        </div>

        <BackSubmitButtons loading={loading} setLoading={setLoading} />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyDepartment;
