import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { type LoaderArgs } from "@remix-run/server-runtime";
import AdminPageHeader from "~/components/Layout/AdminPageHeader";
import AdminPageWrapper from "~/components/Layout/AdminPageWrapper";
import Pagination from "~/components/Pagination";
import { searchOrders } from "~/models/orders.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const searchQuery = {
    id: url.searchParams.get("orderId")?.toString() || undefined,
    status: url.searchParams.get("status")?.toString() || undefined,
    email: url.searchParams.get("userEmail")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("perPage")) || 10,
  };

  const { orders, totalPages } = await searchOrders(searchQuery);
  return { orders, totalPages };
};

const ManageOrders = () => {
  const navigate = useNavigate();
  const { orders, totalPages } =
    (useLoaderData() as {
      orders: Order[];
      totalPages: number;
    }) || {};
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("pageNumber")) || 1;
  return (
    <AdminPageWrapper>
      <Form method="GET" className="relative h-full w-full bg-base-200 p-6">
        <AdminPageHeader title="Manage Orders" />

        <div className="mt-3 flex flex-col">
          <div className="flex flex-row flex-wrap gap-3 sm:gap-6">
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Order Id</span>
              </label>
              <input
                name="orderId"
                className="input-bordered input w-full max-w-xs"
                placeholder="ID"
                type="text"
              />
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">By Status</span>
              </label>
              <select
                name="status"
                title="status"
                className=" select w-full max-w-xs"
                placeholder="Select a Value"
              >
                <option value="">Select a Status</option>
                <option value="created">Created</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="complete">Complete</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">User Email</span>
              </label>
              <input
                name="userEmail"
                className="input-bordered input w-full max-w-xs"
                placeholder="Email"
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-row flex-wrap justify-between">
            <div className="mr-10 flex flex-row flex-wrap gap-2">
              <button type="submit" className="btn-primary btn mt-6 w-max">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="divider w-full" />

        <div className="w-full max-w-[80vw] overflow-x-auto">
          <table className="table-sm my-3 table">
            <thead className="sticky top-0">
              <tr>
                {currentPage && <th>#</th>}
                <th>Id</th>
                <th>User</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map(({ orderId, status, user }: Order, i) => {
                  return (
                    <tr
                      className="hover cursor-pointer"
                      key={orderId}
                      onClick={() => navigate(`/admin/orders/${orderId}`)}
                    >
                      {currentPage && (
                        <td>{i + 1 + (currentPage - 1) * orders?.length}</td>
                      )}
                      <td>{orderId}</td>
                      <td>{user.email}</td>
                      <td>{status}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </AdminPageWrapper>
  );
};

export default ManageOrders;
