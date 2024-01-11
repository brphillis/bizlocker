import Pagination from "~/components/Pagination";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { type StockTransferRequestWithDetails } from "~/models/stock.server";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import type { stockTransferSearchLoader } from "./index.server";

const StockTransferSearch = () => {
  const { stockTransfers, totalPages, stores } =
    useLoaderData<typeof stockTransferSearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Stock Transfers" />

        <AdminContentSearch
          status="approval"
          stores={stores}
          fromStore={true}
          toStore={true}
        />

        <div className="divider w-full" />

        {stockTransfers && stockTransfers.length > 0 && (
          <BasicTable
            onRowClick={(id) =>
              navigate(`/admin/upsert/stockTransfer?contentId=${id}`)
            }
            currentPage={currentPage}
            objectArray={stockTransfers?.map(
              (e: StockTransferRequestWithDetails) => ({
                id: e.id,
                sku: e.productVariant?.sku,
                fromStore: e.fromStore?.name,
                toStore: e.toStore?.name,
                status: e.status,
                created: e.createdAt,
              }),
            )}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default StockTransferSearch;
