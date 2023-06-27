import {
  Form,
  Outlet,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { type LoaderArgs } from "@remix-run/server-runtime";
import Pagination from "~/components/Pagination";
import { searchOrders } from "~/models/orders.server";

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const searchQuery = {
    id: url.searchParams.get("orderId")?.toString() || undefined,
    status: url.searchParams.get("status")?.toString() || undefined,
    email: url.searchParams.get("userEmail")?.toString() || undefined,
    page: Number(url.searchParams.get("pageNumber")) || 1,
    perPage: Number(url.searchParams.get("itemsPerPage")) || 10,
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
    <>
      <Form
        method="GET"
        className="relative mt-3 max-w-[99vw] rounded-lg border-t-4 border-primary bg-base-300 p-6"
      >
        <h1>Manage Orders</h1>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex flex-row flex-wrap gap-3">
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
                className="select-bordered select w-full max-w-xs"
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
          </div>

          <div className="flex flex-row gap-6">
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

        <div className="my-6 flex justify-center">
          <div className="max-h-[55vh] max-w-[98vw] overflow-x-auto rounded-2xl">
            <table className="table w-[720px] rounded-xl">
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
                  orders.map(({ orderId, status, user }: Order, index) => {
                    return (
                      <tr
                        className="hover cursor-pointer"
                        key={orderId}
                        onClick={() => navigate(`/admin/orders/${orderId}`)}
                      >
                        {currentPage && (
                          <td>
                            {index + 1 + (currentPage - 1) * orders?.length}
                          </td>
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
        </div>

        <Pagination totalPages={totalPages} />
      </Form>
      <Outlet />
    </>
  );
};

export default ManageOrders;
