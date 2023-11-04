import { redirect, type ActionArgs } from "@remix-run/server-runtime";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import { getOrdersCurrentUser } from "~/models/orders.server";
import { tokenAuth } from "~/auth.server";

export const loader = async ({ request }: ActionArgs) => {
  const authenticated = await tokenAuth(request);
  if (!authenticated.valid) {
    return redirect("/login");
  }

  const orders = await getOrdersCurrentUser(request);
  return orders;
};

const Orders = () => {
  const navigate = useNavigate();
  const orders = useLoaderData();

  return (
    <Form
      method="POST"
      action="/orders/create"
      className="flex min-w-[720px] flex-col items-center gap-3 py-6 max-xl:min-w-[600px] max-lg:min-w-[480px] max-md:min-w-[600px]"
    >
      <h1 className="text-3xl">Orders</h1>
      <div className="opacity-50">Track your Order History</div>
      <div className="divider w-full" />
      <div className="max-h-[650px] max-w-[98vw] overflow-x-auto">
        {orders?.length === 0 && (
          <>
            <p>You have not made an order yet.</p>
          </>
        )}

        {orders?.length > 0 && (
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="!rounded-none">#</th>
                <th>Created</th>
                <th>Items</th>
                <th>Price</th>
                <th className="!rounded-none">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders?.map((order: Order, i: number) => {
                const { createdAt, items, totalPrice, status, orderId } = order;
                const itemNames: string[] = [];

                items.forEach(({ variant, quantity }: OrderItem) => {
                  const { name } = variant.product;
                  itemNames.push(quantity + " x " + name);
                });

                return (
                  <tr
                    key={"order-" + orderId}
                    className="hover cursor-pointer"
                    onClick={() =>
                      navigate(
                        {
                          pathname: `/account/order/${order.orderId}`,
                          search: `?status=${order.status}`,
                        },
                        {
                          state: {
                            order: order,
                          },
                        }
                      )
                    }
                  >
                    <th className="!rounded-none">{i + 1}</th>
                    <td>
                      {new Date(createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td>{itemNames.join(", ").substring(0, 32)}</td>
                    <td>${totalPrice.toFixed(2).toString()}</td>
                    <td className="!rounded-none">{capitalizeFirst(status)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </Form>
  );
};

export default Orders;
