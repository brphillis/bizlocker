import { tokenAuth } from "~/auth.server";
import Pagination from "~/components/Pagination";
import { STAFF_SESSION_KEY } from "~/session.server";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import { searchArticleCategories } from "~/models/articleCategories.server";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import type { ArticleCategory } from "@prisma/client";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/login");
  }

  const url = new URL(request.url);

  const searchQuery = {
    name: url.searchParams.get("name")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("perPage")) || 10,
  };

  const { articleCategories, totalPages } = await searchArticleCategories(
    searchQuery
  );

  return json({ articleCategories, totalPages });
};

const ArticleCategories = () => {
  const navigate = useNavigate();
  const { articleCategories, totalPages } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Article Categories"
          addButtonText="Add Category"
        />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row">
            <BasicInput
              label="Name"
              name="name"
              type="text"
              placeholder="Name"
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
              </tr>
            </thead>
            <tbody>
              {articleCategories?.map(({ id, name }: ArticleCategory, i) => {
                return (
                  <tr
                    className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                    onClick={() => {
                      navigate(
                        `${location.pathname + "/" + id}${location.search}`
                      );
                    }}
                    key={id}
                  >
                    {currentPage && (
                      <td>
                        {i + 1 + (currentPage - 1) * articleCategories?.length}
                      </td>
                    )}
                    <td>{capitalizeFirst(name)}</td>
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

export default ArticleCategories;
