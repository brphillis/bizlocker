import { useEffect } from "react";
import { ActionReturnTypes } from "~/utility/actionTypes";
import { ActionAlert } from "~/components/Notifications/Alerts";
import { useActionData, useNavigate } from "@remix-run/react";
import ValidationErrorsList from "~/components/Forms/Validation/ValidationErrorsList";
import AuthPageWrapper from "~/components/Layout/Wrappers/AuthPageWrapper";
import AuthContainer from "~/components/Layout/Containers/AuthContainer";
import BasicButton from "~/components/Buttons/BasicButton";
import BasicInput from "~/components/Forms/Input/BasicInput";

export const PasswordRecoveryRequest = () => {
  const navigate = useNavigate();
  const { validationErrors, success } =
    (useActionData() as ActionReturnTypes) || {};

  useEffect(() => {
    const successPopup = () => {
      ActionAlert(
        "Verification Email Sent!",
        "Check your inbox to reset your password.",
        () => navigate("/login"),
      );
    };

    if (success) {
      successPopup();
    }
  }, [success, navigate]);

  return (
    <AuthPageWrapper>
      <AuthContainer sloganText="Enter your Password to Request a Reset Code">
        <BasicInput
          name="email"
          type="text"
          label="Email"
          extendContainerStyle="w-full"
          extendStyle="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
          labelStyle="text-brand-white"
          placeholder="Email"
        />

        <div className="form-control mt-3 gap-3">
          <ValidationErrorsList validationErrors={validationErrors} />

          <BasicButton type="submit" name="_action" label="Request Code" />

          <BasicButton label="Back" onClick={() => navigate("/login")} />
        </div>
      </AuthContainer>
    </AuthPageWrapper>
  );
};

export default PasswordRecoveryRequest;
