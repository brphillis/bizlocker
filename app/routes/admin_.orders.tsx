import { tokenAuth } from "~/auth.server";
import Pagination from "~/components/Pagination";
import { STAFF_SESSION_KEY } from "~/session.server";
import { type OrderWithDetails, searchOrders } from "~/models/orders.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import AdminPageHeader from "~/components/Layout/_Admin/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/_Admin/AdminPageWrapper";
import { Form, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import BasicTable from "~/components/Tables/BasicTable";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const authenticated = await tokenAuth(request, STAFF_SESSION_KEY);

  if (!authenticated.valid) {
    return redirect("/admin/login");
  }

  const url = new URL(request.url);

  const searchQuery = {
    id: url.searchParams.get("orderId")?.toString() || undefined,
    status: url.searchParams.get("status")?.toString() || undefined,
    // email: url.searchParams.get("userEmail")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("perPage")) || 10,
  };

  const { orders, totalPages } = await searchOrders(searchQuery);

  return json({ orders, totalPages });
};

const ManageOrders = () => {
  const { orders, totalPages } = useLoaderData<typeof loader>();

  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("pageNumber")) || 1;

  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Orders" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-3 sm:gap-6">
            <BasicInput
              name="orderId"
              label="ID"
              placeholder="ID"
              type="text"
            />

            <div className="form-control w-full sm:w-[215px]">
              <label className="label text-sm">By Status</label>
              <select
                name="status"
                className="select w-full text-brand-black/75"
              >
                <option value="">Select a Status</option>
                <option value="created">Created</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="complete">Complete</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <BasicInput
              name="userEmail"
              label="User Email"
              placeholder="User Email"
              type="text"
            />
          </div>

          <div className="flex flex-row flex-wrap justify-between">
            <div className="mr-10 flex flex-row flex-wrap gap-2">
              <button
                type="submit"
                className="btn btn-primary mt-6 w-max !rounded-sm"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="divider w-full" />

        {orders && orders.length > 0 && (
          <BasicTable
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
