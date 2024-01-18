import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import type { PageNotification } from "~/hooks/PageNotification";
import { getProductCategories } from "~/models/productCategories.server";
import {
  getDepartment,
  type DepartmentWithDetails,
  type NewDepartment,
  upsertDepartment,
} from "~/models/departments.server";

const validateOptions = {
  name: true,
  index: true,
};

export const departmentUpsertLoader = async (
  request: Request,
  params: Params<string>,
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
  params: Params<string>,
) => {
  let notification: PageNotification;

  let { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  let id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
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
