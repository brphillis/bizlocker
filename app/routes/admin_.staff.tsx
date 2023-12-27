import { redirect, type LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import { type StaffWithDetails, searchStaff } from "~/models/auth/staff.server";
import BasicTable from "~/components/Tables/BasicTable";

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

  const { staff, totalPages } = await searchStaff(searchQuery, true);

  return json({ staff, totalPages });
};

const Staff = () => {
  const { staff, totalPages } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Staff" addButtonText="Add Staff" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <BasicInput
              name="firstName"
              label="First Name"
              placeholder="First Name"
              type="text"
            />

            <BasicInput
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              type="text"
            />

            <BasicInput
              name="email"
              label="Email Address"
              placeholder="Email Address"
              type="text"
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
        </div>

        <div className="divider w-full" />

        {staff && staff.length > 0 && (
          <BasicTable
            currentPage={currentPage}
            objectArray={staff?.map((e: StaffWithDetails) => ({
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

export default Staff;
