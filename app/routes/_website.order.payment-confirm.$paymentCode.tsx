import { type ActionArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "@remix-run/react";
import { confirmPayment } from "~/models/orders.server";
import PageWrapper from "~/components/Layout/PageWrapper";
import { IoCheckmarkCircle } from "react-icons/io5";

export const loader = async ({ params }: ActionArgs) => {
  const paymentCode = params.paymentCode;
  if (paymentCode) {
    const order = await confirmPayment(paymentCode);
    return order;
  } else return null;
};

const PaymentConfirm = () => {
  const order = useLoaderData() as Order;
  const { items } = (order as { items: OrderItem[] }) || {};

  return (
    <PageWrapper>
      <div className="py-6">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-center text-2xl">
            Your Payment Has Been Successful
          </h1>

          <IoCheckmarkCircle size={42} className="text-success" />

          <p className="text-xs opacity-50"># - {order.orderId}</p>
        </div>

        <div className="divider w-full" />

        <div className="flex flex-col flex-wrap items-start justify-center gap-3">
          {items
            ?.sort((a, b) =>
              a.variant.product.name.localeCompare(b.variant.product.name)
            )
            .reverse()
            .map(({ variant, quantity }: OrderItem) => {
              const { product, price, salePrice, isOnSale } = variant;

              return (
                <div
                  className="relative flex w-[420px] max-w-full flex-row items-center bg-base-300 p-3"
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

        <div className="divider w-full" />

        <div className="text-center">
          <div>Order Total: ${order.totalPrice.toFixed(2)}</div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PaymentConfirm;
