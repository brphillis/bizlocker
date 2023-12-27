import { tokenAuth } from "~/auth.server";
import Pagination from "~/components/Pagination";
import { STAFF_SESSION_KEY } from "~/session.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { searchTeams, type TeamWithStaff } from "~/models/teams.server";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import { Form, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import BasicTable from "~/components/Tables/BasicTable";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const { teams, totalPages } = await searchTeams(undefined, url);

  return json({
    teams,
    totalPages,
  });
};

const ManageTeams = () => {
  const { teams, totalPages } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();

  const currentPage: number = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Teams" addButtonText="Add Team" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <BasicInput
              name="name"
              label="Name"
              placeholder="Name"
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

        {teams && teams.length > 0 && (
          <BasicTable
            currentPage={currentPage}
            objectArray={teams?.map((e: TeamWithStaff) => ({
              id: e.id,
              name: e.name,
              store: e.store?.name,
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

export default ManageTeams;
