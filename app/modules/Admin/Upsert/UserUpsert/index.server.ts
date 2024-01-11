import { json } from "@remix-run/node";
import type { Image } from "@prisma/client";
import type { Params } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import type { PageNotification } from "~/hooks/PageNotification";
import {
  getUser,
  type UserWithDetails,
  upsertUser,
} from "~/models/users.server";

const validateOptions = {
  email: true,
  firstName: true,
  lastName: true,
  dateofbirth: true,
  phoneNumber: true,
  addressLine1: true,
  postcode: true,
  suburb: true,
  state: true,
  country: true,
};

export const userUpsertLoader = async (
  request: Request,
  params: Params<string>,
) => {
  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "User Not Found",
    });
  }

  const user = id === "add" ? ({} as UserWithDetails) : await getUser(id);

  if (!user) {
    throw new Response(null, {
      status: 404,
      statusText: "User Not Found",
    });
  }

  return json({ user });
};

export const userUpsertAction = async (
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
    email,
    firstName,
    lastName,
    dateofbirth,
    phoneNumber,
    addressLine1,
    addressLine2,
    postcode,
    suburb,
    state,
    country,
    avatar,
    isActive,
  } = formEntries;

  if (formErrors) {
    return { serverValidationErrors: formErrors };
  }

  const updateData = {
    email: email as string,
    firstName: firstName as string,
    lastName: lastName as string,
    dateOfBirth: new Date(dateofbirth as string),
    phoneNumber: phoneNumber as string,
    addressLine1: addressLine1 as string,
    addressLine2: addressLine2 as string,
    postcode: postcode as string,
    suburb: suburb as string,
    state: state as string,
    country: country as string,
    isActive: id ? (isActive ? true : false) : false,
    avatar: avatar ? (JSON.parse(avatar?.toString()) as Image) : undefined,
    id: id,
  };

  await upsertUser(updateData);

  notification = {
    type: "success",
    message: `User ${id === "add" ? "Added" : "Updated"}.`,
  };

  return json({ success: true, notification });
};
