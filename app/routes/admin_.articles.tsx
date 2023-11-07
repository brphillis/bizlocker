import { redirect, type LoaderArgs } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { tokenAuth } from "~/auth.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { getArticleCategories } from "~/models/articleCategories.server";
import { searchArticles } from "~/models/articles.server";
import { STAFF_SESSION_KEY } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);
  if (!authenticated.valid) {
    return redirect("/login");
  }

  const url = new URL(request.url);

  const { articles, totalPages } = await searchArticles(undefined, url);
  const articleCategories = await getArticleCategories();

  return { articles, totalPages, articleCategories };
};

const Articles = () => {
  const navigate = useNavigate();
  const { articles, articleCategories, totalPages } = useLoaderData() || {};

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Articles"
          addButtonText="Add Article"
          createLink="/admin/pagebuilder/new?req=article"
        />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-6">
            <BasicInput
              label="Article Title"
              name="title"
              type="text"
              placeholder="Name"
            />

            <BasicSelect
              label="Category"
              name="articleCategory"
              placeholder="Select a Category"
              selections={articleCategories}
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
                    i: number
                  ) => {
                    return (
                      <tr
                        className="cursor-pointer transition-colors duration-200 hover:bg-base-100"
                        key={id}
                        onClick={() =>
                          navigate(`/admin/pagebuilder/article?id=${id}`)
                        }
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
