import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import Pagination from "~/components/Pagination";
import { searchCampaigns } from "~/models/campaigns.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const searchQuery = {
    title: url.searchParams.get("title")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("itemsPerPage")) || 10,
  };

  const { campaigns, totalPages } = await searchCampaigns(searchQuery);

  return json({ campaigns, totalPages });
};

const Campaigns = () => {
  const navigate = useNavigate();
  const { campaigns, totalPages } = useLoaderData() as {
    campaigns: Campaign[];
    totalPages: number;
    articleCategories: ArticleCategory[];
  };

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <>
      <Form
        method="GET"
        className="relative mt-3 max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <h1>Manage Campaigns</h1>
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
          <div className="flex flex-row flex-wrap justify-between">
            <div className="mr-10 flex flex-row flex-wrap gap-2">
              <button type="submit" className="btn-primary btn mt-6 w-max">
                Search
              </button>

              <button
                type="button"
                className="btn-primary btn mt-6 w-max"
                onClick={() => navigate("add")}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="divider w-full" />

        <div className="my-6 flex justify-center">
          <div className="max-h-[55vh] max-w-[98vw] overflow-x-auto rounded-2xl">
            <table className="table w-[720px] rounded-xl">
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
                {campaigns &&
                  campaigns.map(
                    (
                      { id, name, updatedAt, createdAt, isActive }: Campaign,
                      index
                    ) => {
                      return (
                        <tr
                          className="hover cursor-pointer"
                          key={id}
                          onClick={() => navigate(`/admin/campaigns/${id}`)}
                        >
                          {currentPage && (
                            <td>
                              {index +
                                1 +
                                (currentPage - 1) * campaigns?.length}
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
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </>
  );
};

export default Campaigns;
