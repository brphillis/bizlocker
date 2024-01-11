import Pagination from "~/components/Pagination";
import { type OrderWithDetails } from "~/models/orders.server";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/Wrappers/AdminPageWrapper";
import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import type { orderSearchLoader } from "./index.server";

const OrderSearch = () => {
  const { orders, totalPages } = useLoaderData<typeof orderSearchLoader>();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Orders" />

        <AdminContentSearch id="text" status="order" email={true} />

        <div className="divider w-full" />

        {orders && orders.length > 0 && (
          <BasicTable
            onRowClick={(id) => navigate(`/admin/upsert/order?contentId=${id}`)}
            currentPage={currentPage}
            objectArray={orders?.map((e: OrderWithDetails) => ({
              id: e.id,
              user: e.user?.email,
              status: e.status,
            }))}
          />
        )}

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default OrderSearch;
