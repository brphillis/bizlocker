import Pagination from "~/components/Pagination";
import type { ArticleCategory } from "@prisma/client";
import BasicTable from "~/components/Tables/BasicTable";
import BasicInput from "~/components/Forms/Input/BasicInput";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import { type ArticleWithContent } from "~/models/articles.server";
import {
  Form,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import type { articleSearchLoader } from "./index.server";

const ArticleSearch = () => {
  const navigate = useNavigate();
  const { articles, articleCategories, totalPages } =
    useLoaderData<typeof articleSearchLoader>();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Articles"
          buttonLabel="Add Article"
          buttonLink="/admin/pagebuilder/new?req=article"
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
              selections={articleCategories as ArticleCategory[]}
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

        {articles && articles.length > 0 && (
          <BasicTable
            onRowClick={(e) => navigate(`/admin/pagebuilder/article?id=${e}`)}
            currentPage={currentPage}
            objectArray={articles?.map((e: ArticleWithContent) => ({
              id: e.id,
              title: e.title,
              category: e.articleCategories?.[0]?.name || "",
              active: e.isActive,
            }))}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
    </AdminPageWrapper>
  );
};

export default ArticleSearch;
