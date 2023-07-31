import { useState } from "react";
import { getDepartments } from "~/models/departments.server";
import { getArticleCategories } from "~/models/articleCategories.server";
import { getProductCategories } from "~/models/productCategories.server";
import { redirect, type ActionArgs, type LoaderArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  getRootCategory,
  upsertRootCategory,
} from "~/models/rootCategories.server";
import SelectDepartment from "~/components/Forms/Select/SelectDepartment";
import FormHeader from "~/components/Forms/Headers/FormHeader";
import DarkOverlay from "~/components/Layout/DarkOverlay";
import BackSubmitButtons from "~/components/Forms/Buttons/BackSubmitButtons";

export const loader = async ({ params }: LoaderArgs) => {
  const id = params.id;
  const rootCategory = id && id !== "add" && (await getRootCategory(id));
  const departments = await getDepartments();
  const productCategories = await getProductCategories(true);
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
        name: name as string,
        department: department as string,
        productCategories:
          productCategories && JSON.parse(productCategories as string),
        articleCategories:
          articleCategories && JSON.parse(articleCategories as string),
        id: id,
      };

      await upsertRootCategory(categoryData);

      return redirect("/admin/root-categories");

    case "delete":
  }
};

const ModifyRootCategory = () => {
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
          valueToChange={rootCategory}
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
                className="input-bordered input w-[95vw] sm:w-[215px]"
                defaultValue={rootCategory?.name || ""}
              />
            </div>

            <SelectDepartment
              departments={departments}
              defaultValue={rootCategory?.department?.id.toString()}
            />
          </div>

          <div className="flex flex-wrap justify-evenly gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Product Categories</span>
              </label>
              <select
                className=" select !h-40 w-[95vw] sm:w-[215px]"
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
                      rootCategory?.productCategories?.some((e) => e.id === id);
                    const isAssigned = parentRootCategory?.productCategories;

                    if (isAssignedToThis || !isAssigned) {
                      return (
                        <option key={"productCategory-" + name} value={id}>
                          {name}
                        </option>
                      );
                    } else {
                      return (
                        <option
                          key={"productCategory-" + name + "disabled"}
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
                    rootCategory: parentRootCategory,
                  }: ArticleCategory) => {
                    const isAssignedToThis =
                      rootCategory?.articleCategories?.some((e) => e.id === id);
                    const isAssigned = parentRootCategory?.articleCategories;

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

        <BackSubmitButtons />
      </Form>
    </DarkOverlay>
  );
};

export default ModifyRootCategory;
