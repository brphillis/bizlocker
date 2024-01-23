import { ValidationErrors, isValidEmail } from "~/utility/validate";
import { initiatePasswordReset } from "~/models/Verification/index.server";
import { json, type MetaFunction } from "@remix-run/node";
import { isEmptyObject } from "~/helpers/objectHelpers";

export const meta: MetaFunction = () => {
  return [
    { title: "CLUTCH | Forgot Password" },
    {
      name: "CLUTCH | Forgot Password",
      content: "CLUTCH | Forgot Password",
    },
  ];
};

export const passwordRecoveryRequestAction = async (request: Request) => {
  const form = Object.fromEntries(await request.formData());
  const { email } = form;

  const validationErrors: ValidationErrors = {};

  if (!isValidEmail(email as string)) {
    validationErrors.email = "Invalid Email Address";
  }

  if (!isEmptyObject(validationErrors)) {
    return json({ success: false, validationErrors: validationErrors });
  }

  try {
    const { success, validationErrors } = await initiatePasswordReset(
      email as string,
    );

    if (validationErrors) {
      return json({ success: false, validationErrors: validationErrors });
    }

    return json({ success });
  } catch (error: unknown) {
    const validationErrors: ValidationErrors = {};
    validationErrors.error = (error as CatchError).message;

    return json({ validationErrors });
  }
};
