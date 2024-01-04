import { tokenAuth } from "~/auth.server";
import Pagination from "~/components/Pagination";
import { getStores } from "~/models/stores.server";
import { STAFF_SESSION_KEY } from "~/session.server";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import {
  searchStockTransfers,
  type StockTransferRequestWithDetails,
} from "~/models/stock.server";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const { stockTransfers, totalPages } = await searchStockTransfers(
    undefined,
    url
  );

  const stores = await getStores();

  return json({
    stockTransfers,
    totalPages,
    stores,
  });
};

const ManageStockTransfers = () => {
  const { stockTransfers, totalPages, stores } = useLoaderData<typeof loader>();

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
              })
            )}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageStockTransfers;
