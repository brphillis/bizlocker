import { createUserSession } from "~/session.server";
import { json, type MetaFunction } from "@remix-run/node";
import {
  ValidationErrors,
  isValidEmail,
  isValidPassword,
} from "~/utility/validate";
import { googleLogin, verifyLogin } from "~/models/_Auth/login.server";
import { isEmptyObject } from "~/helpers/objectHelpers";

export const meta: MetaFunction = () => {
  return [
    { title: "CLUTCH | Login" },
    {
      name: "CLUTCH | Login",
      content: "CLUTCH | Login",
    },
  ];
};

export const loginAction = async (request: Request) => {
  const form = Object.fromEntries(await request.formData());

  switch (form._action) {
    case "login": {
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
        const { user, validationErrors: verifyValidationErrors } =
          await verifyLogin(email as string, password as string);

        if (verifyValidationErrors) {
          return json({ validationErrors: verifyValidationErrors });
        }

        if (user) {
          return await createUserSession({
            request,
            user: JSON.stringify(user),
            remember: remember === "on" ? true : false,
            redirectTo: "/",
          });
        } else {
          const validationErrors: ValidationErrors = {
            credentials: "Incorrect Credentials",
          };
          return json({ validationErrors });
        }
      } catch (error: unknown) {
        const validationErrors: ValidationErrors = {};
        validationErrors.error = (error as CatchError).message;

        return json({ validationErrors });
      }
    }

    case "googleLogin": {
      const { credential } = form;
      if (credential) {
        return await googleLogin(request, credential as string);
      }
    }
  }
};
