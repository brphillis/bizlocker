import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import parse from "html-react-parser";
import Pagination from "~/components/Pagination";
import { getArticleCategories } from "~/models/articleCategories.server";
import { searchArticles } from "~/models/articles.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const searchQuery = {
    title: url.searchParams.get("title")?.toString() || undefined,
    category: url.searchParams.get("category")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("itemsPerPage")) || 10,
  };

  const { articles, totalPages } = await searchArticles(searchQuery);
  const articleCategories = await getArticleCategories();

  return json({ articles, totalPages, articleCategories });
};

const Articles = () => {
  const navigate = useNavigate();
  const { articles, articleCategories, totalPages } = useLoaderData() as {
    articles: Article[];
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
        <h1>Manage Articles</h1>
        <div className="mt-3 flex flex-col">
          <div className="flex flex-row gap-6">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                name="title"
                className="input-bordered input w-full max-w-xs"
                placeholder="Title"
                type="text"
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                title="category"
                name="category"
                className="select-bordered select w-full max-w-xs"
                placeholder="Select a Value"
              >
                <option value="">Select a Category</option>
                {articleCategories.map(({ id, name }: ArticleCategory) => {
                  return (
                    <option key={name + id} value={name}>
                      {name}
                    </option>
                  );
                })}
              </select>
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

            <Link
              to="/admin/article-categories"
              className="btn-primary btn mt-6 w-max"
            >
              Article Categories
            </Link>
          </div>
        </div>

        <div className="divider w-full" />

        <div className="my-6 flex justify-center">
          <div className="max-h-[55vh] max-w-[98vw] overflow-x-auto rounded-2xl">
            <table className="table w-[720px] rounded-xl">
              <thead className="sticky top-0">
                <tr>
                  {currentPage && <th>#</th>}
                  <th>Title</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {articles &&
                  articles.map(
                    (
                      { id, title, content, categories, isActive }: Article,
                      index
                    ) => {
                      return (
                        <tr
                          className="hover cursor-pointer"
                          key={id}
                          onClick={() => navigate(`/admin/articles/${id}`)}
                        >
                          {currentPage && (
                            <td>
                              {index + 1 + (currentPage - 1) * articles?.length}
                            </td>
                          )}
                          <td>{title}</td>
                          <td>{parse(content.substring(0, 50))}</td>
                          <td>
                            {categories &&
                              categories.map(
                                ({ id, name }: ArticleCategory) => (
                                  <p key={id + name}>{name}</p>
                                )
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
          </div>
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </>
  );
};

export default Articles;
