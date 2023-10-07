import type { LoaderArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import BasicInput from "~/components/Forms/Input/BasicInput";

import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { searchWebPages } from "~/models/webPages.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const { webPages, totalPages } = await searchWebPages(undefined, url);

  return { webPages, totalPages };
};

const Pages = () => {
  const navigate = useNavigate();
  const { webPages, totalPages } = useLoaderData() || {};

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Pages"
          addButtonText="Add Page"
          createLink="/admin/pagebuilder/new?req=webpage"
        />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <BasicInput
              label="Page Title"
              name="title"
              placeholder="Title"
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
                <th>Title</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {webPages &&
                webPages.map(({ id, title, isActive }: Page, i: number) => {
                  return (
                    <tr
                      className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                      key={id}
                      onClick={() =>
                        navigate(`/admin/pagebuilder/webpage?id=${id}`)
                      }
                    >
                      {currentPage && (
                        <td>{i + 1 + (currentPage - 1) * webPages?.length}</td>
                      )}
                      <td>{title}</td>

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
    </AdminPageWrapper>
  );
};

export default Pages;
