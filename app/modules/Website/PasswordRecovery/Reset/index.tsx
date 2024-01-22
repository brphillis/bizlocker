import { useEffect } from "react";
import { ActionReturnTypes } from "~/utility/actionTypes";
import { ActionAlert } from "~/components/Notifications/Alerts";
import AuthContainer from "~/components/Layout/Containers/AuthContainer";
import AuthPageWrapper from "~/components/Layout/Wrappers/AuthPageWrapper";
import {
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import PasswordValidationErrors from "~/components/Forms/Validation/PasswordValidationErrors";
import ValidationErrorsList from "~/components/Forms/Validation/ValidationErrorsList";

const PasswordRecoveryReset = () => {
  const navigate = useNavigate();
  const verified = useLoaderData();
  const { validationErrors, success } =
    (useActionData() as ActionReturnTypes) || {};

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    const successPopup = () => {
      ActionAlert("Reset Complete", "Your Password has been Reset.", () =>
        navigate("/login"),
      );
    };

    if (success) {
      successPopup();
    }
  }, [success, navigate]);

  return (
    <>
      {verified && (
        <AuthPageWrapper>
          <AuthContainer>
            <p className="mb-3 select-none text-center text-xs">
              Reset Password
            </p>
            <p className="mb-3 select-none text-center text-sm">{email}</p>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-brand-white">
                  New Password
                </span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="new password"
                className="input input-bordered bg-base-100 text-brand-black/50 focus:text-brand-black"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-brand-white">
                  Confirm New Password
                </span>
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="confirm new password"
                className="input input-bordered mb-3 bg-base-100 text-brand-black/50 focus:text-brand-black"
              />
            </div>

            <>
              <ValidationErrorsList validationErrors={validationErrors} />

              {validationErrors && validationErrors.passwordRequirements && (
                <PasswordValidationErrors />
              )}
            </>

            <div className="form-control mt-3">
              <p className="pb-6 text-[10px] opacity-75">
                By subscribing and / or creating an account you agree to CLUTCH
                Terms and Conditions, and Privacy Policy.
              </p>
              <button type="submit" className="btn btn-primary mb-3">
                Register
              </button>

              <Link to="/login" type="button" className="btn btn-primary">
                Back
              </Link>
            </div>
          </AuthContainer>
        </AuthPageWrapper>
      )}
    </>
  );
};

export default PasswordRecoveryReset;
