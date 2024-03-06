import { useEffect, useState } from "react";
import BasicImage from "~/components/Client/BasicImage";
import { CartItemWithDetails } from "~/models/Cart/types";
import BasicInput from "~/components/Forms/Input/BasicInput";
import PhoneInput from "~/components/Forms/Input/PhoneInput";
import { ActionReturnTypes } from "~/utility/actionTypes";
import BasicSelect from "~/components/Forms/Select/BasicSelect";
import { cartLoader } from "~/modules/Website/Cart/index.server";
import PageWrapper from "~/components/Layout/Wrappers/PageWrapper";
import SelectCountry from "~/components/Forms/Select/SelectCountry";
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";
import {
  calculateCartTotal,
  getVariantUnitPrice,
} from "~/helpers/numberHelpers";
import CartAddSubtractButton from "~/components/Layout/_Website/Navigation/Buttons/CartButton/CartAddSubtractButton";
import visaLogo from "../../../assets/logos/visa-logo.svg";
import applePayLogo from "../../../assets/logos/applePay-logo.svg";
import googlePayLogo from "../../../assets/logos/googlePay-logo.svg";
import mastercardLogo from "../../../assets/logos/mastercard-logo.svg";
import solanaLogo from "../../../assets/logos/solana-logo.svg";
import { WalletAdapterButton } from "~/integrations/wallets/solflare";
import { ClientOnly } from "~/components/Client/ClientOnly";

const Cart = () => {
  const submit = useSubmit();

  const {
    cart,
    user,
    userAddress,
    userDetails,
    loaderShippingOptions,
    solanaPriceAUD,
  } = useLoaderData<typeof cartLoader>();

  const {
    validationErrors,
    actionShippingOptions,
    solanaTransaction,
    transactionResponse,
  } = (useActionData() as ActionReturnTypes) || {};

  const { cartItems } = cart || {};

  const [orderTotal, setOrderTotal] = useState<number>(0);

  const handleUpdateShipping = (postCode: string) => {
    const formData = new FormData();
    formData.set("_action", "getShipping");
    formData.set("postCode", postCode);
    submit(formData, { method: "POST" });
  };

  useEffect(() => {
    if (cartItems) {
      const total = calculateCartTotal(cartItems);
      setOrderTotal(total);
    }
  }, [cartItems]);

  return (
    <PageWrapper>
      <div className="relative flex h-max max-w-full flex-row flex-wrap items-start justify-center gap-3 py-0 max-md:px-3 md:py-6 lg:gap-6">
        <div className="max-w-full py-0 max-md:py-3">
          <div className="mb-6 hidden select-none text-center max-md:block">
            <h1 className="text-3xl">Your Cart</h1>
            <div className="opacity-50">Track your Order History</div>
          </div>

          <div className="flex flex-col flex-wrap items-start justify-center gap-3">
            {cartItems?.map(({ variant, quantity }: CartItemWithDetails) => {
              const { product, id: variantId } = variant || {};
              const { images, name } = product || {};

              return (
                <div
                  className="relative flex w-[420px] max-w-full flex-row items-center rounded-sm border border-base-300 bg-base-200/50 p-2 text-brand-black shadow-sm"
                  key={"cartItem-" + name}
                >
                  {images?.[0].href && (
                    <BasicImage
                      extendStyle="h-20 w-20 border border-base-300 object-cover md:h-[8.8rem] md:w-[8.8rem]"
                      src={images[0].href}
                      alt={name + "_cartImage"}
                    />
                  )}
                  <div className="relative w-full text-center">
                    <div>
                      {name} x {quantity}
                    </div>
                    <div className="text-xs opacity-50">{variant?.name}</div>
                    <div className="!rounded-none">
                      $
                      {variant &&
                        product &&
                        getVariantUnitPrice(variant, product) + " ea"}
                    </div>

                    {variantId && (
                      <>
                        <CartAddSubtractButton
                          mode="subtract"
                          variantId={variantId?.toString()}
                          extendStyle="absolute bottom-[20%] left-2"
                        />

                        <CartAddSubtractButton
                          mode="add"
                          variantId={variantId?.toString()}
                          extendStyle="absolute bottom-[20%] right-2"
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
          id="CheckoutForm"
          method="POST"
          className="order-1 flex min-w-full flex-col items-center justify-center rounded-sm border border-base-300 bg-base-200/50 px-3 py-3 text-brand-black shadow-sm md:min-w-[400px]"
        >
          <div className="hidden select-none text-center md:block">
            <h1 className="text-2xl">Delivery Address</h1>
          </div>

          <div className="mt-6 hidden h-1 w-full border-t border-brand-black/10 md:block" />

          <BasicInput
            name="firstName"
            label="First Name"
            placeholder="First Name"
            extendContainerStyle="w-full"
            extendStyle="input-bordered"
            type="text"
            defaultValue={userDetails?.firstName || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="lastName"
            label="Last Name"
            placeholder="Last Name"
            extendContainerStyle="w-full"
            extendStyle="input-bordered"
            type="text"
            defaultValue={userDetails?.lastName || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="email"
            label="Email Address"
            placeholder="Email Address"
            extendContainerStyle="w-full"
            extendStyle="input-bordered"
            type="text"
            defaultValue={user?.email || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="addressLine1"
            label="Address Line 1"
            placeholder="Address Line 1"
            extendContainerStyle="w-full"
            extendStyle="input-bordered"
            type="text"
            defaultValue={userAddress?.addressLine1 || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="addressLine2"
            label="Address Line 2"
            placeholder="Address Line 2"
            extendContainerStyle="w-full"
            extendStyle="input-bordered"
            type="text"
            defaultValue={userAddress?.addressLine2 || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="suburb"
            label="Suburb"
            placeholder="Suburb"
            extendContainerStyle="w-full"
            extendStyle="input-bordered"
            type="text"
            defaultValue={userAddress?.suburb || undefined}
            validationErrors={validationErrors}
          />

          <BasicInput
            name="postcode"
            label="PostCode"
            placeholder="PostCode"
            extendContainerStyle="w-full"
            extendStyle="input-bordered"
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
            extendContainerStyle="w-full"
            extendStyle="input-bordered"
            type="text"
            defaultValue={userAddress?.state || undefined}
            validationErrors={validationErrors}
          />

          <PhoneInput
            name="phoneNumber"
            label="Phone Number"
            placeholder="Phone Number"
            extendContainerStyle="w-full"
            extendStyle="input-bordered"
            type="text"
            defaultValue={userDetails?.phoneNumber || undefined}
            validationErrors={validationErrors}
          />

          <SelectCountry
            defaultValue={userAddress?.country}
            validationErrors={validationErrors}
            extendStyle="!w-full"
          />

          <div className="mt-3 flex w-full flex-col py-3 text-center max-md:pt-0">
            <div className="pt-2 pb-1">
              Sub Total: $ {orderTotal.toFixed(2)} AUD{" "}
            </div>
            <input
              name="orderTotal"
              value={orderTotal.toFixed(2)}
              readOnly
              hidden
            />

            {(actionShippingOptions || loaderShippingOptions) && (
              <>
                <BasicSelect
                  name="shippingOptions"
                  label="Shipping Options"
                  placeholder="Shipping Options"
                  extendContainerStyle="!w-full"
                  defaultValue={undefined}
                  selections={(
                    actionShippingOptions || loaderShippingOptions
                  ).map((e) => {
                    return {
                      id: e.name + "_" + e.price,
                      name: e.name + " | $" + e.price,
                    };
                  })}
                  validationErrors={validationErrors}
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
              value="squareCheckout"
              className="btn btn-primary relative !rounded-sm font-bold tracking-wide !text-white"
            >
              Checkout
            </button>

            <ClientOnly>
              {() => (
                <WalletAdapterButton
                  solanaPriceAUD={solanaPriceAUD}
                  solanaTransaction={solanaTransaction}
                  transactionResponse={transactionResponse}
                />
              )}
            </ClientOnly>
          </div>

          <div className="mt-6 h-1 w-full border-t border-brand-black/10" />

          <div className="py-3 flex select-none flex-col items-center gap-3">
            <div className="flex flex-row gap-6 px-6 py-3 flex-wrap justify-center">
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

              <img
                className="h-6 w-auto rounded-md bg-white/75 p-1 shadow-sm"
                src={solanaLogo}
                alt="solana_logo"
              />
            </div>
          </div>
        </Form>
      </div>
    </PageWrapper>
  );
};

export default Cart;
