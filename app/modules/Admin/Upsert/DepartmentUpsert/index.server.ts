import { json } from "@remix-run/node";
import { validateForm } from "~/utility/validate";
import { PageNotification } from "~/hooks/PageNotification";
import { getProductCategories } from "~/models/ProductCategories/index.server";
import {
  DepartmentWithDetails,
  NewDepartment,
} from "~/models/Departments/types";
import {
  getDepartment,
  upsertDepartment,
} from "~/models/Departments/index.server";

const validateOptions = {
  name: true,
  index: true,
};

export const departmentUpsertLoader = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("contentId");

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

export const departmentUpsertAction = async (request: Request) => {
  let notification: PageNotification;

  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  const id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const { name, isActive, index, displayInNavigation, productCategories } =
    formEntries;

  switch (formEntries._action) {
    case "upsert": {
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
  }
};
