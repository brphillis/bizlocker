import { useEffect, useState } from "react";
import { validateForm } from "~/utility/validate";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import { getDepartments } from "~/models/departments.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { getArticleCategories } from "~/models/articleCategories.server";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  getProductCategory,
  upsertProductCategory,
} from "~/models/productCategories.server";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const loader = async ({ request, params }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const id = params.id;
  const productCategory = id && id !== "add" && (await getProductCategory(id));
  const departments = await getDepartments();
  const productSubCategories = await getProductSubCategories();
  const articleCategories = await getArticleCategories();

  return {
    productCategory,
    departments,
    productSubCategories,
    articleCategories,
  };
};

export const action = async ({ request, params }: ActionArgs) => {
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
        articleCategories: true,
        productSubCategories: true,
      };

      const validationErrors = validateForm(form, validate);
      if (validationErrors) {
        return { validationErrors };
      }

      const categoryData = {
        name: name as string,
        index: parseInt(index as string),
        department: department as string,
        displayInNavigation: displayInNavigation ? true : false,
        isActive: id ? (isActive ? true : false) : false,
        productSubCategories:
          productSubCategories && JSON.parse(productSubCategories as string),
        articleCategories:
          articleCategories && JSON.parse(articleCategories as string),
        id: id,
      };

      await upsertProductCategory(categoryData);

      return { success: true };
  }
};

const ModifyProductCategory = () => {
  const navigate = useNavigate();
  const {
    productCategory,
    departments,
    productSubCategories,
    articleCategories,
  } = useLoaderData() || {};
  const { success, validationErrors } =
    (useActionData() as {
      success: boolean;
      validationErrors: ValidationErrors;
    }) || {};

  const mode = productCategory ? "edit" : "add";

  const [selectedProductSubCategories, setSelectedProductSubCategories] =
    useState<string[]>(
      productCategory?.productSubCategories?.map((e: ProductSubCategory) =>
        e?.id.toString()
      ) || []
    );
  const [selectedArticleCategories, setSelectedArticleCategories] = useState<
    string[]
  >(
    productCategory?.articleCategories?.map((e: ArticleCategory) =>
      e?.id.toString()
    ) || []
  );

  const handleProductSubCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value
    );
    setSelectedProductSubCategories(selectedOptions);
  };

  const handleArticleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value
    );
    setSelectedArticleCategories(selectedOptions);
  };

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
          mode={mode}
          type="Category"
          valueToChange={productCategory}
        />

        <div className="form-control gap-3">
          <div className="flex flex-wrap justify-evenly gap-3">
            <BasicInput
              name="name"
              label="Name"
              placeholder="Name"
              type="text"
              defaultValue={productCategory?.name || ""}
              validationErrors={validationErrors}
            />

            <BasicSelect
              name="department"
              label="Department"
              selections={departments}
              placeholder="Department"
              defaultValue={productCategory?.department?.id.toString()}
            />
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <BasicInput
              label="Index"
              type="number"
              name="index"
              placeholder="Index"
              defaultValue={productCategory?.index || 0}
              validationErrors={validationErrors}
            />

            <div className="form-control w-full sm:w-[215px]">
              <label className="label text-sm">In Navigation</label>
              <select
                name="displayInNavigation"
                className="select w-full text-brand-black/75"
                defaultValue={productCategory.displayInNavigation ? "true" : ""}
              >
                <option value="true">Yes</option>
                <option value="">No</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sub Categories</span>
              </label>
              <select
                className=" select !h-40 w-[95vw] sm:w-[215px]"
                onChange={handleProductSubCategoryChange}
                value={selectedProductSubCategories}
                multiple
              >
                {!productSubCategories && (
                  <option disabled value="">
                    No Product Categories
                  </option>
                )}
                {productSubCategories?.map(
                  ({
                    id,
                    name,
                    productCategory: parentProductCategory,
                  }: ProductSubCategory) => {
                    const isAssignedToThis =
                      productCategory?.productSubCategories?.some(
                        (e: ProductSubCategory) => e.id === id
                      );
                    const isAssigned =
                      parentProductCategory?.productSubCategories;

                    if (isAssignedToThis || !isAssigned) {
                      return (
                        <option key={"productSubCategory-" + name} value={id}>
                          {name}
                        </option>
                      );
                    } else {
                      return (
                        <option
                          key={"productSubCategory-" + name + "disabled"}
                          value={name}
                          disabled
                        >
                          {name}
                        </option>
                      );
                    }
                  }
                )}
              </select>
              <input
                hidden
                readOnly
                name="productSubCategories"
                value={JSON.stringify(selectedProductSubCategories) || ""}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Article Categories</span>
              </label>
              <select
                className=" select !h-40 w-[95vw] sm:w-[215px]"
                onChange={handleArticleCategoryChange}
                value={selectedArticleCategories}
                multiple
              >
                {!articleCategories && (
                  <option disabled value="">
                    No Article Categories
                  </option>
                )}
                {articleCategories?.map(
                  ({
                    id,
                    name,
                    productCategory: parentProductCategory,
                  }: ArticleCategory) => {
                    const isAssignedToThis =
                      productCategory?.articleCategories?.some(
                        (e: ArticleCategory) => e.id === id
                      );
                    const isAssigned = parentProductCategory?.articleCategories;

                    if (isAssignedToThis || !isAssigned) {
                      return (
                        <option key={"articleCategory-" + name} value={id}>
                          {name}
                        </option>
                      );
                    } else {
                      return (
                        <option
                          key={"articleCategory-" + name + "disabled"}
                          value={name}
                          disabled
                        >
                          {name}
                        </option>
                      );
                    }
                  }
                )}
              </select>
              <input
                hidden
                readOnly
                name="articleCategories"
                value={JSON.stringify(selectedArticleCategories) || ""}
              />
            </div>
          </div>
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
