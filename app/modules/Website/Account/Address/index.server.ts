import type { User } from "@prisma/client";
import { validateForm } from "~/utility/validate";
import { getUserDataFromSession } from "~/session.server";
import { json } from "@remix-run/node";
import {
  getUserAddress,
  upsertUserAddress,
} from "~/models/Address/index.server";

export const accountAddressLoader = async (request: Request) => {
  const { id } = ((await getUserDataFromSession(request)) as User) || {};
  const userAddress = await getUserAddress(id.toString());

  const meta = {
    title: "CLUTCH | Address",
    description:
      "Discover timeless style and effortless sophistication with Clutch Clothing Australia. Elevate your wardrobe with our curated collection of premium apparel, designed for the modern Australian lifestyle. Explore our range today and experience fashion that's as versatile as you are.",
  };

  return json({ meta, userAddress });
};

export const accountAddressAction = async (request: Request) => {
  const { id } = ((await getUserDataFromSession(request)) as User) || {};

  const validate = {
    addressLine1: true,
    suburb: true,
    postcode: true,
    state: true,
    country: true,
  };

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validate,
  );

  if (formErrors) {
    return json({ validationErrors: formErrors });
  }

  const { addressLine1, addressLine2, suburb, postcode, state, country } =
    formEntries;

  const updateData = {
    id,
    addressLine1: addressLine1 as string,
    addressLine2: addressLine2 as string,
    suburb: suburb as string,
    postcode: postcode as string,
    state: state as string,
    country: country as string,
  };
  await upsertUserAddress(updateData);

  return json({ success: "Address Updated" });
};
