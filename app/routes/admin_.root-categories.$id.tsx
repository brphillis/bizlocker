import { useState } from "react";
import { capitalizeFirst } from "~/utility/stringHelpers";
import { getDepartments } from "~/models/departments.server";
import { getArticleCategories } from "~/models/articleCategories.server";
import { getProductCategories } from "~/models/productCategories.server";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import {
  getRootCategory,
  upsertRootCategory,
} from "~/models/rootCategories.server";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.id;
  const rootCategory = id && id !== "add" && (await getRootCategory(id));
  const departments = await getDepartments();
  const productCategories = await getProductCategories();
  const articleCategories = await getArticleCategories();

  return {
    rootCategory,
    departments,
    productCategories,
    articleCategories,
  };
};

export const action = async ({ request, params }: ActionArgs) => {
  const id = params.id === "add" ? undefined : params.id;
  const form = Object.fromEntries(await request.formData());
  const { name, department, articleCategories, productCategories } = form;
  switch (form._action) {
    case "upsert":
      const categoryData = {
        name: name?.toString(),
        departmentName: department?.toString(),
        productCategories:
          productCategories && JSON.parse(productCategories.toString()),
        articleCategories:
          articleCategories && JSON.parse(articleCategories.toString()),
        id: id,
      };

      await upsertRootCategory(categoryData);

      return redirect("/admin/root-categories");

    case "delete":
  }
};

const ModifyRootCategory = () => {
  const navigate = useNavigate();
  const { rootCategory, departments, productCategories, articleCategories } =
    (useLoaderData() as {
      rootCategory: RootCategory;
      departments: Department[];
      productCategories: ProductCategory[];
      articleCategories: ArticleCategory[];
    }) || {};
  const { statusText } = (useActionData() as { statusText: string }) || {};
  const mode = rootCategory ? "edit" : "add";

  const [selectedProductCategories, setSelectedProductCategories] = useState<
    string[]
  >(rootCategory?.productCategories?.map((e) => e?.name) || []);
  const [selectedArticleCategories, setSelectedArticleCategories] = useState<
    string[]
  >(rootCategory?.articleCategories?.map((e) => e?.name) || []);

  const handleProductCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: HTMLOptionElement) => option.value
    );
    setSelectedProductCategories(selectedOptions);
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

  return (
    <div className="absolute inset-0 flex h-[100vh] w-[100vw] flex-col items-center justify-center bg-black/80">
      <Form
        method="POST"
        className="relative max-h-[calc(100vh-64px)] max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <div className="flex flex-row justify-between">
          <h1>{mode && capitalizeFirst(mode)} Category</h1>
        </div>
        <div className="divider w-full" />
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
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={rootCategory?.name || ""}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Department</span>
              </label>
              <select
                name="department"
                className="select-bordered select w-[95vw] sm:w-[215px]"
                defaultValue={rootCategory?.department?.name}
                onChange={(e) =>
                  (rootCategory.department.name = e.target.value)
                }
              >
                {!departments && (
                  <option disabled value="">
                    No Departments
                  </option>
                )}
                {departments?.map(({ id, name }: Department) => {
                  return (
                    <option key={"department-" + id} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Categories</span>
              </label>
              <select
                className="select-bordered select !h-40 w-[95vw] sm:w-[215px]"
                onChange={handleProductCategoryChange}
                value={selectedProductCategories}
                multiple
              >
                {!productCategories && (
                  <option disabled value="">
                    No Product Categories
                  </option>
                )}
                {productCategories?.map(
                  ({
                    id,
                    name,
                    rootCategory: parentRootCategory,
                  }: ProductCategory) => {
                    const isAssignedToThis =
                      rootCategory?.productCategories?.some(
                        (e) => e.name === name
                      );
                    const isAssigned = parentRootCategory?.productCategories;

                    if (isAssignedToThis || !isAssigned) {
                      return (
                        <option key={"productCategory-" + id} value={name}>
                          {name}
                        </option>
                      );
                    } else {
                      return (
                        <option
                          key={"productCategory-" + id + "disabled"}
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
                name="productCategories"
                value={JSON.stringify(selectedProductCategories) || ""}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Article Categories</span>
              </label>
              <select
                className="select-bordered select !h-40 w-[95vw] sm:w-[215px]"
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
                    rootCategory: parentRootCategory,
                  }: ArticleCategory) => {
                    const isAssignedToThis =
                      rootCategory?.articleCategories?.some(
                        (e) => e.name === name
                      );
                    const isAssigned = parentRootCategory?.articleCategories;

                    if (isAssignedToThis || !isAssigned) {
                      return (
                        <option key={"articleCategory-" + id} value={name}>
                          {name}
                        </option>
                      );
                    } else {
                      return (
                        <option
                          key={"articleCategory-" + id + "disabled"}
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

        <div className="flex flex-row items-center justify-center gap-2">
          <button
            type="button"
            className="btn-primary btn mt-6 w-max"
            onClick={() => navigate("..")}
          >
            Back
          </button>
          <button
            type="submit"
            name="_action"
            value="upsert"
            className="btn-primary btn mt-6 w-max"
          >
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
};

export default ModifyRootCategory;
