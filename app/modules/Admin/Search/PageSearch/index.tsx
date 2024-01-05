import { json } from "@remix-run/node";
import type { WebPage } from "@prisma/client";
import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import { searchWebPages } from "~/models/webPages.server";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import {
  Form,
  type Params,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

export const pageSearchLoader = async (
  request: Request,
  params: Params<string>
) => {
  const url = new URL(request.url);

  const { webPages, totalPages } = await searchWebPages(undefined, url);

  return json({ webPages, totalPages });
};

const PageSearch = () => {
  const navigate = useNavigate();
  const { webPages, totalPages } = useLoaderData<typeof pageSearchLoader>();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Pages"
          buttonLabel="Add Page"
          buttonLink="/admin/pagebuilder/new?req=webpage"
        />

        <AdminContentSearch title={true} />

        <div className="divider w-full" />

        {webPages && webPages.length > 0 && (
          <BasicTable
            onRowClick={(e) => navigate(`/admin/pagebuilder/webpage?id=${e}`)}
            currentPage={currentPage}
            objectArray={webPages?.map((e: WebPage) => ({
              id: e.id,
              title: e.title,
              active: e.isActive,
            }))}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
    </AdminPageWrapper>
  );
};

export default PageSearch;
