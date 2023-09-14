import { useState } from "react";
import { getDepartments } from "~/models/departments.server";
import { getArticleCategories } from "~/models/articleCategories.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import SelectDepartment from "~/components/Forms/Select/SelectDepartment";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";
import {
  getProductCategory,
  upsertProductCategory,
} from "~/models/productCategories.server";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.id;
  const productCategory = id && id !== "add" && (await getProductCategory(id));
  const departments = await getDepartments();
  const productSubCategories = await getProductSubCategories(true);
  const articleCategories = await getArticleCategories();

  return {
    productCategory,
    departments,
    productSubCategories,
    articleCategories,
  };
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { name, department, articleCategories, productSubCategories } = form;

  switch (form._action) {
    case "upsert":
      const categoryData = {
        name: name as string,
        department: department as string,
        productSubCategories:
          productSubCategories && JSON.parse(productSubCategories as string),
        articleCategories:
          articleCategories && JSON.parse(articleCategories as string),
        id: id,
      };

      await upsertProductCategory(categoryData);

      return redirect("/admin/product-categories");

    case "delete":
  }
};

const ModifyProductCategory = () => {
  const {
    productCategory,
    departments,
    productSubCategories,
    articleCategories,
  } = useLoaderData() || {};
  const { statusText } = (useActionData() as { statusText: string }) || {};
  const mode = productCategory ? "edit" : "add";

  const [selectedProductSubCategories, setSelectedProductSubCategories] =
    useState<string[]>(
      productCategory?.productSubCategories?.map(
        (e: ProductSubCategory) => e?.name
      ) || []
    );
  const [selectedArticleCategories, setSelectedArticleCategories] = useState<
    string[]
  >(
    productCategory?.articleCategories?.map((e: ArticleCategory) => e?.name) ||
      []
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

  return (
    <DarkOverlay>
      <Form
        method="POST"
        className="relative max-w-full rounded-none bg-base-200 px-0 py-6 sm:rounded-md sm:px-6"
      >
        <FormHeader
          hasDelete={false}
          hasIsActive={false}
          mode={mode}
          type="Category"
          valueToChange={productCategory}
        />

        <div className="form-control gap-3">
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
                defaultValue={productCategory?.name || ""}
              />
            </div>

            <SelectDepartment
              departments={departments}
              defaultValue={productCategory?.department?.id.toString()}
            />
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Categories</span>
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

        {statusText && (
          <p className="pt-6 text-center text-sm text-red-500/75">
            {statusText}
          </p>
        )}

        <BackSubmitButtons loading={loading} setLoading={setLoading} />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyProductCategory;
