import { formatDate } from "~/helpers/dateHelpers";
import { capitalizeFirst } from "~/helpers/stringHelpers";
import { Form, useLoaderData } from "@remix-run/react";
import { accountOrdersLoader } from "~/modules/Website/Account/Orders/index.server";
import { useState } from "react";
import ViewOrder from "./ViewOrder";
import BasicButton from "~/components/Buttons/BasicButton";
import { OrderItemWithDetails, OrderWithDetails } from "~/models/Orders/types";

const AccountOrders = () => {
  const { orders } = useLoaderData<typeof accountOrdersLoader>() || {};
  const [currentOrder, setCurrentOrder] = useState<OrderWithDetails>();

  return (
    <>
      {!currentOrder && (
        <Form
          method="POST"
          action="/orders/create"
          className="flex min-w-[720px] flex-col items-center gap-3 py-6 max-xl:min-w-[600px] max-lg:min-w-[480px] max-md:min-w-[600px]"
        >
          <h1 className="text-3xl">Orders</h1>
          <div className="opacity-50">Track your Order History</div>
          <div className="divider w-full" />
          <div className="max-h-[650px] w-full max-w-[98vw] overflow-x-auto">
            {orders?.length === 0 && (
              <>
                <p className="w-full text-center text-brand-black/50">
                  No orders.
                </p>
              </>
            )}

            {orders && orders?.length > 0 && (
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
                  {orders?.map((order: OrderWithDetails, i: number) => {
                    const {
                      createdAt,
                      items,
                      totalPrice,
                      status,
                      id: orderId,
                    } = order;
                    const itemNames: string[] = [];

                    items?.forEach(
                      ({ variant, quantity }: OrderItemWithDetails) => {
                        const { name } = variant?.product || {};
                        itemNames.push(quantity + " x " + name);
                      },
                    );

                    return (
                      <tr
                        key={"order-" + orderId}
                        className="hover cursor-pointer"
                        onClick={() => setCurrentOrder(order)}
                      >
                        <th className="!rounded-none">{i + 1}</th>
                        {createdAt && <td>{formatDate(createdAt)}</td>}
                        <td>{itemNames.join(", ").substring(0, 32)}</td>
                        <td>${totalPrice.toFixed(2).toString()}</td>
                        <td className="!rounded-none">
                          {status && capitalizeFirst(status)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Form>
      )}
      {currentOrder && (
        <div className="flex flex-col items-center">
          <ViewOrder order={currentOrder} />
          <BasicButton
            label="Back"
            onClick={() => setCurrentOrder(undefined)}
          />
        </div>
      )}
    </>
  );
};

export default AccountOrders;
