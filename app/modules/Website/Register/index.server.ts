import { isEmptyObject } from "~/helpers/objectHelpers";
import { json, type MetaFunction } from "@remix-run/node";
import { registerUser } from "~/models/_Auth/register.server";
import {
  isValidEmail,
  isValidPassword,
  ValidationErrors,
} from "~/utility/validate";

export const meta: MetaFunction = () => {
  return [
    { title: "CLUTCH | Register" },
    {
      name: "CLUTCH | Register",
      content: "CLUTCH | Register",
    },
  ];
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
