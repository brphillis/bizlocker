import { useEffect, useState } from "react";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { validateForm } from "~/utility/validate";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import {
  type DepartmentWithDetails,
  getDepartments,
} from "~/models/departments.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import {
  type ArticleCategoryWithDetails,
  getArticleCategories,
} from "~/models/articleCategories.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import {
  type ProductSubCategoryWithDetails,
  getProductSubCategories,
} from "~/models/productSubCategories.server";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  type ProductCategoryWithDetails,
  type NewProductCategory,
  getProductCategory,
  upsertProductCategory,
} from "~/models/productCategories.server";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import BasicMultiSelect from "~/components/Forms/Select/BasicMultiSelect";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params.id;

  const departments = await getDepartments();
  const productSubCategories = await getProductSubCategories();
  const articleCategories = await getArticleCategories();

  if (id === "add") {
    const productCategory = {};
    return json({ productCategory } as {
      productCategory: ProductCategoryWithDetails;
      departments: DepartmentWithDetails[];
      productSubCategories: ProductSubCategoryWithDetails[];
      articleCategories: ArticleCategoryWithDetails[];
    });
  }

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Product Category Not Found",
    });
  }

  const productCategory = await getProductCategory(id);

  return json({
    productCategory,
    departments,
    productSubCategories,
    articleCategories,
  });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const {
    name,
    index,
    department,
    displayInNavigation,
    isActive,
    articleCategories,
    productSubCategories,
  } = form;

  switch (form._action) {
    case "upsert":
      const validate = {
        name: true,
        index: true,
        department: true,
        productSubCategories: true,
      };

      const validationErrors = validateForm(form, validate);

      if (validationErrors) {
        return json({ validationErrors });
      }

      const categoryData: NewProductCategory = {
        name: name as string,
        index: parseInt(index as string),
        department: department as string,
        displayInNavigation: displayInNavigation ? true : false,
        isActive: isActive ? true : false,
        productSubCategories:
          productSubCategories && JSON.parse(productSubCategories as string),
        articleCategories:
          articleCategories && JSON.parse(articleCategories as string),
        id: id,
      };

      await upsertProductCategory(categoryData);

      return json({ success: true });
  }
};

const ModifyProductCategory = () => {
  const navigate = useNavigate();
  const { productCategory, departments, productSubCategories } =
    useLoaderData<typeof loader>();

  const { success, validationErrors } =
    (useActionData() as ActionReturnTypes) || {};

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
          hasDelete={false}
          hasIsActive={true}
          type="Category"
          valueToChange={productCategory}
        />

        <div className="form-control gap-3">
          <BasicInput
            name="name"
            label="Name"
            placeholder="Name"
            customWidth="w-full"
            type="text"
            defaultValue={productCategory?.name || ""}
            validationErrors={validationErrors}
          />

          <BasicSelect
            name="department"
            label="Department"
            selections={departments}
            placeholder="Department"
            customWidth="w-full"
            defaultValue={productCategory?.department?.id.toString()}
          />

          <BasicInput
            label="Index"
            type="number"
            name="index"
            placeholder="Index"
            customWidth="w-full"
            defaultValue={productCategory?.index || 0}
            validationErrors={validationErrors}
          />

          <BasicSelect
            name="displayInNavigation"
            label="Display In Navigation"
            selections={[
              { id: "yes", name: "Yes" },
              { id: "no", name: "No" },
            ]}
            placeholder="Display In Navigation"
            customWidth="w-full"
            defaultValue={productCategory?.displayInNavigation ? "yes" : "no"}
          />

          {productSubCategories && (
            <BasicMultiSelect
              name="productSubCategories"
              label="Sub Categories"
              customWidth="w-full"
              selections={productSubCategories.filter(
                (e) =>
                  !e.productCategoryId ||
                  e.productCategoryId === productCategory?.id
              )}
              defaultValues={productCategory?.productSubCategories}
            />
          )}
        </div>

        <BackSubmitButtons
          loading={loading}
          setLoading={setLoading}
          validationErrors={validationErrors}
        />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyProductCategory;
