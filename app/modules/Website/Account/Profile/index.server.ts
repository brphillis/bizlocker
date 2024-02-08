import { User } from "@prisma/client";
import { tokenAuth } from "~/auth.server";
import { validateForm } from "~/utility/validate";
import { getUserDataFromSession } from "~/session.server";
import { NewUserDetails } from "~/models/UserDetails/types";
import { json, redirect } from "@remix-run/node";
import {
  getUserDetails,
  upsertUserDetails,
} from "~/models/UserDetails/index.server";

export const accountProfileLoader = async (request: Request) => {
  const authenticated = await tokenAuth(request);
  if (!authenticated.valid) {
    return redirect("/login");
  }

  const { id, email } = ((await getUserDataFromSession(request)) as User) || {};
  const userDetails = await getUserDetails(id.toString());

  const meta = {
    title: "CLUTCH | Profile",
    description:
      "Discover timeless style and effortless sophistication with Clutch Clothing Australia. Elevate your wardrobe with our curated collection of premium apparel, designed for the modern Australian lifestyle. Explore our range today and experience fashion that's as versatile as you are.",
  };

  return json({ meta, userDetails, email });
};

export const accountProfileAction = async (request: Request) => {
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
