import { json } from "@remix-run/node";
import Pagination from "~/components/Pagination";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import { searchStores, type StoreWithDetails } from "~/models/stores.server";
import {
  Form,
  Outlet,
  type Params,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";

export const storeSearchLoader = async (
  request: Request,
  params: Params<string>
) => {
  const url = new URL(request.url);

  const { stores, totalPages } = await searchStores(undefined, url);

  return json({
    stores,
    totalPages,
  });
};

const StoreSearch = () => {
  const { stores, totalPages } = useLoaderData<typeof storeSearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const currentPage: number = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader
          title="Manage Stores"
          buttonLabel="Add Store"
          buttonLink="/admin/upsert/store?contentId=add"
        />

        <AdminContentSearch name={true} />

        <div className="divider w-full" />

        {stores && stores.length > 0 && (
          <BasicTable
            onRowClick={(id) => navigate(`/admin/upsert/store?contentId=${id}`)}
            currentPage={currentPage}
            objectArray={stores?.map((e: StoreWithDetails) => ({
              id: e.id,
              name: e.name,
              state: e.address?.state,
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

export default StoreSearch;
