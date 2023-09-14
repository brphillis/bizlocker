import DarkOverlay from "~/components/Layout/DarkOverlay";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {} from "~/models/productSubCategories.server";
import { useState } from "react";
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
  const { name, isActive, productCategories } = form;

  switch (form._action) {
    case "upsert":
      if (!name || name.length < 3) {
        const validationError = "name must be at least 3 chars.";
        return { validationError };
      }

      const departmentData = {
        name: name as string,
        isActive: isActive ? true : false,
        productCategories:
          productCategories && JSON.parse(productCategories as string),
        id: id,
      };

      await upsertDepartment(departmentData);
      return redirect("/admin/departments");
  }
};

const ModifyDepartment = () => {
  const department = useLoaderData();
  const { validationError } =
    (useActionData() as { validationError: string }) || {};
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
          <div className="form-control w-full max-w-xs ">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="Name"
              className="input input-bordered w-full max-w-xs"
              defaultValue={department?.name || undefined}
            />
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

          {validationError && (
            <p className="h-0 py-3 text-center text-sm text-red-500/75">
              {validationError}
            </p>
          )}
        </div>

        <BackSubmitButtons loading={loading} setLoading={setLoading} />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyDepartment;
