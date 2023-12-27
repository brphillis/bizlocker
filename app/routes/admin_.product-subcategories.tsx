import { type ProductSubCategory } from "@prisma/client";
import Pagination from "~/components/Pagination";
import {
  type LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/server-runtime";
import CategorySort from "~/components/Sorting/CategorySort";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import { getProductCategories } from "~/models/productCategories.server";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import { searchProductSubCategories } from "~/models/productSubCategories.server";
import { Form, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import BasicTable from "~/components/Tables/BasicTable";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const { productSubCategories, totalPages } = await searchProductSubCategories(
    undefined,
    url
  );

  const productCategories = await getProductCategories();

  return json({ productSubCategories, productCategories, totalPages });
};

const ProductSubCategories = () => {
  const { productSubCategories, productCategories, totalPages } =
    useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Product Sub Categories"
          addButtonText="Add Product Sub Category"
        />

        <div className="mt-3 flex w-full flex-wrap items-end gap-6">
          <BasicInput
            label="Sub Category Name"
            type="text"
            name="name"
            placeholder="Name"
          />

          <BasicSelect
            name="productCategory"
            label="Category"
            selections={productCategories}
            placeholder="Category"
          />
        </div>

        <div className="flex flex-row justify-end sm:justify-start">
          <button
            type="submit"
            className="btn btn-primary mt-6 w-max !rounded-sm"
          >
            Search
          </button>
        </div>

        <div className="divider w-full" />

        <CategorySort />

        {productSubCategories && productSubCategories.length > 0 && (
          <BasicTable
            currentPage={currentPage}
            objectArray={productSubCategories?.map((e: ProductSubCategory) => ({
              id: e.id,
              name: e.name,
              index: e.index,
              navigation: e.displayInNavigation,
              active: e.isActive,
            }))}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ProductSubCategories;
