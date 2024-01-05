import { json } from "@remix-run/node";
import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import { searchArticleCategories } from "~/models/articleCategories.server";
import {
  Form,
  Outlet,
  type Params,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

export const articleCategorySearchLoader = async (
  request: Request,
  params: Params<string>
) => {
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

const ArticleCategorySearch = () => {
  const { articleCategories, totalPages } =
    useLoaderData<typeof articleCategorySearchLoader>() || {};

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Article Categories"
          buttonLabel="Add Category"
          buttonLink="/admin/upsert/articleCategory?contentId=add"
        />

        <AdminContentSearch name={true} />

        <div className="divider w-full" />

        {articleCategories && articleCategories.length > 0 && (
          <BasicTable
            onRowClick={(id) =>
              navigate(`/admin/upsert/articleCategory?contentId=${id}`)
            }
            currentPage={currentPage}
            objectArray={articleCategories?.map((e) => ({
              id: e.id,
              name: e.name,
              created: e.createdAt,
              active: e.isActive,
            }))}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ArticleCategorySearch;
