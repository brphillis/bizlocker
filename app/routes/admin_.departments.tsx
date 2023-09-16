import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { type LoaderArgs } from "@remix-run/server-runtime";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { searchDepartments } from "~/models/departments.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const searchQuery = {
    name: url.searchParams.get("name")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("perPage")) || 10,
  };

  const { departments, totalPages } = await searchDepartments(searchQuery);

  return {
    totalPages,
    departments,
  };
};

const ManageDepartments = () => {
  const navigate = useNavigate();
  const { totalPages, departments } = useLoaderData() || {};

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

        <div className="mt-3 flex w-full flex-wrap items-end gap-6">
          <div className="flex w-full flex-row gap-6 sm:w-[215px]">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Department Name</span>
              </label>
              <input
                name="name"
                className="input w-full text-brand-black/50"
                placeholder="Name"
                type="text"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-end sm:justify-start">
          <button type="submit" className="btn btn-primary mt-6 w-max">
            Search
          </button>
        </div>

        <div className="divider w-full" />

        <div className="w-full max-w-[89vw] overflow-x-auto">
          <table className="table table-sm my-3">
            <thead className="sticky top-0">
              <tr>
                {currentPage && <th className="w-[10%]">#</th>}
                <th className="w-[30%]">Name</th>
                <th className="w-[20%]">Index</th>
                <th className="w-[20%]">In Navigation</th>
                <th className="w-[20%]">Active</th>
              </tr>
            </thead>
            <tbody>
              {departments?.map(
                (
                  {
                    id,
                    name,
                    index,
                    displayInNavigation,
                    isActive,
                  }: Department,
                  i: number
                ) => {
                  return (
                    <tr
                      className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                      key={id}
                      onClick={() => navigate(`/admin/departments/${id}`)}
                    >
                      {currentPage && (
                        <td>
                          {i + 1 + (currentPage - 1) * departments?.length}
                        </td>
                      )}
                      <td>{name}</td>
                      <td>{index}</td>
                      <td>
                        {!displayInNavigation && (
                          <div className="ml-4 h-3 w-3 rounded-full bg-red-500" />
                        )}
                        {displayInNavigation && (
                          <div className="ml-4 h-3 w-3 self-center rounded-full bg-success" />
                        )}
                      </td>
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
                }
              )}
            </tbody>
          </table>
          <Pagination totalPages={totalPages} />
        </div>
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageDepartments;
