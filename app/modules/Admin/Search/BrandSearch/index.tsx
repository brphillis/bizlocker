import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import { BrandWithContent } from "~/models/Brands/types";
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

import { brandSearchLoader } from "./index.server";

const BrandSearch = () => {
  const { brands, totalPages } = useLoaderData<typeof brandSearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Brands"
          buttonLabel="Add Brand"
          buttonLink="/admin/upsert/brand?contentId=add"
        />

        <AdminContentSearch name={true} />

        <div className="divider w-full" />

        {brands && brands.length > 0 && (
          <BasicTable
            onRowClick={(id) => navigate(`/admin/upsert/brand?contentId=${id}`)}
            currentPage={currentPage}
            objectArray={brands.map((e: BrandWithContent) => ({
              id: e.id,
              name: e.name,
              isActive: e.isActive,
            }))}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default BrandSearch;
