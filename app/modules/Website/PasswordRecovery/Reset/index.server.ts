import { Params } from "@remix-run/react";
import { isEmptyObject } from "~/helpers/objectHelpers";
import { json, type MetaFunction } from "@remix-run/node";
import { resetUserPassword } from "~/models/auth/register.server";
import { isValidPassword, ValidationErrors } from "~/utility/validate";
import { verifyPasswordReset } from "~/models/auth/verification.server";

export const meta: MetaFunction = () => {
  return [
    { title: "CLUTCH | Verification" },
    {
      name: "CLUTCH | Verification",
      content: "CLUTCH | Verification",
    },
  ];
};

export const passwordRecoveryResetLoader = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);
  const verificationCode = params.verificationCode;
  const emailAddress = url.searchParams.get("email");

  if (emailAddress && verificationCode) {
    const { success: verified, email } = await verifyPasswordReset(
      emailAddress,
      verificationCode,
      false,
    );
    return json({ verified, email });
  } else return false;
};

export const passwordRecoveryResetAction = async (
  request: Request,
  params: Params<string>,
) => {
  const url = new URL(request.url);
  const verificationCode = params.verificationCode;
  const emailAddress = url.searchParams.get("email");

  const form = Object.fromEntries(await request.formData());
  const { password, confirmPassword } = form;

  const validationErrors: ValidationErrors = {};

  if (password !== confirmPassword) {
    validationErrors.password = "Passwords Do Not Match";
  }

  if (!isValidPassword(password as string)) {
    validationErrors.passwordRequirements =
      "Password Does Not Meet Requirements";
  }

  if (!isEmptyObject(validationErrors)) {
    return json({ validationErrors });
  }

  try {
    if (emailAddress && verificationCode) {
      const { success, email } = await verifyPasswordReset(
        emailAddress,
        verificationCode,
        true,
      );

      if (success && email) {
        await resetUserPassword(email, password as string);
        return { success: true };
      } else {
        validationErrors.authorized = "Not Authorized.";
        return { validationErrors };
      }
    } else {
      validationErrors.authorized = "Not Authorized.";
      return { validationErrors };
    }
  } catch (error: any) {
    const validationErrors: ValidationErrors = {};
    validationErrors.error = error.message;

    return json({ validationErrors });
  }
};
