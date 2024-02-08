import { isEmptyObject } from "~/helpers/objectHelpers";
import { json } from "@remix-run/node";
import { registerUser } from "~/models/_Auth/register.server";
import {
  isValidEmail,
  isValidPassword,
  ValidationErrors,
} from "~/utility/validate";

export const registerLoader = async () => {
  const meta = {
    title: "CLUTCH | Register",
    description:
      "Discover timeless style and effortless sophistication with Clutch Clothing Australia. Elevate your wardrobe with our curated collection of premium apparel, designed for the modern Australian lifestyle. Explore our range today and experience fashion that's as versatile as you are.",
  };

  return json({ meta });
};

export const registerAction = async (request: Request) => {
  const form = Object.fromEntries(await request.formData());
  const { email, password, confirmPassword } = form;
  const validationErrors: ValidationErrors = {};

  if (password !== confirmPassword) {
    validationErrors.password = "Passwords Do Not Match";
  }

  if (!isValidEmail(email as string)) {
    validationErrors.email = "Invalid Email Address";
  }

  if (!isValidPassword(password as string)) {
    validationErrors.passwordRequirements =
      "Password Does Not Meet Requirements";
  }

  if (!isEmptyObject(validationErrors)) {
    return json({ validationErrors });
  }

  try {
    const { success } = await registerUser(email as string, password as string);
    return json({ success });
  } catch (error: unknown) {
    const validationErrors: ValidationErrors = {};
    validationErrors.error = (error as CatchError).message;

    return json({ validationErrors });
  }
};
