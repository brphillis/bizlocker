import {
  type LoaderArgs,
  type ActionArgs,
  redirect,
} from "@remix-run/server-runtime";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import PageWrapper from "~/components/Layout/_Website/PageWrapper";
import squareLogo from "../assets/logos/square-logo.svg";
import googlePayLogo from "../assets/logos/googlePay-logo.svg";
import applePayLogo from "../assets/logos/applePay-logo.svg";
import visaLogo from "../assets/logos/visa-logo.svg";
import mastercardLogo from "../assets/logos/mastercard-logo.svg";
import { getCart } from "~/models/cart.server";
import { createOrder } from "~/models/orders.server";
import {
  calculateCartTotal,
  getVariantUnitPrice,
} from "~/utility/numberHelpers";
import CartAddSubtractButton from "~/components/Layout/_Website/Navigation/Buttons/CartButton/CartAddSubtractButton";

export const loader = async ({ request }: LoaderArgs) => {
  const cart = await getCart(request);
  if (cart) {
    return cart;
  } else {
    return redirect("/products");
  }
};

export const action = async ({ request }: ActionArgs) => {
  const createdOrder = await createOrder(request);
  return createdOrder;
};

const Cart = () => {
  const cart = useLoaderData();
  const { cartItems } = (cart as { cartItems: CartItem[] }) || {};
  const [orderTotal, setOrderTotal] = useState<number>(0);

  useEffect(() => {
    const total = calculateCartTotal(cartItems);
    setOrderTotal(total);
  }, [cartItems]);

  return (
    <PageWrapper>
      <div className="relative flex h-max max-w-full flex-row flex-wrap items-start justify-center gap-3 py-0 max-md:px-3 md:py-6 lg:gap-6">
        <div className="max-w-full py-0 max-md:py-6">
          <div className="mb-6 hidden select-none text-center max-md:block">
            <h1 className="text-3xl">Your Cart</h1>
            <div className="opacity-50">Track your Order History</div>
          </div>

          <div className="flex flex-col flex-wrap items-start justify-center gap-3">
            {cartItems
              ?.sort((a, b) =>
                a.variant.product.name.localeCompare(b.variant.product.name)
              )
              .reverse()
              .map(({ variant, quantity }: CartItem) => {
                const { product, id: variantId } = variant;
                const { images, name } = product;

                return (
                  <div
                    className="relative flex w-[420px] max-w-full flex-row items-center border border-base-300 bg-base-200/50 p-2 text-brand-black shadow-sm"
                    key={"cartItem-" + name}
                  >
                    <img
                      className="h-20 w-20 border border-base-300 object-cover md:h-[8.8rem] md:w-[8.8rem]"
                      src={images[0].url}
                      alt={name + "_cartImage"}
                    />
                    <div className="relative w-full text-center">
                      <div>
                        {name} x {quantity}
                      </div>
                      <div className="text-xs opacity-50">{variant?.name}</div>
                      <div className="!rounded-none">
                        ${getVariantUnitPrice(variant, product) + " ea"}
                      </div>

                      {variantId && (
                        <>
                          <CartAddSubtractButton
                            mode="subtract"
                            variantId={variantId?.toString()}
                            extendStyle="absolute bottom-[34%] left-8"
                          />

                          <CartAddSubtractButton
                            mode="add"
                            variantId={variantId?.toString()}
                            extendStyle="absolute bottom-[34%] right-8"
                          />
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <Form
          method="POST"
          className="order-1 flex min-w-full flex-col items-center justify-center border border-base-300 bg-base-200/50 px-3 py-6 text-brand-black shadow-sm md:min-w-[400px]"
        >
          <div className="hidden select-none text-center md:block">
            <h1 className="text-3xl">Your Cart</h1>
            <div className="opacity-50">Track your Order History</div>
          </div>

          <div className="mt-6 hidden h-1 w-full border-t border-brand-black/10 md:block" />

          <div className="flex flex-col py-3 text-center max-md:pt-0">
            <div>Sub Total: $ {orderTotal.toFixed(2)} </div>

            <div className="my-0">+</div>

            <div>Shipping Options</div>
            <select
              name="productCategory"
              title="category"
              className=" select mt-3 w-[215px] border border-base-300 !font-normal text-brand-black/50"
              placeholder="Select a Value"
              defaultValue=""
            >
              <option className="text-center" value="">
                Standard - $4.99
              </option>

              <option>shipping</option>
            </select>
          </div>

          <input name="cartId" value={cart?.id || ""} readOnly hidden />
          <button
            type="submit"
            className="btn btn-success relative font-bold tracking-wide !text-white"
          >
            Continue to Checkout
          </button>

          <div className="mt-6 h-1 w-full border-t border-brand-black/10" />

          <div className="mt-3 flex select-none flex-col items-center gap-3">
            <div className="flex flex-row gap-6 px-6 py-3">
              <img
                className="h-6 w-auto rounded-md bg-white/75 p-1 shadow-sm"
                src={googlePayLogo}
                alt="google_pay_logo"
              />
              <img
                className="h-6 w-auto rounded-md bg-white/75 p-1 shadow-sm"
                src={applePayLogo}
                alt="apple_pay_logo"
              />
              <img
                className="h-6 w-auto rounded-md bg-white/75 px-2 py-1 shadow-sm"
                src={mastercardLogo}
                alt="mastercard_logo"
              />
              <img
                className="h-6 w-auto rounded-md bg-white/75 p-1 shadow-sm"
                src={visaLogo}
                alt="visa_logo"
              />
            </div>
            <div className="opacity-50">Secure Payments By</div>
            <img src={squareLogo} alt="square_pay_logo" />
          </div>
        </Form>
      </div>
    </PageWrapper>
  );
};

export default Cart;
