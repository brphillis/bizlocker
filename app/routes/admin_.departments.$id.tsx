import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {} from "~/models/productSubCategories.server";
import { useEffect, useState } from "react";
import { getDepartment, upsertDepartment } from "~/models/departments.server";
import { HiTrash } from "react-icons/hi2";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params?.id;
  const department = id && id !== "add" && (await getDepartment(id));
  if (department) {
    return department;
  } else return null;
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { name, isActive, index, displayInNavigation, productCategories } =
    form;

  let validationError: string[] = [];

  if (!name) {
    validationError.push("Name is Required");
  }

  if (validationError.length > 0) {
    return { validationError };
  }

  switch (form._action) {
    case "upsert":
      if (!name || name.length < 3) {
        const validationError = "name must be at least 3 chars.";
        return { validationError };
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
  const { validationError, success } =
    (useActionData() as { success: boolean; validationError: string[] }) || {};
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
        className="relative min-w-[400px] max-w-full rounded-none bg-base-200 px-6 py-6 max-sm:w-full sm:rounded-md"
      >
        <FormHeader
          valueToChange={department}
          type="Department"
          mode={mode}
          hasIsActive={true}
          hasDelete={false}
        />

        <div className="form-control min-w-[400px] gap-3 max-sm:min-w-full">
          <div className="flex flex-wrap justify-evenly gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Name"
                className="input input-bordered w-[95vw] sm:w-[215px]"
                defaultValue={department?.name || ""}
              />
            </div>

            <div className="w-[95vw] sm:w-[215px]"></div>
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Index</span>
              </label>
              <input
                name="index"
                type="number"
                placeholder="Index"
                className="input input-bordered w-[95vw] sm:w-[215px]"
                defaultValue={department?.index || 0}
              />
            </div>

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

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          validationErrors={validationError}
        />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyDepartment;
