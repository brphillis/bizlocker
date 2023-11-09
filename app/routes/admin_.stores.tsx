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
import { searchStores } from "~/models/stores.server";

export const loader = async ({ request }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const { stores, totalPages } = await searchStores(undefined, url);

  return {
    stores,
    totalPages,
  };
};

const ManageStores = () => {
  const navigate = useNavigate();
  const { stores, totalPages } = useLoaderData();
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Stores" addButtonText="Add Store" />

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

        <div className="w-full max-w-[80vw] overflow-x-auto">
          <table className="table table-sm my-3">
            <thead className="sticky top-0">
              <tr>
                {currentPage && <th>#</th>}
                <th>Name</th>
                <th>State</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {stores &&
                stores?.map(
                  ({ id, name, address, isActive }: Store, i: number) => {
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
                          <td>{i + 1 + (currentPage - 1) * stores?.length}</td>
                        )}
                        <td>{name}</td>
                        <td>{address?.state}</td>
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
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageStores;
