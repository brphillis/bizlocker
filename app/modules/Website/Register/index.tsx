import { useEffect } from "react";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import AuthContainer from "~/components/Layout/Containers/AuthContainer";
import { ActionAlert } from "~/components/Notifications/Alerts";
import AuthPageWrapper from "~/components/Layout/Wrappers/AuthPageWrapper";
import { useActionData, useNavigate } from "@remix-run/react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import PasswordValidationErrors from "~/components/Forms/Validation/PasswordValidationErrors";
import ValidationErrorsList from "~/components/Forms/Validation/ValidationErrorsList";
import BasicButton from "~/components/Buttons/BasicButton";

export const Register = () => {
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
          extendContainerStyle="w-full"
          extendStyle="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          labelStyle="text-brand-white"
          placeholder="Email"
        />

        <BasicInput
          name="password"
          type="password"
          label="Password"
          extendContainerStyle="w-full"
          extendStyle="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          labelStyle="text-brand-white"
          placeholder="Password"
        />

        <BasicInput
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          extendContainerStyle="w-full"
          extendStyle="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          labelStyle="text-brand-white"
          placeholder="Confirm Password"
        />

        <>
          {validationErrors && (
            <ValidationErrorsList
              extendStyle="pt-3"
              validationErrors={validationErrors}
            />
          )}

          {validationErrors && validationErrors.passwordRequirements && (
            <PasswordValidationErrors extendStyle="pt-3" />
          )}
        </>

        <div className="form-control mt-3">
          <p className="py-3 text-[10px] opacity-75">
            By subscribing and / or creating an account you agree to CLUTCH
            Terms and Conditions, and Privacy Policy.
          </p>
          <div className="form-control gap-3">
            <BasicButton type="submit" label="Submit" />

            <BasicButton label="Back" onClick={() => navigate("/login")} />
          </div>
        </div>
      </AuthContainer>
    </AuthPageWrapper>
  );
};

export default Register;
