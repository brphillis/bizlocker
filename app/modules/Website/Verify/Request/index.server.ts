import { verifyLogin } from "~/models/_Auth/login.server";
import { json } from "@remix-run/node";
import {
  ValidationErrors,
  isValidEmail,
  isValidPassword,
} from "~/utility/validate";
import { requestNewVerifyEmail } from "~/models/Verification/index.server";
import { isEmptyObject } from "~/helpers/objectHelpers";

export const verifyRequestLoader = async () => {
  const meta = {
    title: "CLUTCH | Request Verification",
    description:
      "Discover timeless style and effortless sophistication with Clutch Clothing Australia. Elevate your wardrobe with our curated collection of premium apparel, designed for the modern Australian lifestyle. Explore our range today and experience fashion that's as versatile as you are.",
  };

  return json({ meta });
};

export const verifyRequestAction = async (request: Request) => {
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
  } catch (error: unknown) {
    const validationErrors: ValidationErrors = {};
    validationErrors.error = (error as CatchError).message;

    return json({ validationErrors });
  }
};
