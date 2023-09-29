import type { LoaderArgs } from "@remix-run/node";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { searchCampaigns } from "~/models/campaigns.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const { campaigns, totalPages } = await searchCampaigns(undefined, url);

  return { campaigns, totalPages };
};

const Campaigns = () => {
  const navigate = useNavigate();
  const { campaigns, totalPages } = useLoaderData() || {};

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Campaign" addButtonText="Add Campaign" />

        <div className="mt-3 flex flex-col">
          <BasicInput label="Name" name="name" placeholder="Name" type="text" />

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
                <th>Updated</th>
                <th>Created</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {campaigns?.map(
                (
                  { id, name, updatedAt, createdAt, isActive }: Campaign,
                  i: number
                ) => {
                  return (
                    <tr
                      className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                      key={id}
                      onClick={() => navigate(`/admin/campaigns/${id}`)}
                    >
                      {currentPage && (
                        <td>{i + 1 + (currentPage - 1) * campaigns?.length}</td>
                      )}
                      <td>{name}</td>
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

export default Campaigns;
