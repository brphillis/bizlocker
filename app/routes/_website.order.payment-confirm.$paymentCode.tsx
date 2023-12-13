import { useLoaderData } from "@remix-run/react";
import { IoCheckmarkCircle } from "react-icons/io5";
import {
  type OrderItemWithDetails,
  confirmPayment,
} from "~/models/orders.server";
import { type ActionFunctionArgs } from "@remix-run/server-runtime";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: "CLUTCH | Confirm Payment" },
    {
      name: "CLUTCH | Confirm Payment",
      content: "CLUTCH | Confirm Payment",
    },
  ];
};

export const loader = async ({ params }: ActionFunctionArgs) => {
  const paymentCode = params.paymentCode;
  if (paymentCode) {
    const order = await confirmPayment(paymentCode);
    return order;
  } else return null;
  //TODO 001 - ADD REDIRECT PAGE WHEN ORDER CANT BE FOUND
};

const PaymentConfirm = () => {
  const order = useLoaderData<typeof loader>();

  const { items } = order || {};

  return (
    <PageWrapper>
      <div className="w-[520px] max-w-full bg-base-100 px-0 lg:px-3">
        <div className="mt-3 flex flex-col items-center gap-3">
          <h1 className="text-center text-2xl">
            Your Payment Has Been Successful
          </h1>

          <IoCheckmarkCircle size={42} className="text-success" />

          <p className="text-xs opacity-50"># - {order?.orderId}</p>
        </div>

        <div className="divider w-full" />

        <div className="flex flex-col flex-wrap items-start justify-center gap-3">
          {items?.map(({ variant, quantity }: OrderItemWithDetails) => {
            const { product, price, salePrice, isOnSale } = variant || {};

            return (
              <div
                className="relative flex w-full max-w-full flex-row items-center bg-brand-black p-3 text-brand-white"
                key={"cartItem-" + product?.name}
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
          <div>Order Total: ${order?.totalPrice.toFixed(2)}</div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PaymentConfirm;
