import { tokenAuth } from "~/auth.server";
import Pagination from "~/components/Pagination";
import { STAFF_SESSION_KEY } from "~/session.server";
import { type OrderWithDetails, searchOrders } from "~/models/orders.server";
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
import BasicTable from "~/components/Tables/BasicTable";
import AdminContentSearch from "~/components/Search/AdminContentSearch";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const searchQuery = {
    id: url.searchParams.get("id")?.toString() || undefined,
    status: url.searchParams.get("status")?.toString() || undefined,
    email: url.searchParams.get("email")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("perPage")) || 10,
  };

  const { orders, totalPages } = await searchOrders(searchQuery);

  return json({ orders, totalPages });
};

const ManageOrders = () => {
  const { orders, totalPages } = useLoaderData<typeof loader>();

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
              id: e.orderId,
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

export default ManageOrders;
