import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import type { articleCategorySearchLoader } from "./index.server";

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
          buttonLink="/admin/upsert/article-category?contentId=add"
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
