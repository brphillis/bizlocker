import { tokenAuth } from "~/auth.server";
import { Params } from "@remix-run/react";
import type, { User } from "@prisma/client";
import { validateForm } from "~/utility/validate";
import { getUserDataFromSession } from "~/session.server";
import { json, redirect, type MetaFunction } from "@remix-run/node";
import {
  getUserDetails,
  type NewUserDetails,
  upsertUserDetails,
} from "~/models/userDetails";

export const meta: MetaFunction<typeof accountProfileLoader> = ({ data }) => {
  return [
    { title: "CLUTCH | Your Profile" },
    {
      name: "CLUTCH | Your Profile",
      content: "CLUTCH | Your Profile",
    },
  ];
};

export const accountProfileLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const authenticated = await tokenAuth(request);
  if (!authenticated.valid) {
    return redirect("/login");
  }

  const { id, email } = ((await getUserDataFromSession(request)) as User) || {};
  const userDetails = await getUserDetails(id.toString());
  return json({ userDetails, email });
};

export const accountProfileAction = async (
  request: Request,
  params: Params<string>,
) => {
  const authenticated = await tokenAuth(request);
  if (!authenticated.valid) {
    return redirect("/login");
  }

  const { id } = ((await getUserDataFromSession(request)) as User) || {};

  const validate = {
    firstName: true,
    lastName: true,
    dateofbirth: true,
    phoneNumber: true,
  };

  const { formErrors, formEntries } = validateForm(
    await request.formData(),
    validate,
  );

  const { firstName, lastName, dateofbirth, phoneNumber } = formEntries;

  if (formErrors) {
    return json({ validationErrors: formErrors });
  }

  const updateData: NewUserDetails = {
    id: id.toString(),
    firstName: firstName as string,
    lastName: lastName as string,
    dateOfBirth: dateofbirth as string,
    phoneNumber: phoneNumber as string,
  };

  await upsertUserDetails(updateData);

  return json({ success: "Profile Updated" });
};
