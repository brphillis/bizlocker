import { tokenAuth } from "~/auth.server";
import Pagination from "~/components/Pagination";
import type { Department } from "@prisma/client";
import { STAFF_SESSION_KEY } from "~/session.server";
import CategorySort from "~/components/Sorting/CategorySort";
import { searchDepartments } from "~/models/departments.server";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import { Form, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const searchQuery = {
    name: url.searchParams.get("name")?.toString() || undefined,
    sortBy: url.searchParams.get("sortBy")?.toString() || undefined,
    sortOrder: url.searchParams.get("sortOrder")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("perPage")) || 10,
  };

  const { departments, totalPages } = await searchDepartments(searchQuery);

  return json({
    totalPages,
    departments,
  });
};

const ManageDepartments = () => {
  const { totalPages, departments } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form
        method="GET"
        className="relative h-full w-full rounded-none bg-base-200 p-6"
      >
        <AdminPageHeader
          title="Manage Departments"
          addButtonText="Add Department"
        />

        <AdminContentSearch name={true} />

        <div className="divider w-full" />

        <CategorySort />

        {departments && departments.length > 0 && (
          <BasicTable
            currentPage={currentPage}
            objectArray={departments?.map((e: Department) => ({
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

export default ManageDepartments;
