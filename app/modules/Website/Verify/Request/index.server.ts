import { Params } from "@remix-run/react";
import { verifyLogin } from "~/models/auth/login.server";
import { json, type MetaFunction } from "@remix-run/node";
import {
  ValidationErrors,
  isValidEmail,
  isValidPassword,
} from "~/utility/validate";
import { requestNewVerifyEmail } from "~/models/auth/verification.server";
import { isEmptyObject } from "~/helpers/objectHelpers";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: "CLUTCH | Verification" },
    {
      name: "CLUTCH | Verification",
      content: "CLUTCH | Verification",
    },
  ];
};

export const verifyRequestAction = async (
  request: Request,
  params: Params<string>,
) => {
  const form = Object.fromEntries(await request.formData());
  const { email, password } = form;
  const validationErrors: ValidationErrors = {};

  if (!isValidEmail(email as string)) {
    validationErrors.email = "Invalid Email Address";
  }

  if (!isValidPassword(password as string)) {
    validationErrors.passwordRequirements =
      "Password Does Not Meet Requirements";
  }

  if (!isEmptyObject(validationErrors)) {
    return json({ validationErrors: validationErrors });
  }

  try {
    const { user, validationErrors: verifyValidationErrors } =
      await verifyLogin(email as string, password as string, false);

    if (verifyValidationErrors) {
      return json({ validationErrors: verifyValidationErrors });
    }

    if (user) {
      const { success } = await requestNewVerifyEmail(email as string, "email");
      return json({ success });
    } else {
      const validationErrors: ValidationErrors = {};
      validationErrors.user = "User Not Found";

      return json({ validationErrors });
    }
  } catch (error: any) {
    const validationErrors: ValidationErrors = {};
    validationErrors.error = error.message;

    return json({ validationErrors });
  }
};
