import { useEffect } from "react";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { registerUser } from "~/models/auth/register.server";
import AuthContainer from "~/components/Layout/Containers/AuthContainer";
import { ActionAlert } from "~/components/Notifications/Alerts";
import AuthPageWrapper from "~/components/Layout/Wrappers/AuthPageWrapper";
import { isValidEmail, isValidPassword } from "~/utility/validate";
import { NavLink, useActionData, useNavigate } from "@remix-run/react";
import {
  json,
  type ActionFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import BasicInput from "~/components/Forms/Input/BasicInput";
import PasswordValidationErrors from "~/components/Forms/Validation/PasswordValidationErrors";
import ValidationErrorsList from "~/components/Forms/Validation/ValidationErrorsList";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: "CLUTCH | Register" },
    {
      name: "CLUTCH | Register",
      content: "CLUTCH | Register",
    },
  ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = Object.fromEntries(await request.formData());
  const { email, password, confirmPassword } = form;
  let validationErrors: string[] = [];

  if (password !== confirmPassword) {
    validationErrors.push("Passwords Do Not Match");
  }

  if (!isValidEmail(email as string)) {
    validationErrors.push("Invalid Email Address");
  }

  if (!isValidPassword(password as string)) {
    validationErrors.push("Password Does Not Meet Requirements");
  }

  if (validationErrors.length > 0) {
    return json({ validationErrors });
  }

  try {
    const { success } = await registerUser(email as string, password as string);
    return json({ success });
  } catch (error: any) {
    const validationErrors = [error.message];
    return json({ validationErrors });
  }
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { validationErrors, success } =
    (useActionData() as ActionReturnTypes) || {};

  useEffect(() => {
    const successPopup = () => {
      ActionAlert(
        "Registration Complete",
        "We Have Sent You a Verification Email.",
        () => navigate("/login"),
      );
    };

    if (success) {
      successPopup();
    }
  }, [success, navigate]);

  return (
    <AuthPageWrapper>
      <AuthContainer>
        <BasicInput
          name="email"
          type="text"
          label="Email"
          customWidth="w-full"
          extendStyle="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          labelStyle="text-brand-white"
          placeholder="Email"
        />

        <BasicInput
          name="password"
          type="password"
          label="Password"
          customWidth="w-full"
          extendStyle="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          labelStyle="text-brand-white"
          placeholder="Password"
        />

        <BasicInput
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          customWidth="w-full"
          extendStyle="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          labelStyle="text-brand-white"
          placeholder="Confirm Password"
        />

        {validationErrors && (
          <ValidationErrorsList
            validationErrors={validationErrors}
            extendStyle="pt-3"
          />
        )}

        {validationErrors && (
          <PasswordValidationErrors
            validationErrors={validationErrors}
            extendStyle="pt-3"
          />
        )}

        <div className="form-control mt-6">
          <p className="pb-6 text-[10px] opacity-75">
            By subscribing and / or creating an account you agree to CLUTCH
            Terms and Conditions, and Privacy Policy.
          </p>
          <button type="submit" className="btn btn-primary mb-3 !rounded-sm">
            Register
          </button>
          <NavLink
            to="/login"
            type="button"
            className="btn btn-primary !rounded-sm"
          >
            Back
          </NavLink>
        </div>
      </AuthContainer>
    </AuthPageWrapper>
  );
}
