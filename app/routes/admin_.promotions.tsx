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

  const { promotions, totalPages } = await searchPromotions(undefined, url);

  return json({ promotions, totalPages });
};

const Promotions = () => {
  const navigate = useNavigate();
  const { promotions, totalPages } = useLoaderData() || {};

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Promotions"
          addButtonText="Add Promotion"
        />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row gap-6">
            <div className="form-control w-full sm:w-[215px]">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                name="name"
                className="input input-bordered w-full"
                placeholder="Name"
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-row justify-end sm:justify-start">
            <button type="submit" className="btn btn-primary mt-6 w-max">
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
                <th>Discount</th>
                <th>Updated</th>
                <th>Created</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {promotions?.map(
                (
                  {
                    id,
                    name,
                    discountPercentage,
                    updatedAt,
                    createdAt,
                    isActive,
                  }: Promotion,
                  i: number
                ) => {
                  return (
                    <tr
                      className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                      key={id}
                      onClick={() => navigate(`/admin/promotions/${id}`)}
                    >
                      {currentPage && (
                        <td>
                          {i + 1 + (currentPage - 1) * promotions?.length}
                        </td>
                      )}
                      <td>{name}</td>
                      <td>{discountPercentage}%</td>
                      <td>
                        {new Date(updatedAt as Date).toLocaleDateString(
                          "en-US",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
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
