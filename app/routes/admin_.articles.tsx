import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import SelectArticleCategory from "~/components/Forms/Select/SelectArticleCategory";

import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { getArticleCategories } from "~/models/articleCategories.server";
import { searchArticles } from "~/models/articles.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);

  const { articles, totalPages } = await searchArticles(undefined, url);
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
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Articles" addButtonText="Add Article" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <div className="flex w-full flex-row gap-6 sm:w-[215px]">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Article Title</span>
                </label>
                <input
                  name="title"
                  className="input w-full text-brand-black/50"
                  placeholder="Name"
                  type="text"
                />
              </div>
            </div>

            <SelectArticleCategory articleCategories={articleCategories} />
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
                <th>Title</th>

                <th>Category</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {articles &&
                articles.map(
                  (
                    {
                      id,
                      title,

                      articleCategories,
                      isActive,
                    }: Article,
                    i
                  ) => {
                    return (
                      <tr
                        className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                        key={id}
                        onClick={() => navigate(`/admin/articles/${id}`)}
                      >
                        {currentPage && (
                          <td>
                            {i + 1 + (currentPage - 1) * articles?.length}
                          </td>
                        )}
                        <td>{title}</td>

                        <td>
                          {articleCategories?.map(
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

        <Pagination totalPages={totalPages} />
      </Form>
      {/* <Outlet /> */}
    </AdminPageWrapper>
  );
};

export default Articles;
