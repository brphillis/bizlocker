import { Address } from "@prisma/client";
import { validateForm } from "~/utility/validate";
import { getCart } from "~/models/Cart/index.server";
import { CartWithDetails } from "~/models/Cart/types";
import { getUserDataFromSession } from "~/session.server";
import { json } from "@remix-run/node";
import { createOrder } from "~/models/Orders/index.server";
import { NewAddress } from "~/helpers/addressHelpers";
import { getUserAddress } from "~/models/Address/index.server";
import { getCartDeliveryOptions } from "~/helpers/cartHelpers";
import { getUserDetails } from "~/models/UserDetails/index.server";

export const cartLoader = async (request: Request) => {
  const cart = await getCart(request);
  const user = await getUserDataFromSession(request);

  let userAddress, loaderShippingOptions, userDetails;

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

  const meta = {
    title: "CLUTCH | Cart",
    description:
      "Discover timeless style and effortless sophistication with Clutch Clothing Australia. Elevate your wardrobe with our curated collection of premium apparel, designed for the modern Australian lifestyle. Explore our range today and experience fashion that's as versatile as you are.",
  };

  return json({
    meta,
    cart,
    user,
    userAddress,
    userDetails,
    loaderShippingOptions,
  });
};

export const cartAction = async (request: Request) => {
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
    case "placeOrder": {
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

      console.log("SHIPPING", shippingPrice);

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
    }
    case "getShipping": {
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
  }
};
