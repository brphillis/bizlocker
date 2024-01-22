import { useEffect } from "react";
import BasicInput from "~/components/Forms/Input/BasicInput";
import type { ActionReturnTypes } from "~/utility/actionTypes";
import { ActionAlert } from "~/components/Notifications/Alerts";
import { useActionData, useNavigate } from "@remix-run/react";
import AuthContainer from "~/components/Layout/Containers/AuthContainer";
import AuthPageWrapper from "~/components/Layout/Wrappers/AuthPageWrapper";
import ValidationErrorsList from "~/components/Forms/Validation/ValidationErrorsList";
import PasswordValidationErrors from "~/components/Forms/Validation/PasswordValidationErrors";
import BasicButton from "~/components/Buttons/BasicButton";

const VerifyRequest = () => {
  const navigate = useNavigate();
  const { validationErrors, success } =
    (useActionData() as ActionReturnTypes) || {};

  useEffect(() => {
    const successPopup = () => {
      ActionAlert(
        "Verification Email Sent",
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
        <p className="mb-3 select-none text-center text-xs">
          Request Verification Email
        </p>

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

        <div className="form-control mt-6 gap-3">
          <BasicButton type="submit" label="Reset Email" />

          <BasicButton label="Back" onClick={() => navigate("/login")} />
        </div>
      </AuthContainer>
    </AuthPageWrapper>
  );
};

export default VerifyRequest;
