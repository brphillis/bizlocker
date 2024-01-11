import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import type { PageNotification } from "~/hooks/PageNotification";
import {
  getStore,
  type NewStore,
  type StoreWithDetails,
  upsertStore,
} from "~/models/stores.server";

const validateOptions = {
  name: true,
  phoneNumber: true,
  addressLine1: true,
  postcode: true,
  suburb: true,
  state: true,
  country: true,
  latitude: true,
  longitude: true,
};

export const storeUpsertLoader = async (
  request: Request,
  params: Params<string>,
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Store Not Found",
    });
  }

  const store = id === "add" ? ({} as StoreWithDetails) : await getStore(id);

  if (!store) {
    throw new Response(null, {
      status: 404,
      statusText: "Store Not Found",
    });
  }

  return json({ store });
};

export const storeUpsertAction = async (
  request: Request,
  params: Params<string>,
) => {
  let notification: PageNotification;

  let { searchParams } = new URL(request.url);
  const contentId = searchParams.get("contentId");
  let id = contentId === "add" || !contentId ? undefined : contentId;

  const { formEntries, formErrors } = validateForm(
    await request.formData(),
    validateOptions,
  );

  const {
    name,
    dateofbirth,
    phoneNumber,
    faxNumber,
    addressLine1,
    addressLine2,
    postcode,
    suburb,
    state,
    country,
    longitude,
    latitude,
    paymentProviderId,
    isActive,
  } = formEntries;

  if (formErrors) {
    return { serverValidationErrors: formErrors };
  }

  const updateData: NewStore = {
    name: name as string,
    dateOfBirth: new Date(dateofbirth as string),
    phoneNumber: phoneNumber as string,
    faxNumber: faxNumber as string,
    addressLine1: addressLine1 as string,
    addressLine2: addressLine2 as string,
    postcode: postcode as string,
    suburb: suburb as string,
    state: state as string,
    country: country as string,
    longitude: longitude as string,
    latitude: latitude as string,
    paymentProviderId: paymentProviderId as string,
    isActive: isActive ? true : false,
    id: id,
  };

  await upsertStore(updateData);

  notification = {
    type: "success",
    message: `Store ${id === "add" ? "Added" : "Updated"}.`,
  };

  return json({ success: true, notification });
};
