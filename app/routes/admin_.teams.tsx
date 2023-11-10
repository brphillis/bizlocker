import Pagination from "~/components/Pagination";
import { redirect, type LoaderArgs } from "@remix-run/server-runtime";
import BasicInput from "~/components/Forms/Input/BasicInput";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import { searchTeams } from "~/models/teams.server";

export const loader = async ({ request }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const { teams, totalPages } = await searchTeams(undefined, url);

  return {
    teams,
    totalPages,
  };
};

const ManageTeams = () => {
  const navigate = useNavigate();
  const { teams, totalPages } = useLoaderData();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

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

        <div className="max-h-[520px] w-full max-w-[80vw] overflow-auto">
          <table className="table table-sm my-3">
            <thead className="sticky top-0">
              <tr>
                {currentPage && <th>#</th>}
                <th>Name</th>
                <th>Location</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {teams &&
                teams?.map(({ id, name, store, isActive }: Team, i: number) => {
                  const { name: storeName } = store;
                  return (
                    <tr
                      className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                      key={"product" + id}
                      onClick={() => {
                        navigate(
                          `${location.pathname + "/" + id}${location.search}`
                        );
                      }}
                    >
                      {currentPage && (
                        <td>{i + 1 + (currentPage - 1) * teams?.length}</td>
                      )}
                      <td>{name}</td>
                      <td>{storeName}</td>
                      <td>
                        {!isActive && (
                          <div className="ml-4 h-3 w-3 rounded-full bg-red-500" />
                        )}
                        {isActive && (
                          <div className="ml-4 h-3 w-3 self-center rounded-full bg-success" />
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageTeams;
