import { json, type LoaderArgs } from "@remix-run/node";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { searchArticleCategories } from "~/models/articleCategories.server";
import { capitalizeFirst } from "~/utility/stringHelpers";

export const loader = async ({ request }: LoaderArgs) => {
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
  const { articleCategories, totalPages } = useLoaderData() as {
    articleCategories: ArticleCategory[];
    totalPages: number;
  };

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
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Category Name</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Name"
                className="input input-bordered w-full sm:w-[215px]"
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
              </tr>
            </thead>
            <tbody>
              {articleCategories?.map(({ id, name }: ArticleCategory, i) => {
                return (
                  <tr
                    className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                    onClick={() => navigate(`/admin/article-categories/${id}`)}
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
