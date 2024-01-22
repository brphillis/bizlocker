import { useLoaderData } from "@remix-run/react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { type OrderItemWithDetails } from "~/models/orders.server";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";
import { paymentConfirmLoader } from "~/modules/Website/PaymentConfirm/index.server";

const PaymentConfirm = () => {
  const order = useLoaderData<typeof paymentConfirmLoader>();

  const { items } = order || {};

  return (
    <PageWrapper>
      <div className="w-[520px] max-w-full bg-base-100 px-0 lg:px-3">
        <div className="mt-3 flex flex-col items-center gap-3">
          <h1 className="text-center text-2xl">
            Your Payment Has Been Successful
          </h1>

          <IoCheckmarkCircle size={42} className="text-success" />

          <p className="text-xs opacity-50"># - {order?.id}</p>
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
