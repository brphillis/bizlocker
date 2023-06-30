import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { searchPromotions } from "~/models/promotions.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const searchQuery = {
    title: url.searchParams.get("title")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("itemsPerPage")) || 10,
  };

  const { promotions, totalPages } = await searchPromotions(searchQuery);

  return json({ promotions, totalPages });
};

const Promotions = () => {
  const navigate = useNavigate();
  const { promotions, totalPages } = useLoaderData() as {
    promotions: Campaign[];
    totalPages: number;
  };

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-300 p-6">
        <AdminPageHeader
          title="Manage Promotions"
          addButtonText="Add Promotion"
        />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row gap-6">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                name="name"
                className="input-bordered input w-full max-w-xs"
                placeholder="Name"
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-row justify-end sm:justify-start">
            <button type="submit" className="btn-primary btn mt-6 w-max">
              Search
            </button>
          </div>
        </div>

        <div className="divider w-full" />

        <div className="w-full max-w-[80vw] overflow-x-auto">
          <table className="table-sm my-3 table">
            <thead className="sticky top-0">
              <tr>
                {currentPage && <th>#</th>}
                <th>Name</th>
                <th>Updated</th>
                <th>Created</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {promotions?.map(
                (
                  { id, name, updatedAt, createdAt, isActive }: Campaign,
                  index
                ) => {
                  return (
                    <tr
                      className="hover cursor-pointer"
                      key={id}
                      onClick={() => navigate(`/admin/promotions/${id}`)}
                    >
                      {currentPage && (
                        <td>
                          {index + 1 + (currentPage - 1) * promotions?.length}
                        </td>
                      )}
                      <td>{name}</td>
                      <td>
                        {new Date(updatedAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        {new Date(createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
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
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default Promotions;
