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
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";
import { orderSearchLoader } from "./index.server";
import { OrderWithDetails } from "~/models/Orders/types";

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

        {orders?.length > 0 && (
          <BasicTable
            onRowClick={(id) => navigate(`/admin/upsert/order?contentId=${id}`)}
            currentPage={currentPage}
            objectArray={orders.map(
              ({ id, email, status }: OrderWithDetails) => ({
                id,
                user: email,
                status: status,
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

export default OrderSearch;
