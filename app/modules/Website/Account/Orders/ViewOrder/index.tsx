import { Link } from "@remix-run/react";
import OrderStatusSteps from "~/components/Indicators/OrderStatusSteps";
import ShippingDetailsCollapse from "~/components/Forms/Misc/ShippingDetailsCollapse";
import type {
  OrderWithDetails,
  OrderItemWithDetails,
} from "~/models/orders.server";

type Props = {
  order: OrderWithDetails;
};

const ViewOrder = ({ order }: Props) => {
  return (
    <div className="flex min-w-[720px] flex-col items-center gap-3 py-6 max-xl:min-w-[600px] max-lg:min-w-[480px] max-md:min-w-[600px]">
      <div className="mt-3 flex flex-col items-center gap-3">
        <h1 className="text-center text-3xl">Order</h1>
        <p className="text-xs opacity-50"># - {order?.id}</p>
      </div>
      <div className="divider w-full" />

      <div className="flex flex-col items-center gap-6">
        {order && (
          <OrderStatusSteps
            status={order?.status as OrderStatus}
            type="orderStatus"
          />
        )}

        {order && order?.status === "created" && (
          <Link
            to={order.paymentUrl}
            target="_blank"
            className="btn btn-primary"
          >
            Pay Now
          </Link>
        )}
      </div>

      <div className="divider w-full" />

      <ShippingDetailsCollapse order={order} />

      <div className="divider w-full" />

      <div className="flex w-full flex-col flex-wrap items-center justify-center gap-3">
        {order?.items?.map(({ variant, quantity }: OrderItemWithDetails) => {
          const { product, price, salePrice, isOnSale } = variant || {};

          return (
            <div
              className="relative flex w-full max-w-full flex-row items-center rounded-sm bg-brand-black px-3 py-3 text-brand-white"
              key={"cartItem-" + product?.name}
            >
              <div className="relative flex w-full flex-col items-center gap-1 text-center">
                <div>
                  {product?.name} x {quantity}
                </div>
                <div className="text-xs opacity-50">{variant?.name}</div>
                <div>
                  $
                  {isOnSale ? salePrice?.toFixed(2) : price?.toFixed(2) + " ea"}
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
  );
};

export default ViewOrder;
