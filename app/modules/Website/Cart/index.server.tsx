import { Params } from "@remix-run/react";
import type { Address } from "@prisma/client";
import { validateForm } from "~/utility/validate";
import { createOrder } from "~/models/orders.server";
import { getUserAddress } from "~/models/userAddress";
import { getUserDetails } from "~/models/userDetails";
import { getUserDataFromSession } from "~/session.server";
import { json, type MetaFunction } from "@remix-run/node";
import type { NewAddress } from "~/helpers/addressHelpers";
import { getCartDeliveryOptions } from "~/helpers/cartHelpers";
import { getCart, type CartWithDetails } from "~/models/cart.server";

export const meta: MetaFunction<typeof cartLoader> = ({ data }) => {
  return [
    { title: "CLUTCH | Your Cart" },
    {
      name: "CLUTCH | Your Cart",
      content: "CLUTCH | Your Cart",
    },
  ];
};

export const cartLoader = async (request: Request, params: Params<string>) => {
  let cart, user, userAddress, loaderShippingOptions, userDetails;

  cart = await getCart(request);
  user = await getUserDataFromSession(request);

  if (user) {
    userAddress = await getUserAddress(user.id.toString());
    userDetails = await getUserDetails(user.id.toString());
  }

  if (userAddress && cart) {
    loaderShippingOptions = await getCartDeliveryOptions(
      cart,
      parseInt(userAddress.postcode!),
    );
  }

  return json({ cart, user, userAddress, userDetails, loaderShippingOptions });
};

export const cartAction = async (request: Request, params: Params<string>) => {
  const validate = {
    firstName: true,
    lastName: true,
    email: true,
    addressLine1: true,
    suburb: true,
    postcode: true,
    state: true,
    country: true,
    phoneNumber: true,
    shippingOptions: true,
  };

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validate,
  );

  switch (formEntries._action) {
    case "placeOrder":
      if (formErrors) {
        return json({ validationErrors: formErrors });
      }

      const {
        rememberInformation,
        firstName,
        lastName,
        email,
        phoneNumber,
        addressLine1,
        addressLine2,
        suburb,
        postcode,
        state,
        country,
        shippingOptions,
      } = formEntries;

      const address: NewAddress = {
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
        email as string,
        phoneNumber as string,
        address as Address,
        shippingMethod as string,
        shippingPrice as string,
        rememberInformation ? true : false,
      );
      return createdOrder;

    case "getShipping":
      const cart = await getCart(request);
      const { postCode } = formEntries;

      if (cart && !isNaN(parseInt(postCode as string))) {
        const actionShippingOptions = await getCartDeliveryOptions(
          cart as unknown as CartWithDetails,
          parseInt(postCode as string),
        );
        return json({ actionShippingOptions });
      } else return null;
  }
};
