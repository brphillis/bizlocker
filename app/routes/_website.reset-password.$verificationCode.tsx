import {
  Link,
  useActionData,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { type ActionArgs } from "@remix-run/server-runtime";
import { verifyPasswordReset } from "~/models/auth/verification.server";
import AuthPageWrapper from "~/components/Layout/AuthPageWrapper";
import AuthContainer from "~/components/Layout/AuthContainer";
import { isValidPassword } from "~/utility/validate";
import { resetUserPassword } from "~/models/auth/register.server";
import { useEffect } from "react";
import { ActionAlert } from "~/components/Notifications/Alerts";

export const loader = async ({ params, request }: ActionArgs) => {
  const url = new URL(request.url);
  const verificationCode = params.verificationCode;
  const emailAddress = url.searchParams.get("email");

  if (emailAddress && verificationCode) {
    const { success: verified, email } = await verifyPasswordReset(
      emailAddress,
      verificationCode,
      false
    );
    return { verified, email };
  } else return false;
};

export const action = async ({ request, params }: ActionArgs) => {
  const url = new URL(request.url);
  const verificationCode = params.verificationCode;
  const emailAddress = url.searchParams.get("email");

  const form = Object.fromEntries(await request.formData());

  const { password, confirmPassword } = form;
  let validationError: string[] = [];

  if (password !== confirmPassword) {
    validationError.push("Passwords Do Not Match");
  }

  if (!isValidPassword(password as string)) {
    validationError.push("Password Does Not Meet Requirements");
  }

  if (validationError.length > 0) {
    return { validationError };
  }

  try {
    if (emailAddress && verificationCode) {
      const { success, email } = await verifyPasswordReset(
        emailAddress,
        verificationCode,
        true
      );

      if (success && email) {
        await resetUserPassword(email, password as string);
        return { success: true };
      } else {
        const validationError = ["Not Authorized."];
        return { validationError };
      }
    } else {
      const validationError = ["Not Authorized."];
      return { validationError };
    }
  } catch (error: any) {
    const validationError = [error.message];
    return { validationError };
  }
};

const ResetPassword = () => {
  const navigate = useNavigate();
  const verified = useLoaderData();
  const { validationError, success } =
    (useActionData() as { validationError: string[]; success: boolean }) || {};

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    const successPopup = () => {
      ActionAlert("Reset Complete", "Your Password has been Reset.", () =>
        navigate("/login")
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
              {validationError?.length > 0 &&
                validationError?.map((error: string, i) => {
                  return (
                    <p
                      key={error + i}
                      className="mt-1 text-center text-xs text-red-500/75"
                    >
                      {error}
                    </p>
                  );
                })}

              {validationError?.includes("Password" && "Requirements") && (
                <div className="flex flex-col items-start text-[10px] text-red-500/75">
                  <div>- At least one uppercase letter (A-Z) </div>
                  <div>- At least one lowercase letter (a-z) </div>
                  <div>
                    - At least one digit (0-9) - At least one special character
                    (!@#$%^&*)
                  </div>
                  <div>- At least 8 characters long, but no more than 32</div>
                </div>
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

export default ResetPassword;
