import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { type UserWithDetails, searchUsers } from "~/models/auth/users.server";
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

  const searchQuery = {
    firstName: url.searchParams.get("firstName") as string,
    lastName: url.searchParams.get("lastName") as string,
    email: url.searchParams.get("email") as string,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: 10,
  };

  const { users, totalPages } = await searchUsers(searchQuery, true);

  return json({ users, totalPages });
};

const Users = () => {
  const { users, totalPages } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Users" addButtonText="Add User" />

        <AdminContentSearch firstName={true} lastName={true} email={true} />

        <div className="divider w-full" />

        {users && users.length > 0 && (
          <BasicTable
            currentPage={currentPage}
            objectArray={users?.map((e: UserWithDetails) => ({
              id: e.id,
              firstName: e.userDetails?.firstName,
              lastName: e.userDetails?.lastName,
              email: e.email,
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

export default Users;
