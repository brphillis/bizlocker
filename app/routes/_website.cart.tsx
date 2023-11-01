import {
  type LoaderArgs,
  type ActionArgs,
  redirect,
} from "@remix-run/server-runtime";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
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
} from "~/helpers/numberHelpers";
import CartAddSubtractButton from "~/components/Layout/_Website/Navigation/Buttons/CartButton/CartAddSubtractButton";
import { getUserDataFromSession } from "~/session.server";
import BasicInput from "~/components/Forms/Input/BasicInput";
import { getUserAddress } from "~/models/auth/userAddress";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import { getCartDeliveryOptions } from "~/helpers/cartHelpers";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { getUserDetails } from "~/models/auth/userDetails";

export const loader = async ({ request }: LoaderArgs) => {
  let cart, user, userAddress, loaderShippingOptions, userDetails;
  cart = await getCart(request);
  user = await getUserDataFromSession(request);

  if (user) {
    userAddress = await getUserAddress(user.id);
    userDetails = await getUserDetails(user.id);

    if (userAddress && cart) {
      loaderShippingOptions = await getCartDeliveryOptions(
        cart as unknown as Cart,
        parseInt(userAddress.postcode!)
      );
    }

    return { cart, user, userAddress, userDetails, loaderShippingOptions };
  } else {
    return redirect("/products");
  }
};

export const action = async ({ request }: ActionArgs) => {
  const form = Object.fromEntries(await request.formData());

  switch (form._action) {
    case "placeOrder":
      const {
        rememberInformation,
        addressLine1,
        addressLine2,
        suburb,
        postcode,
        state,
        country,
        firstName,
        lastName,
        shippingOptions,
      } = form;

      const address: Address = {
        addressLine1: addressLine1 as string,
        addressLine2: addressLine2 as string,
        suburb: suburb as string,
        postcode: postcode as string,
        state: state as string,
        country: country as string,
      };

      const shippingOptionsSplit = (shippingOptions as string).split("_");
      const shippingMethod = shippingOptionsSplit[0];
      const shippingPrice = shippingOptionsSplit[1];

      const createdOrder = await createOrder(
        request,
        firstName as string,
        lastName as string,
        address,
        shippingMethod as string,
        shippingPrice as string,
        rememberInformation ? true : false
      );
      return createdOrder;

    case "getShipping":
      const cart = await getCart(request);
      const { postCode } = form;

      if (cart && !isNaN(parseInt(postCode as string))) {
        const actionShippingOptions = await getCartDeliveryOptions(
          cart as unknown as Cart,
          parseInt(postCode as string)
        );
        return { actionShippingOptions };
      } else return null;
  }
};

const Cart = () => {
  const submit = useSubmit();
  const { cart, user, userAddress, userDetails, loaderShippingOptions } =
    useLoaderData() || {};
  const { validationErrors, actionShippingOptions } =
    (useActionData() as {
      success: string;
      validationErrors: ValidationErrors;
      actionShippingOptions: AusPostDeliveryOption[];
    }) || {};
  const { cartItems } = (cart as { cartItems: CartItem[] }) || {};
  const [orderTotal, setOrderTotal] = useState<number>(0);

  const handleUpdateShipping = (postCode: string) => {
    const formData = new FormData();
    formData.set("_action", "getShipping");
    formData.set("postCode", postCode);
    submit(formData, { method: "POST" });
  };

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
                    className="relative flex w-[420px] max-w-full flex-row items-center rounded-sm border border-base-300 bg-base-200/50 p-2 text-brand-black shadow-sm"
                    key={"cartItem-" + name}
                  >
                    <img
                      className="h-20 w-20 border border-base-300 object-cover md:h-[8.8rem] md:w-[8.8rem]"
                      src={images[0].href}
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
          className="order-1 flex min-w-full flex-col items-center justify-center rounded-sm border border-base-300 bg-base-200/50 px-3 py-6 text-brand-black shadow-sm md:min-w-[400px]"
        >
          <div className="hidden select-none text-center md:block">
            <h1 className="text-2xl">Delivery Address</h1>
          </div>

          <div className="mt-6 hidden h-1 w-full border-t border-brand-black/10 md:block" />

          <BasicInput
            name="firstName"
            label="First Name"
            placeholder="First Name"
            customWidth="w-full"
            styles="input-bordered"
            type="text"
            defaultValue={userDetails?.firstName || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="lastName"
            label="Last Name"
            placeholder="Last Name"
            customWidth="w-full"
            styles="input-bordered"
            type="text"
            defaultValue={userDetails?.lastName || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="addressLine1"
            label="Address Line 1"
            placeholder="Address Line 1"
            customWidth="w-full"
            styles="input-bordered"
            type="text"
            defaultValue={userAddress?.addressLine1 || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="addressLine2"
            label="Address Line 2"
            placeholder="Address Line 2"
            customWidth="w-full"
            styles="input-bordered"
            type="text"
            defaultValue={userAddress?.addressLine2 || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="suburb"
            label="Suburb"
            placeholder="Suburb"
            customWidth="w-full"
            styles="input-bordered"
            type="text"
            defaultValue={userAddress?.suburb || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="postcode"
            label="PostCode"
            placeholder="PostCode"
            customWidth="w-full"
            styles="input-bordered"
            type="text"
            defaultValue={userAddress?.postcode || undefined}
            validationErrors={validationErrors}
            onChange={(e) => {
              if (e && e.toString().length >= 4) {
                handleUpdateShipping(e as string);
              }
            }}
          />

          <BasicInput
            name="state"
            label="State"
            placeholder="State"
            customWidth="w-full"
            styles="input-bordered"
            type="text"
            defaultValue={userAddress?.state || undefined}
            validationErrors={validationErrors}
          />

          <SelectCountry
            defaultValue={userAddress?.country}
            validationErrors={validationErrors}
            styles="!w-full"
          />

          <div className="mt-3 flex w-full flex-col py-3 text-center max-md:pt-0">
            <div>Sub Total: $ {orderTotal.toFixed(2)} </div>

            {(actionShippingOptions || loaderShippingOptions) && (
              <>
                <div className="my-0">+</div>
                <BasicSelect
                  name="shippingOptions"
                  label="Shipping Options"
                  placeholder="Shipping Options"
                  customWidth="!w-full"
                  selections={(
                    actionShippingOptions || loaderShippingOptions
                  ).map((e) => {
                    return {
                      id: e.name + "_" + e.price,
                      name: "AUS POST | " + e.name + " | $" + e.price,
                    };
                  })}
                />
              </>
            )}
          </div>

          {user && (
            <div className="form-control pb-3">
              <label className="label cursor-pointer">
                <span className="label-text mr-3">
                  Save Shipping Information
                </span>
                <input
                  name="rememberInformation"
                  type="checkbox"
                  defaultChecked={true}
                  className="checkbox-primary checkbox checkbox-sm"
                />
              </label>
            </div>
          )}

          <input name="cartId" value={cart?.id || ""} readOnly hidden />

          <div className="flex flex-col justify-center gap-3">
            <button
              type="submit"
              name="_action"
              value="placeOrder"
              className="btn btn-primary relative !rounded-sm font-bold tracking-wide !text-white"
            >
              Continue to Checkout
            </button>
          </div>

          {/* <div className="form-control w-[215px]">
            <label className="label">
              <span className="label-text">What is your name?</span>
            </label>
            <input
              type="number"
              placeholder="Post Code"
              className="input input-bordered w-full"
            />
          </div> */}

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
