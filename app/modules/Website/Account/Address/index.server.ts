import { Params } from "@remix-run/react";
import type { User } from "@prisma/client";
import { validateForm } from "~/utility/validate";
import { getUserDataFromSession } from "~/session.server";
import { json, type MetaFunction } from "@remix-run/node";
import { getUserAddress, upsertUserAddress } from "~/models/userAddress";

export const meta: MetaFunction<typeof accountAddressLoader> = ({ data }) => {
  return [
    { title: "CLUTCH | Your Account" },
    {
      name: "CLUTCH | Your Account",
      content: "CLUTCH | Your Account",
    },
  ];
};

export const accountAddressLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const { id } = ((await getUserDataFromSession(request)) as User) || {};
  const userAddress = await getUserAddress(id.toString());

  return json({ userAddress });
};

export const accountAddressAction = async (
  request: Request,
  params: Params<string>,
) => {
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
