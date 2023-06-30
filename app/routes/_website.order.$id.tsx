import { type ActionArgs } from "@remix-run/server-runtime";
import { Link, useLoaderData, useLocation } from "@remix-run/react";
import { getOrderShippingDetails } from "~/models/orders.server";
import PageWrapper from "~/components/Layout/PageWrapper";
import OrderStatusSteps from "~/components/Indicators/OrderStatusSteps";
import ShippingDetailsCollapse from "~/components/Forms/Misc/ShippingDetailsCollapse";

export const loader = async ({ request, params }: ActionArgs) => {
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const orderId = params.id;
  if (status !== ("created" || "cancelled") && orderId) {
    return await getOrderShippingDetails(orderId);
  } else {
    return null;
  }
};

const Order = () => {
  const location = useLocation();
  const { order } = (location.state as { order: Order }) || {};
  const { items } = (order as { items: OrderItem[] }) || {};
  const shippingDetails = useLoaderData() as SquareShippingDetails;

  return (
    <PageWrapper>
      <div className="bg-base-100 px-0 lg:px-3">
        <div className="mt-3 flex flex-col items-center gap-3">
          <h1 className="text-center text-3xl">Order</h1>
          <p className="text-xs opacity-50"># - {order?.orderId}</p>
        </div>
        <div className="divider w-full" />

        <div className="flex flex-col items-center gap-6">
          <OrderStatusSteps status={order?.status} />

          {order?.status === "created" && (
            <Link
              to={order.paymentUrl}
              target="_blank"
              className="btn-primary btn"
            >
              Pay Now
            </Link>
          )}
        </div>

        <div className="divider w-full" />

        {order?.status !== ("created" || "cancelled") && (
          <>
            <ShippingDetailsCollapse shippingDetails={shippingDetails} />
          </>
        )}

        <div className="divider w-full" />

        <div className="flex flex-col flex-wrap items-center justify-center gap-3">
          {items
            ?.sort((a, b) =>
              a.variant.product.name.localeCompare(b.variant.product.name)
            )
            .reverse()
            .map(({ variant, quantity }: OrderItem) => {
              const { product, price, salePrice, isOnSale } = variant;

              return (
                <div
                  className="relative flex w-full max-w-full flex-row items-center bg-base-300 p-3"
                  key={"cartItem-" + product.name}
                >
                  <div className="relative w-full text-center">
                    <div>
                      {product?.name} x {quantity}
                    </div>
                    <div className="text-xs opacity-50">{variant?.name}</div>
                    <div className="!rounded-none">
                      $
                      {isOnSale
                        ? salePrice?.toFixed(2)
                        : price?.toFixed(2) + " ea"}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="mt-6 text-center">
          <div>Order Total: ${order?.totalPrice?.toFixed(2)}</div>
        </div>

        <div className="divider w-full" />
      </div>
    </PageWrapper>
  );
};

export default Order;
