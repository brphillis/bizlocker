import Pagination from "~/components/Pagination";
import { redirect, type LoaderFunctionArgs } from "@remix-run/server-runtime";
import CategorySort from "~/components/Sorting/CategorySort";
import { getDepartments } from "~/models/departments.server";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import {
  searchProductCategories,
  type ProductCategory,
} from "~/models/productCategories.server";
import { getProductSubCategories } from "~/models/productSubCategories.server";
import { json } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const { productCategories, totalPages } = await searchProductCategories(
    undefined,
    url
  );
  const departments = await getDepartments();
  const productSubCategories = await getProductSubCategories();

  return json({
    productCategories,
    totalPages,
    departments,
    productSubCategories,
  });
};

const ManageProductCategories = () => {
  const { productCategories, totalPages, productSubCategories, departments } =
    useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form
        method="GET"
        className="relative h-full w-full rounded-none bg-base-200 p-6"
      >
        <AdminPageHeader
          title="Manage Categories"
          addButtonText="Add Category"
        />

        <AdminContentSearch
          name={true}
          departments={departments}
          productSubCategories={productSubCategories}
        />

        <div className="divider w-full" />

        <CategorySort />

        {productCategories && productCategories.length > 0 && (
          <BasicTable
            currentPage={currentPage}
            objectArray={productCategories?.map((e: ProductCategory) => ({
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

export default ManageProductCategories;
