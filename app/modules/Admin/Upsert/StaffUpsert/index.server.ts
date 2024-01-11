import { json } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import { validateForm } from "~/utility/validate";
import { getStores } from "~/models/stores.server";
import type { Image, Staff } from "@prisma/client";
import { getAvailableRoles } from "~/models/enums.server";
import type { PageNotification } from "~/hooks/PageNotification";
import { getUserDataFromSession, STAFF_SESSION_KEY } from "~/session.server";
import {
  getStaff,
  type StaffWithDetails,
  upsertStaff,
} from "~/models/staff.server";

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
  password: false,
};

export const staffUpsertLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const { role } =
    ((await getUserDataFromSession(request, STAFF_SESSION_KEY)) as Staff) || {};

  const roles = await getAvailableRoles();
  const stores = await getStores();

  let { searchParams } = new URL(request.url);
  let id = searchParams.get("contentId");

  if (!id) {
    throw new Response(null, {
      status: 404,
      statusText: "Staff Not Found",
    });
  }

  const staffMember =
    id === "add" ? ({} as StaffWithDetails) : await getStaff(id);

  if (!staffMember) {
    throw new Response(null, {
      status: 404,
      statusText: "Staff Not Found",
    });
  }

  return json({ staffMember, roles, stores, role });
};

export const staffUpsertAction = async (
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
    role,
    jobTitle,
    store,
    password,
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
    isActive: isActive ? true : false,
    avatar: avatar ? (JSON.parse(avatar?.toString()) as Image) : undefined,
    role: role as string,
    jobTitle: jobTitle as string,
    store: store as string,
    id: id as string,
    ...(password && { password: password as string }),
  };

  let permissionError, success;

  try {
    await upsertStaff(request, updateData);
    success = true;
  } catch (err) {
    permissionError = err;
  }

  notification = {
    type: "success",
    message: `User ${id === "add" ? "Added" : "Updated"}.`,
  };

  return json({ success, permissionError, notification });
};
