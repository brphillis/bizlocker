import { ValidationErrors, isValidEmail } from "~/utility/validate";
import { initiatePasswordReset } from "~/models/Verification/index.server";
import { json } from "@remix-run/node";
import { isEmptyObject } from "~/helpers/objectHelpers";

export const passwordRecoveryRequestLoader = async () => {
  const meta = {
    title: "CLUTCH | Request Password Recovery",
    description:
      "Discover timeless style and effortless sophistication with Clutch Clothing Australia. Elevate your wardrobe with our curated collection of premium apparel, designed for the modern Australian lifestyle. Explore our range today and experience fashion that's as versatile as you are.",
  };

  return json({ meta });
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
