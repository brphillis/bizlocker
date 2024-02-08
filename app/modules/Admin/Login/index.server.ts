import { json } from "@remix-run/node";
import { createStaffSession } from "~/session.server";
import { verifyStaffLogin } from "~/models/_Auth/staffLogin";
import {
  ValidationErrors,
  isValidEmail,
  isValidPassword,
} from "~/utility/validate";
import { isEmptyObject } from "~/helpers/objectHelpers";

export const adminLoginAction = async (request: Request) => {
  const form = Object.fromEntries(await request.formData());
  const { email, password, remember } = form;

  const validationErrors: ValidationErrors = {};

  if (!isValidEmail(email as string)) {
    validationErrors.email = "Invalid Email Address";
  }

  if (!isValidPassword(password as string)) {
    validationErrors.password = "Password Does Not Meet Requirements";
  }

  if (!isEmptyObject(validationErrors)) {
    return json({ validationErrors: validationErrors });
  }

  try {
    const { staff } = await verifyStaffLogin(
      email as string,
      password as string,
    );

    return await createStaffSession({
      request,
      user: JSON.stringify(staff),
      remember: remember === "on" ? true : false,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof Error) {
      const validationErrors: ValidationErrors = {};
      validationErrors.error = error.message;

      return json({ validationErrors });
    } else {
      throw new Response(null, {
        status: 500,
        statusText: "An Unexpected Error Has Occured",
      });
    }
  }
};
